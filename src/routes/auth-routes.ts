import { Router } from 'express';
import { body } from 'express-validator';
import userController from '../controllers/user-controller';

const router = Router();

router.post(
  '/signup',
  body('email').trim().notEmpty().isEmail(),
  body('password').trim().notEmpty().isString(),
  body('name').trim().optional().isString()
    .isLength({ min: 2, max: 30 }),
  body('about').trim().optional().isString()
    .isLength({ min: 2, max: 200 }),
  body('avatar').trim().optional().isURL(),
  userController.createUser,
);

router.post(
  '/signin',
  body('email').trim().notEmpty().isEmail(),
  body('password').trim().notEmpty().isString(),
  userController.login,
);

export default router;
