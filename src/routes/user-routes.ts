import { Router } from 'express';
import { body } from 'express-validator';
import userController from '../controllers/user-controller';

const router = Router();

router.get('/', userController.getUsers);
router.get('/:userId', userController.getUser);
router.post(
  '/',
  body('name').isString().isLength({ min: 2, max: 30 }),
  body('about').isString().isLength({ min: 2, max: 200 }),
  body('avatar').isURL(),
  userController.createUser,
);
router.patch(
  '/me',
  body('name').isString().isLength({ min: 2, max: 30 }),
  body('about').isString().isLength({ min: 2, max: 200 }),
  userController.patchUserInfo,
);
router.patch(
  '/me/avatar',
  body('avatar').isURL(),
  userController.patchUserAvatar,
);

export default router;
