import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import ApiError from './exceptions/api-error';
import errorMiddleware from './middlewares/error-middleware';
import userRouter from './routes/user-routes';
import cardRouter from './routes/card-routes';
import authRouter from './routes/auth-routes';
import authMiddleware from './middlewares/auth-middleware';
import { requestLogger, errorLogger } from './middlewares/logger';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
app.use(helmet());
app.use('/', authRouter);
app.use(authMiddleware);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res, next) => {
  next(ApiError.NotFound('Запрашиваемый ресурс не найден'));
});
app.use(errorLogger);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/mestodb');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
