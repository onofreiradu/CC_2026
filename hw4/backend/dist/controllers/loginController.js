"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
exports.logoutController = logoutController;
const loginService_1 = __importDefault(require("../services/loginService"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
async function loginController(req, res) {
    let email = "";
    let password = "";
    try {
        ({ email, password } = req.body);
        if (!email || !password) {
            await (0, logger_1.logUserAction)('Failed login attempt', { email: email ?? null });
            res.status(400).json({ error: 'email and password are required' });
            return;
        }
        const token = await (0, loginService_1.default)(email, password);
        res.cookie(config_1.config.auth.cookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: config_1.config.auth.cookieSameSite,
            maxAge: config_1.config.auth.cookieMaxAgeMs,
            path: '/',
        });
        await (0, logger_1.logUserAction)('Login successful', { email });
        res.status(200).json({ message: 'Login successful' });
    }
    catch (error) {
        await (0, logger_1.logUserAction)('Login failed', { email: email ?? null, error: error.message });
        res.status(401).json({ error: 'Invalid credentials' });
    }
}
function logoutController(req, res) {
    res.clearCookie(config_1.config.auth.cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: config_1.config.auth.cookieSameSite,
        path: '/',
    });
    res.status(200).json({ message: 'Logout successful' });
}
