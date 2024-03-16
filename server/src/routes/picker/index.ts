import express from 'express';
import * as PickerController from '../../controllers/PickerController';

export const pickerRouter = express.Router();

pickerRouter.get("/", PickerController.GetPickerSummary_ByQuery);
pickerRouter.get("/search", PickerController.SearchPickers_ByQuery);
pickerRouter.get("/chart", PickerController.GetPickerChartData_ByQuery);
