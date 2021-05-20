import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import { Env, Headers } from './lib/enums';
import * as core from "express-serve-static-core";
import { logExpress } from '@7dev-works/log-express';
import express, { Request, Response, NextFunction } from 'express';

class ExpressServer {

    constructor(private app: core.Express = express()) { }

    private useMiddleware(): this {
        this.app
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use(cors({ origin: `http://localhost`, exposedHeaders: [Headers.Authorization]}))
            .use(logExpress);

        if (process.env.NODE_ENV === Env.production) {
            this.app.use(helmet());
        }
        return this;
    }

    private forwardSocket(): this {

        // TODO 

        return this;
    }

    private forwardHttp(): this {            
        /*
            POST '/api/v1/auth/login'
            POST '/api/v1/auth/register'
            POST '/api/v1/auth/send-reset-password'
            
            AUTH POST '/api/v1/auth/reset-password'
            AUTH GET '/api/v1/auth/logout'
            AUTH GET '/api/v1/api/user/all'
            AUTH PUT '/api/v1/user/update/:id'
            AUTH DELETE '/api/v1/user/delete/:id'
            */

        this.app.all('/api/v1/*', (request: Request, response: Response, next: NextFunction) => {

            enum publicRoutes {
                '/api/v1/auth/login',
                '/api/v1/auth/register',
                '/api/v1/auth/send-reset-password'
            }

            enum privateRoutes {
                '/api/v1/auth/logout',
                '/api/v1/api/user/all',
                '/api/v1/user/update/:id',
                '/api/v1/user/delete/:id',
                '/api/v1/auth/reset-password',
            }

            if (request.url in publicRoutes) {
                // send to express rest-server
                http.get();
            }
           
            if (request.url in privateRoutes) {
                // authorize and send to rest-server
            }

        });

        return this;
    }

    private request() {
        const postData = querystring.stringify({
            'msg': 'Hello World!'
        });

        const options = {
            hostname: 'www.google.com',
            port: 80,
            path: '/upload',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        // Write data to request body
        req.write(postData);
        req.end();
    }

    public start(): core.Express {
        return this.useMiddleware().forwardHttp().app;
    }
}

export default ExpressServer;