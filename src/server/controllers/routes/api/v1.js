import express from 'express';
import * as api from '../../api';
import {routeWrapper} from '../../lib';

// usage: router.post('/urls', api.routerWrapper(api.urls.generateShortUrl));
// or:
// // usage: router.post('/urls',
//                        passport.middleware,
//                        api.routerWrapper(api.urls.generateShortUrl));
var router = express.Router();

// configure routes

// ## handle url associated requests
router.post('/urls', routeWrapper(api.urls.generateShortUrl));

export {router as v1};
