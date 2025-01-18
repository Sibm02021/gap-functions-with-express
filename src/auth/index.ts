import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from "express";

const validateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const authHeader = req.headers.authorization;

    if ((!authHeader) || (authHeader && !authHeader.startsWith('Bearer '))) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = <jwt.JwtPayload>jwt.verify(token, process.env.JWT_SECRET!);
        req.userId = <string>decoded.sub;

        console.log('Set the userId to the request object');
        console.log(req.userId);
        next();

    } catch (error) {

        console.error('Failed to authenticate token', error);

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send('Token has expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send('Invalid token');
        }
        return res.status(500).send('Failed to authenticate token');
    }
}

export default validateToken;