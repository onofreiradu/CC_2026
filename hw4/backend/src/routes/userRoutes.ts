import { Router } from 'express';
import multer from 'multer';
import { getUserController } from '../controllers/getUserController';
import { uploadProfilePictureController } from '../controllers/uploadProfilePictureController';
import { getProfilePictureController } from '../controllers/getProfilePictureController';
import { authMiddleware } from '../middlewares/authMiddleware';

const upload = multer({ storage: multer.memoryStorage() });

const userRoutes = Router();

userRoutes.get('/me', authMiddleware, getUserController);
userRoutes.post('/upload-profile-picture', authMiddleware, upload.single('profilePicture'), uploadProfilePictureController);
userRoutes.get('/profile-picture', authMiddleware, getProfilePictureController);
// http://localhost:3010/users/profile-picture 
//userRoutes.get('/:userId/profile-picture', getProfilePictureController);

export default userRoutes;
