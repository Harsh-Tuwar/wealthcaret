import expres from 'express';
import { pickerRouter } from './picker';

export const routes = expres.Router();

routes.use("/picker", pickerRouter);
