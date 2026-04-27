"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meController = meController;
const logger_1 = require("../utils/logger");
async function meController(req, res) {
    const authUser = req.authUser;
    if (!authUser) {
        await (0, logger_1.logUserAction)('Unauthorized profile access attempt', { userId: null });
        res.status(401).json({ error: 'Unauthorized3' });
        return;
    }
    await (0, logger_1.logUserAction)('Profile accessed', { userId: authUser.userId });
    res.status(200).json({ userId: authUser.userId, username: authUser.username });
}
