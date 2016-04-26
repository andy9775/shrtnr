/**
 * An opensource URL shortener
 *
 * Coded by: Andy (github.com/andy9775)
 */
// ============= VS code typings reference =============
/// <reference path="typings/main.d.ts" />
// =====================================================

import express from 'express';
import render from '../lib/render';
import routes from '../../shared/routes';

var router = express.Router();

router.get('/', (req, res) => {
  render(routes, req.url)
  .then(resp => {
    res.render('index', {body: resp.html})
  })
  .catch(() => res.status(500).send('Error rendering page'));
});
export {router as HomePage};