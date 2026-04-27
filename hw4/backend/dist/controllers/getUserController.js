"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserController = getUserController;
const getUserService_1 = require("../services/getUserService");
const logger_1 = require("../utils/logger");
async function getUserController(req, res) {
    const authUser = req.authUser;
    if (!authUser) {
        await (0, logger_1.logUserAction)('Unauthorized user profile retrieval attempt', { userId: null });
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const user = await (0, getUserService_1.getUserService)(authUser.userId);
    if (!user) {
        await (0, logger_1.logUserAction)('User profile not found', { userId: authUser.userId });
        res.status(404).json({ error: 'User not found' });
        return;
    }
    await (0, logger_1.logUserAction)('User profile retrieved', { userId: authUser.userId });
    res.status(200).json(user);
}
