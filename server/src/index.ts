import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';

import * as PickerController from './controllers/PickerController';

import { logger } from './utils/logger';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/api/picker", PickerController.GetPickerSummary_ByQuery);
app.get("/api/picker/search", PickerController.SearchPickers_ByQuery);
app.get("/api/picker/chart", PickerController.GetPickerChartData_ByQuery);

/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, () => {
  logger.info({
    message: `[server]: Server is running at http://localhost:${port}`
  });
});