require('dotenv').config();
import express from 'express';

const PORT = process.env.PORT || 3000;
const app = express();

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

start();