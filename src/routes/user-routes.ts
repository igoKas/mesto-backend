import { Router } from 'express';
import { body } from 'express-validator';
import userController from '../controllers/user-controller';

const router = Router();

router.get('/', userController.getUsers);
router.get('/me', userController.getCurrentUser);
router.get('/:userId', userController.getUser);
router.patch(
  '/me',
  body('name').trim().isString().isLength({ min: 2, max: 30 }),
  body('about').trim().isString().isLength({ min: 2, max: 200 }),
  userController.patchUserInfo,
);
router.patch(
  '/me/avatar',
  body('avatar').trim().isURL(),
  userController.patchUserAvatar,
);

export default router;
