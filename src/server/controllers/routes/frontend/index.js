import express from 'express';
import {handleUrlResolution, handleHomePage} from '../../frontend';

var router = express.Router();

// set the homepage route settings and resolving logic
router.get('/', handleHomePage);

/*
  resolve and redirect get request for short url's e.g.
  http://www.example.com/3d8fa7
*/
router.get('/*', handleUrlResolution);

export {router as frontEnd};
