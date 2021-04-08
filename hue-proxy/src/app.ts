'use strict';

import express from 'express';
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
import bodyParser from 'body-parser';
import fs from 'fs';
import util from 'util';

const readFile = util.promisify(fs.readFile);

async function main() {
  const port = process.env.PORT ?? 30000;

  const options_path = process.env.OPTIONS_PATH ?? './test_options.json';
  console.log(`Using options path: ${options_path}`);

  const options = JSON.parse((await readFile(options_path)).toString());

  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/', createProxyMiddleware({
    target: `http://${options.hue_ip}/`,
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

        console.log(body);

        proxyReq.setHeader('content-length', body.length);
        proxyReq.write(body);
        proxyReq.end();
      }
    },
  }));
  app.listen(port);

}

main();
