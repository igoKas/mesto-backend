import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import CardModel from '../models/card-model';
import ApiError from '../exceptions/api-error';

class CardController {
  async getCards(req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await CardModel.find({});
      return res.json(cards);
    } catch (error) {
      next(error);
    }
  }

  async createCard(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest('Переданы некорректные данные при создании карточки', errors.array());
      }
      const { name, link, userId } = req.body;
      const card = await CardModel.create({ name, link, owner: userId });
      return res.json(card);
    } catch (error) {
      next(error);
    }
  }

  async deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
      const card = await CardModel.findByIdAndDelete(req.params.cardId);
      if (!card) {
        throw ApiError.NotFound('Карточка с указанным _id не найдена');
      }
      return res.json(card);
    } catch (error) {
      next(error);
    }
  }

  async likeCard(req: Request, res: Response, next: NextFunction) {
    try {
      const card = await CardModel.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.body.userId } },
        { new: true },
      );
      if (!card) {
        throw ApiError.NotFound('Передан несуществующий _id карточки');
      }
      return res.json(card);
    } catch (error) {
      next(error);
    }
  }

  async dislikeCard(req: Request, res: Response, next: NextFunction) {
    try {
      const card = await CardModel.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.body.userId } },
        { new: true },
      );
      if (!card) {
        throw ApiError.NotFound('Передан несуществующий _id карточки');
      }
      return res.json(card);
    } catch (error) {
      next(error);
    }
  }
}

export default new CardController();
