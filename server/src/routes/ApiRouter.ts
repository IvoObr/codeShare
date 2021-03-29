import { Router } from "express";

export default abstract class ApiRouter {
    protected abstract router: Router;
    public abstract getRouter(): Router; 
    protected abstract useMiddleware(): void;
    protected abstract initRoutes(): void;
}