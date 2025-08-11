// Update for metrics API to add full server backup endpoint
// This should be added to the existing metrics API server.js

// Add this route to the existing Express app in metrics-api

// Full server backup endpoint
app.post('/api/backups/server/full', async (req, res) => {
    console.log('🚀 Full server backup requested');
    
    try {
        // Execute the backup script
        const { exec } = require('child_process');
        const util = require('util');
        const execPromise = util.promisify(exec);
        
        // Run the backup script
        const { stdout, stderr } = await execPromise('/root/create-full-server-backup.sh', {
            maxBuffer: 1024 * 1024 * 10 // 10MB buffer for output
        });
        
        if (stderr && !stderr.includes('Progress:')) {
            console.error('Backup script stderr:', stderr);
        }
        
        // Extract filename from output (last line)
        const lines = stdout.trim().split('\n');
        const filename = lines[lines.length - 1];
        
        res.json({
            success: true,
            filename: filename,
            message: 'Full server backup created successfully',
            size: 'Approximately 35-40GB compressed'
        });
        
    } catch (error) {
        console.error('❌ Full server backup failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create server backup',
            details: error.message
        });
    }
});

// Download endpoint for full server backups
app.get('/api/backups/download/:filename', async (req, res) => {
    const filename = req.params.filename;
    console.log(`📥 Download requested for: ${filename}`);
    
    try {
        const fs = require('fs');
        const path = require('path');
        
        // Determine the file path based on filename
        let filePath;
        
        if (filename.startsWith('agistaffers-full-backup-')) {
            // Full server backup
            filePath = path.join('/backup/full-server', filename);
        } else {
            // Regular backup - check in different directories
            const possiblePaths = [
                path.join('/backup/docker-volumes', filename),
                path.join('/backup/websites', filename),
                path.join('/backup/postgresql', filename),
                path.join('/backup', filename)
            ];
            
            for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                    filePath = p;
                    break;
                }
            }
        }
        
        if (!filePath || !fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Backup file not found' });
        }
        
        // Get file stats
        const stats = fs.statSync(filePath);
        const fileSize = stats.size;
        
        // Set headers for download
        res.setHeader('Content-Type', 'application/gzip');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', fileSize);
        
        // Stream the file
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        
        stream.on('error', (error) => {
            console.error('Stream error:', error);
            res.status(500).json({ error: 'Failed to download backup' });
        });
        
        stream.on('end', () => {
            console.log(`✅ Download completed: ${filename}`);
        });
        
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download backup' });
    }
});

// Also update the regular /api/backups endpoint to include full server backups
// In the existing /api/backups route, add:

// Check for full server backups
const fullServerBackupDir = '/backup/full-server';
if (fs.existsSync(fullServerBackupDir)) {
    const fullBackups = fs.readdirSync(fullServerBackupDir)
        .filter(file => file.endsWith('.tar.gz'))
        .map(file => {
            const stats = fs.statSync(path.join(fullServerBackupDir, file));
            return {
                name: file,
                path: '/backup/full-server',
                fullPath: path.join(fullServerBackupDir, file),
                size: formatFileSize(stats.size),
                sizeBytes: stats.size,
                type: 'full-server',
                date: formatDate(stats.mtime),
                age: getFileAge(stats.mtime),
                isFullServerBackup: true
            };
        });
    
    // Add to the beginning of backups array
    backups.unshift(...fullBackups);
}