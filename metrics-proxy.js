// Simple metrics proxy to avoid CORS and mixed content issues
app.get('/api/proxy/metrics', async (req, res) => {
    try {
        // Add CORS headers
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        
        // Forward request to internal metrics API
        const response = await fetch('http://metrics-api:3008/api/metrics');
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('Metrics proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
});