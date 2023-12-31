import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user-model';
import ApiError from '../exceptions/api-error';

dotenv.config();

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserModel.find({});
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserModel.findById(req.params.userId);
      if (!user) {
        throw ApiError.NotFound('Пользователь по указанному _id не найден');
      }
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserModel.findById(req.user._id);
      if (!user) {
        throw ApiError.NotFound('Пользователь по указанному _id не найден');
      }
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest('Переданы некорректные данные при регистрации', errors.array());
      }
      const { email, password, name, about, avatar } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ email, password: hashPassword, name, about, avatar });
      return res.json(user);
    } catch (error: any) {
      if (error.code === 11000) {
        next(ApiError.Conflict('При регистрации указан email, который уже существует на сервере'));
      } else {
        next(error);
      }
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest('Переданы некорректные данные при авторизации', errors.array());
      }
      const { email, password } = req.body;
      const user = await UserModel.findUserByCredentials(email, password);
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'jwt-secret-key', { expiresIn: '7d' });
      return res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    } catch (error) {
      next(error);
    }
  }

  async patchUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest('Переданы некорректные данные при обновлении профиля', errors.array());
      }
      const { name, about } = req.body;
      const user = await UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
      if (!user) {
        throw ApiError.NotFound('Пользователь с указанным _id не найден');
      }
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async patchUserAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest('Переданы некорректные данные при обновлении аватара', errors.array());
      }
      const { avatar } = req.body;
      const user = await UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
      if (!user) {
        throw ApiError.NotFound('Пользователь с указанным _id не найден');
      }
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
