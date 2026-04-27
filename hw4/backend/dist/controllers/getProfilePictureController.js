"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfilePictureController = getProfilePictureController;
const getProfilePictureService_1 = require("../services/getProfilePictureService");
const logger_1 = require("../utils/logger");
async function getProfilePictureController(req, res) {
    const userId = req.authUser?.userId;
    if (!userId || Number.isNaN(userId)) {
        await (0, logger_1.logUserAction)('Invalid profile picture retrieval attempt', { userId: userId ?? null });
        res.status(400).json({ error: 'Invalid or missing user ID' });
        return;
    }
    const profilePicture = await (0, getProfilePictureService_1.getUserProfilePictureService)(userId);
    if (!profilePicture) {
        await (0, logger_1.logUserAction)('Profile picture not found', { userId, imageUrl: null });
        res.status(404).json({ error: 'No profile picture found' });
        return;
    }
    await (0, logger_1.logUserAction)('Profile picture retrieved', { userId, imageUrl: profilePicture });
    res.status(200).json(profilePicture);
}
