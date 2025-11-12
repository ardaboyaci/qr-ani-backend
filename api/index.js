export default function handler(req, res) {
    res.status(200).json({
        message: 'QR Anı Backend API is running!',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api',
            memories: '/api/memories',
            qr: '/api/qr'
        }
    });
}
