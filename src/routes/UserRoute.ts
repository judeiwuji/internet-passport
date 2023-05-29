import { Router } from 'express';
import UserController from '../controllers/UserController';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/dashboard', (req, res) =>
  userController.getDashboard(req, res)
);
userRouter.get('/profile', userController.getProfilePage);
userRouter.put('/profile', (req, res) =>
  userController.updateProfile(req, res)
);
userRouter.post('/updateSecret', (req, res) =>
  userController.updateSecret(req, res)
);
userRouter.delete('/users/apps/:id', (req, res) =>
  userController.deleteApp(req, res)
);
userRouter.delete('/users/devices/:id', (req, res) =>
  userController.deleteDevice(req, res)
);
userRouter.get('/users/public/profile', (req, res) =>
  userController.getPublicProfile(req, res)
);
export default userRouter;
