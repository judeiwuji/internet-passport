import { Router } from 'express';
import DeveloperController from '../controllers/DeveloperController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ensureVerified from '../middlewares/ensureVerified';

const developerRouter = Router();
const developerController = new DeveloperController();

developerRouter.get(
  '/dashboard',
  ensureAuthenticated,
  ensureVerified,
  (req, res) => developerController.getDashboard(req, res)
);
developerRouter.get(
  '/profile',
  ensureAuthenticated,
  ensureVerified,
  developerController.getProfile
);
developerRouter.get(
  '/login',
  ensureAuthenticated,
  ensureVerified,
  developerController.getLoginPage
);
developerRouter.get(
  '/signup',
  ensureAuthenticated,
  ensureVerified,
  developerController.getSignupPage
);
developerRouter.post(
  '/signup',
  ensureAuthenticated,
  ensureVerified,
  (req, res) => developerController.signup(req, res)
);
developerRouter.put(
  '/profile',
  ensureAuthenticated,
  ensureVerified,
  (req, res) => developerController.updateProfile(req, res)
);
export default developerRouter;
