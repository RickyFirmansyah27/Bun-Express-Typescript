import dotenv from 'dotenv';

dotenv.config();

import boom from 'express-boom';
import express, { Express } from 'express';
import { HttpLogger, Logger } from './helper';

import { routes } from './routes';

const app: Express = express();
const port = 8000

// Middleware
app.use(boom());
app.use(HttpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routes.forEach(route => {
    app.use(route.path, route.router);
});

app.listen(port, async (): Promise<void> => {
  try {
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

