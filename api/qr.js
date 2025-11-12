import { v4 as uuidv4 } from 'uuid';
// Enable CORS
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
export default async function handler(req, res) {
    setCorsHeaders(res);
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    try {
        switch (req.method) {
            case 'POST':
                // Generate QR code data
                const { memoryId, data } = req.body;
                if (!memoryId && !data) {
                    res.status(400).json({ error: 'Either memoryId or data is required' });
                    return;
                }
                const qrCodeData = {
                    id: uuidv4(),
                    memoryId: memoryId || null,
                    data: data || null,
                    url: `${process.env.FRONTEND_URL || 'https://qr-ani.vercel.app'}/memory/${memoryId || uuidv4()}`,
                    created_at: new Date().toISOString()
                };
                // In a real implementation, you might want to:
                // 1. Save this to a database
                // 2. Generate actual QR code image
                // 3. Upload to storage
                res.status(200).json({
                    success: true,
                    qrCode: qrCodeData,
                    qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeData.url)}`
                });
                break;
            case 'GET':
                // Get QR code by ID
                const { id } = req.query;
                if (!id) {
                    res.status(400).json({ error: 'QR code ID is required' });
                    return;
                }
                // Mock response for now
                res.status(200).json({
                    id: id,
                    url: `${process.env.FRONTEND_URL || 'https://qr-ani.vercel.app'}/memory/${id}`,
                    qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${process.env.FRONTEND_URL || 'https://qr-ani.vercel.app'}/memory/${id}`)}`
                });
                break;
            default:
                res.status(405).json({ error: 'Method not allowed' });
        }
    }
    catch (error) {
        console.error('QR API Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
