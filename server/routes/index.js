"use strict";
import {taskController} from '../controller'

export const router = {
  'POST/send-data': taskController.postHandler,
  'GET/download': taskController.downloadPdf,
  'default': taskController.getFakerData
};
