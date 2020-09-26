import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

/*----------------------------------------------------------------------*/
// Public access routes

// Users
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users', UserController.update);
routes.put('/users/:id', UserController.store);
routes.delete('/user/:id', UserController.destroy);

export default routes;
