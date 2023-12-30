import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import UserModel from '../models/user-model';
import ApiError from '../exceptions/api-error';

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

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest('Переданы некорректные данные при создании пользователя', errors.array());
      }
      const { name, about, avatar } = req.body;
      const user = await UserModel.create({ name, about, avatar });
      return res.json(user);
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
