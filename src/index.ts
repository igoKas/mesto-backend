import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import errorMiddleware from './middlewares/error-middleware';
import userRouter from './routes/user-routes';
import cardRouter from './routes/card-routes';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '658ec7854509afb352a6a081',
  };

  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
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
