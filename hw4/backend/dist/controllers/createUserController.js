"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = createUserController;
const createUserService_1 = require("../services/createUserService");
const logger_1 = require("../utils/logger");
async function createUserController(req, res) {
    try {
        const { username, email, full_name: fullName, password, birth_date: birthDate, phone_number: phoneNumber, profile_picture_url: profilePictureUrl, } = req.body;
        if (!username || !email || !fullName || !password) {
            await (0, logger_1.logUserAction)('Failed user creation attempt', { username, email, fullName });
            res.status(400).json({ error: 'username, email, full_name, and password are required' });
            return;
        }
        const createdUser = await (0, createUserService_1.createUserService)({
            username,
            email,
            fullName,
            password,
            birthDate,
            phoneNumber,
            profilePictureUrl,
        });
        await (0, logger_1.logUserAction)('User created', { userId: createdUser.id, imageUrl: createdUser.profile_picture_url });
        res.status(201).json(createdUser);
    }
    catch (error) {
        const pgError = error;
        if (pgError.code === '23505') {
            await (0, logger_1.logUserAction)('User creation failed', { error: "email or username already exists", detail: pgError.detail });
            res.status(409).json({ error: 'email or username already exists', detail: pgError.detail });
            return;
        }
        await (0, logger_1.logUserAction)('User creation failed', { error: pgError.message });
        res.status(500).json({ error: 'failed to create user', detail: pgError.message });
    }
}
