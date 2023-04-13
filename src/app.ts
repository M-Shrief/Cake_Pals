import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import express, { Application, Request } from 'express';
import { PORT, DB_URL, DB_NAME } from './config';
import { IRoute } from './interfaces/route.interface';
import errorMiddleware from './middlewares/error.middleware';
import morganMiddleware from './middlewares/morgan.middleware';
import { logger } from './utils/logger';
import mongoose from 'mongoose';

export default class App {
  public app: Application;
  public port: string | number;

  constructor(routes: IRoute[]) {
    this.app = express();
    this.port = PORT || 3000;
    this.initializeMiddlewares();
    this.connectToDB(DB_URL as string, DB_NAME as string);
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger.info(
        `⚡️[server]: Server is running @ http://localhost:${this.port}`
      );
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(
      cors<Request>({
        origin: 'http://localhost:3000',
        methods: ['GET'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      })
    );
    this.app.use(morganMiddleware);
  }

  private initializeRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      this.app.use('/api/v1', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private connectToDB(url: string, name: string) {
    mongoose
      .connect(url, {
        dbName: name,
        // other option are no longer required for v6+
      })
      .then(() =>
        logger.info(`⚡️[Database]: connected to database ${DB_NAME}`)
      )
      .catch((err) => console.log(err));
  }
}
