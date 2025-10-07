import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req : Request, res : Response, next : NextFunction) => {
    const header = req.headers.authorization;
    if(!header)
        return res.status(401).json({message : "Missing Token"});

    const token =  header.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    }catch(error)
    {
        res.status(401).json({message : "Invalid Token"});
    }
            
};