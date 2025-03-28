import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { connectToDB } from './config/db';

import ErrorHandler from './middlewares/ErrorHandlers';
import { HttpException } from './utils/HttpExceptions';
import { AppRoutes } from './routes/AppRoutes';


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


// Routes
app.use("/api", AppRoutes);


// Handle not existing routes
app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new HttpException(404, "Route not found"));
});


// Error handling
app.use(ErrorHandler);


// app init function
const port = process.env.PORT || 3001;
const initializeApp = async () => {
    try {
        app.listen(port, () => {
            console.log(`[server]: server is running at http://localhost:${port}/api`)
        })
        await connectToDB();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


// call the app init function
initializeApp();