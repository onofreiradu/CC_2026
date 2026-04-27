"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const getUserController_1 = require("../controllers/getUserController");
const uploadProfilePictureController_1 = require("../controllers/uploadProfilePictureController");
const getProfilePictureController_1 = require("../controllers/getProfilePictureController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const userRoutes = (0, express_1.Router)();
userRoutes.get('/me', authMiddleware_1.authMiddleware, getUserController_1.getUserController);
userRoutes.post('/upload-profile-picture', authMiddleware_1.authMiddleware, upload.single('profilePicture'), uploadProfilePictureController_1.uploadProfilePictureController);
userRoutes.get('/profile-picture', authMiddleware_1.authMiddleware, getProfilePictureController_1.getProfilePictureController);
// http://localhost:3010/users/profile-picture 
//userRoutes.get('/:userId/profile-picture', getProfilePictureController);
exports.default = userRoutes;
