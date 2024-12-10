import dotenv from 'dotenv';

dotenv.config();

import boom from 'express-boom';
import express, { Express } from 'express';
import { HttpLogger, Logger } from './helper';
import cors from 'cors';
import { routes } from './routes';
import { DBConnection } from './config/dbPoolInfra';
import { rabbitMqConnection } from './config/rabbitmqPoolInfra';


const app: Express = express();
const port = 8000

// Middleware
app.use(boom());
app.use(cors({
    origin: '*',
}));
app.use(HttpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routes.forEach(route => {
    app.use(route.path, route.router);
});

app.listen(port, async (): Promise<void> => {
  try {
      await DBConnection();
      await rabbitMqConnection();
      Logger.info(`[Bun-Service] Server is running on port ${port}`);
  } catch (error) {
      if (error instanceof Error) {
          Logger.error(
              `Error starting server: Message: ${error.message} | Stack: ${error.stack}`
          );
      } else {
          Logger.error(`Error starting server: ${String(error)}`);
      }
  }
});

