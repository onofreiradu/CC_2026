"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePictureController = uploadProfilePictureController;
const uploadProfilePictureService_1 = require("../services/uploadProfilePictureService");
const logger_1 = require("../utils/logger");
async function uploadProfilePictureController(req, res) {
    const authUser = req.authUser;
    if (!authUser) {
        await (0, logger_1.logUserAction)('Unauthorized profile picture upload attempt', { userId: null });
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!req.file) {
        await (0, logger_1.logUserAction)('No file uploaded for profile picture', { userId: authUser.userId });
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        await (0, logger_1.logUserAction)('Invalid file type uploaded for profile picture', { userId: authUser.userId, mimeType: req.file.mimetype });
        res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and WebP allowed.' });
        return;
    }
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxFileSize) {
        await (0, logger_1.logUserAction)('File too large for profile picture upload', { userId: authUser.userId, fileSize: req.file.size });
        res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
        return;
    }
    try {
        const imageUrl = await (0, uploadProfilePictureService_1.uploadProfilePictureService)(authUser.userId, req.file.buffer, req.file.originalname, req.file.mimetype // Pass this down!
        );
        await (0, logger_1.logUserAction)('Profile picture uploaded successfully', { userId: authUser.userId, imageUrl });
        res.status(200).json({ imageUrl });
    }
    catch (error) {
        await (0, logger_1.logUserAction)('Profile picture upload failed', { userId: authUser.userId, error: error.message });
        console.error('Profile picture upload error:', error);
        res.status(500).json({ error: 'Failed to upload profile picture' });
    }
}
