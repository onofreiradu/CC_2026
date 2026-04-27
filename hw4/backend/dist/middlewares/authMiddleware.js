"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.[config_1.config.auth.cookieName];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized1' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.auth.jwtSecret);
        const userIdClaim = decoded.userId ?? decoded.sub;
        const username = decoded.username;
        if (userIdClaim == null || !username) {
            res.status(401).json({ error: 'Invalid token payload' });
            return;
        }
        const userId = typeof userIdClaim === 'string' ? Number.parseInt(userIdClaim, 10) : userIdClaim;
        if (Number.isNaN(userId)) {
            res.status(401).json({ error: 'Invalid token payload' });
            return;
        }
        req.authUser = { userId, username };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Unauthorized2' });
    }
}
