import express from 'express';
import knex from './database/connection';
import PetsController from './controllers/PetsController';

const routes = express.Router();
const petsController = new PetsController();

routes.get('/pets', petsController.index);
routes.post('/pets', petsController.create);
routes.get('/pets/:id', petsController.show);

export default routes;