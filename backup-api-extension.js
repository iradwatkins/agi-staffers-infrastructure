// Backup Management API Extension for Metrics API
// Extends the existing metrics API to include backup management endpoints

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const { spawn } = require('child_process');

// Extend the existing metrics API server with backup endpoints
function addBackupEndpoints(app) {
    const BACKUP_DIR = '/backup';
    
    // Get list of all backups with metadata
    app.get('/api/backups', async (req, res) => {
        try {
            const backups = await scanBackupDirectory();
            const totalSize = backups.reduce((sum, backup) => sum + backup.sizeBytes, 0);
            
            res.json({
                backups,
                stats: {
                    total: backups.length,
                    totalSize,
                    totalSizeFormatted: formatBytes(totalSize)
                }
            });
        } catch (error) {
            console.error('Error listing backups:', error);
            res.status(500).json({ error: 'Failed to list backups' });
        }
    });

    // Download a specific backup file
    app.get('/api/backups/download/:filename', async (req, res) => {
        try {
            const filename = decodeURIComponent(req.params.filename);
            const filePath = await findBackupFile(filename);
            
            if (!filePath) {
                return res.status(404).json({ error: 'Backup file not found' });
            }

            // Security check - ensure file is in backup directory
            const resolvedPath = path.resolve(filePath);
            const backupDirResolved = path.resolve(BACKUP_DIR);
            
            if (!resolvedPath.startsWith(backupDirResolved)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            // Set headers for download
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'application/gzip');
            
            // Stream the file
            const fileStream = require('fs').createReadStream(filePath);
            fileStream.pipe(res);
            
            fileStream.on('error', (error) => {
                console.error('File stream error:', error);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to download file' });
                }
            });
            
        } catch (error) {
            console.error('Error downloading backup:', error);
            res.status(500).json({ error: 'Failed to download backup' });
        }
    });

    // Download multiple backups as a zip archive
    app.post('/api/backups/download-multiple', async (req, res) => {
        try {
            const { filenames } = req.body;
            
            if (!Array.isArray(filenames) || filenames.length === 0) {
                return res.status(400).json({ error: 'Invalid file list' });
            }

            // Set headers for zip download
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            res.setHeader('Content-Disposition', `attachment; filename="backups-${timestamp}.zip"`);
            res.setHeader('Content-Type', 'application/zip');

            // Create zip archive
            const archive = archiver('zip', { zlib: { level: 9 } });
            archive.pipe(res);

            // Add each file to the archive
            for (const filename of filenames) {
                const filePath = await findBackupFile(filename);
                if (filePath) {
                    archive.file(filePath, { name: filename });
                }
            }

            await archive.finalize();
            
        } catch (error) {
            console.error('Error creating zip archive:', error);
            res.status(500).json({ error: 'Failed to create archive' });
        }
    });

    // Delete a specific backup file
    app.delete('/api/backups/delete/:filename', async (req, res) => {
        try {
            const filename = decodeURIComponent(req.params.filename);
            const filePath = await findBackupFile(filename);
            
            if (!filePath) {
                return res.status(404).json({ error: 'Backup file not found' });
            }

            // Security check
            const resolvedPath = path.resolve(filePath);
            const backupDirResolved = path.resolve(BACKUP_DIR);
            
            if (!resolvedPath.startsWith(backupDirResolved)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            // Delete the file
            await fs.unlink(filePath);
            
            res.json({ 
                success: true, 
                message: `Deleted backup: ${filename}` 
            });
            
        } catch (error) {
            console.error('Error deleting backup:', error);
            res.status(500).json({ error: 'Failed to delete backup' });
        }
    });

    // Delete multiple backup files
    app.post('/api/backups/delete-multiple', async (req, res) => {
        try {
            const { filenames } = req.body;
            
            if (!Array.isArray(filenames) || filenames.length === 0) {
                return res.status(400).json({ error: 'Invalid file list' });
            }

            const results = [];
            
            for (const filename of filenames) {
                try {
                    const filePath = await findBackupFile(filename);
                    if (filePath) {
                        await fs.unlink(filePath);
                        results.push({ filename, success: true });
                    } else {
                        results.push({ filename, success: false, error: 'File not found' });
                    }
                } catch (error) {
                    results.push({ filename, success: false, error: error.message });
                }
            }

            res.json({ results });
            
        } catch (error) {
            console.error('Error deleting multiple backups:', error);
            res.status(500).json({ error: 'Failed to delete backups' });
        }
    });

    // Get backup storage statistics
    app.get('/api/backups/stats', async (req, res) => {
        try {
            const stats = await getBackupStats();
            res.json(stats);
        } catch (error) {
            console.error('Error getting backup stats:', error);
            res.status(500).json({ error: 'Failed to get backup statistics' });
        }
    });
}

