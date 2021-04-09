import { Router } from "express";
import { AuthMiddleware, MiddlewareHandler } from '@middlewares';

export default abstract class ApiRouter {
    protected abstract router: Router;
    public abstract getRouter(): Router; 
    protected abstract initRoutes(): void;
    protected asyncWrap = MiddlewareHandler.asyncWrap;
    protected authenticate = AuthMiddleware.authenticate;
}