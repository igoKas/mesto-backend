import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/error-middleware';
import userRouter from './routes/user-routes';
import cardRouter from './routes/card-routes';
import authRouter from './routes/auth-routes';
import authMiddleware from './middlewares/auth-middleware';
import { requestLogger, errorLogger } from './middlewares/logger';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
app.use('/', authRouter);
app.use('/users', authMiddleware, userRouter);
app.use('/cards', authMiddleware, cardRouter);
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
