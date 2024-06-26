import { NextFunction, Request, Response, Router } from "express";
import { IMiddleware } from "./middleware.interface";

export interface IRouteController {
    path: string,
    func: (req: Request, res: Response, next: NextFunction) => void,
    method: keyof Pick<Router, 'post' | 'delete' | 'get' | 'put'>,
    middlewares: IMiddleware[],
}

export type ExpressReturnType = Response<any, Record<string, any>>;
