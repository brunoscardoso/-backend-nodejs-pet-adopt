import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import PetsController from './controllers/PetsController';

const routes = express.Router();
const upload = multer(multerConfig);

const petsController = new PetsController();

routes.get('/pets', petsController.index);
routes.post('/pets', upload.single('photo'), petsController.create);
routes.get('/pets/:id', petsController.show);
routes.put('/pets/:id', petsController.update);

export default routes;