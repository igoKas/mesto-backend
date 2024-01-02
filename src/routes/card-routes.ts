import { Router } from 'express';
import { body, param } from 'express-validator';
import cardController from '../controllers/card-controller';

const router = Router();

router.get('/', cardController.getCards);
router.post(
  '/',
  body('name').isString().isLength({ min: 2, max: 30 }),
  body('link').isURL(),
  cardController.createCard,
);
router.delete('/:cardId', param('cardId').isMongoId(), cardController.deleteCard);
router.put('/:cardId/likes', param('cardId').isMongoId(), cardController.likeCard);
router.delete('/:cardId/likes', param('cardId').isMongoId(), cardController.dislikeCard);

export default router;
