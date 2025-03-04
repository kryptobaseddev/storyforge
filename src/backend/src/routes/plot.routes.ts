/**
 * Plot Routes
 * 
 * This file defines the routes for plot-related operations, including
 * creating, retrieving, updating, and deleting plots and plot points.
 */

import express, { Request, Response, NextFunction } from 'express';
import * as plotController from '../controllers/plot.controller';
import { protect, projectAccess } from '../middleware/auth.middleware';

const router = express.Router({ mergeParams: true });

// All routes are protected
router.use(protect as express.RequestHandler);
router.use(projectAccess as express.RequestHandler);

// Plot routes
router.get('/', plotController.getPlots as unknown as express.RequestHandler);
router.post('/', plotController.createPlot as unknown as express.RequestHandler);

router.get('/:id', plotController.getPlotById as unknown as express.RequestHandler);
router.put('/:id', plotController.updatePlot as unknown as express.RequestHandler);
router.delete('/:id', plotController.deletePlot as unknown as express.RequestHandler);

// Plot point routes
router.post('/:id/points', plotController.addPlotPoint as unknown as express.RequestHandler);
router.put('/:id/points/:pointId', plotController.updatePlotPoint as unknown as express.RequestHandler);
router.delete('/:id/points/:pointId', plotController.deletePlotPoint as unknown as express.RequestHandler);

export default router; 