import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

/*----------------------------------------------------------------------*/
// Public access routes

// Users
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users', UserController.store);
routes.put('/users/:id', UserController.update);
routes.delete('/user/:id', UserController.destroy);

export default routes;
