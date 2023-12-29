import { Router } from 'express';
import { body } from 'express-validator';
import cardController from '../controllers/card-controller';

const router = Router();

router.get('/', cardController.getCards);
router.post(
  '/',
  body('name').isString().isLength({ min: 2, max: 30 }),
  body('link').isURL(),
  cardController.createCard,
);
router.delete('/:cardId', cardController.deleteCard);
router.put('/:cardId/likes', cardController.likeCard);
router.delete('/:cardId/likes', cardController.dislikeCard);

export default router;