// Helper functions
async function scanBackupDirectory() {
    const backups = [];
    
    try {
        // Scan all subdirectories
        const subdirs = ['docker-volumes', 'postgresql', 'websites', 'scripts'];
        
        for (const subdir of subdirs) {
            const subdirPath = path.join('/backup', subdir);
            
            try {
                const files = await fs.readdir(subdirPath);
                
                for (const file of files) {
                    if (file.endsWith('.tar.gz') || file.endsWith('.sql') || file.endsWith('.zip')) {
                        const filePath = path.join(subdirPath, file);
                        const stats = await fs.stat(filePath);
                        
                        backups.push({
                            name: file,
                            path: subdirPath,
                            fullPath: filePath,
                            size: formatBytes(stats.size),
                            sizeBytes: stats.size,
                            type: subdir,
                            date: stats.mtime.toISOString().slice(0, 19).replace('T', ' '),
                            age: getAgeCategory(stats.mtime),
                            mtime: stats.mtime
                        });
                    }
                }
            } catch (error) {
                console.warn(`Warning: Could not scan ${subdir}:`, error.message);
            }
        }
        
        // Sort by modification time (newest first)
        backups.sort((a, b) => b.mtime - a.mtime);
        
    } catch (error) {
        console.error('Error scanning backup directory:', error);
    }
    
    return backups;
}

async function findBackupFile(filename) {
    const subdirs = ['docker-volumes', 'postgresql', 'websites', 'scripts'];
    
    for (const subdir of subdirs) {
        const filePath = path.join('/backup', subdir, filename);
        
        try {
            await fs.access(filePath);
            return filePath;
        } catch (error) {
            // File doesn't exist in this directory, continue
        }
    }
    
    return null;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getAgeCategory(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    if (diffHours < 24) return 'today';
    if (diffDays <= 7) return 'week';
    if (diffDays <= 30) return 'month';
    return 'old';
}

async function getBackupStats() {
    try {
        // Get disk usage of backup directory
        const { stdout } = await new Promise((resolve, reject) => {
            const proc = spawn('du', ['-sh', '/backup'], { stdio: 'pipe' });
            let stdout = '';
            let stderr = '';
            
            proc.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            
            proc.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            
            proc.on('close', (code) => {
                if (code === 0) {
                    resolve({ stdout, stderr });
                } else {
                    reject(new Error(`du command failed: ${stderr}`));
                }
            });
        });
        
        const sizeMatch = stdout.match(/^(\S+)/);
        const totalSize = sizeMatch ? sizeMatch[1] : 'Unknown';
        
        // Get total disk space
        const { stdout: dfOutput } = await new Promise((resolve, reject) => {
            const proc = spawn('df', ['-h', '/'], { stdio: 'pipe' });
            let stdout = '';
            
            proc.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            
            proc.on('close', (code) => {
                resolve({ stdout });
            });
        });
        
        const dfLines = dfOutput.trim().split('\n');
        const dfData = dfLines[1].split(/\s+/);
        const totalDisk = dfData[1];
        const usedDisk = dfData[2];
        const availableDisk = dfData[3];
        const usagePercent = dfData[4];
        
        return {
            backupSize: totalSize,
            totalDisk,
            usedDisk,
            availableDisk,
            usagePercent,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Error getting backup stats:', error);
        return {
            error: 'Failed to get statistics',
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = { addBackupEndpoints };