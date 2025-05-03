import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { logger } from './utils/logger';
import { routes } from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(morgan(':method :url :response-time'));

app.use('/api', routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

/* Start the Express app and listen for incoming requests on the specified port */
app.listen(port, () => {
  logger.info({
    message: `[server]: Server is running at http://localhost:${port}`
  });
});