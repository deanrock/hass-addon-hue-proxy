'use strict';

import express from 'express';
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', createProxyMiddleware({
  target: 'https://httpbin.org/',
  changeOrigin: true,
  onError(err, req, res) {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end('Something went wrong. And we are reporting a custom error message.' + err);
  },
  onProxyReq(proxyReq, req, res) {
    if (req.body) {
      var copy = JSON.parse(JSON.stringify(req.body));

      if (copy.alert) {
        delete copy.alert;
      }

      const body = JSON.stringify(copy);

      proxyReq.setHeader('content-length', body.length);
      proxyReq.write(body);
      proxyReq.end();
    }
  },
}));
app.listen(30000);
