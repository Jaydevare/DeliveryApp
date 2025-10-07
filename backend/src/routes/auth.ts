import { Router, Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import user from "../models/user";
import partner from "../models/partners";

const router = Router();

router.post("/register", async (req : Request , res :Response) => {
    try {
            const {email, password, role, name} = req.body;
            const exists = await user.findOne({ email });
            if(exists)
            return res.status(400).json({message : "User already exists"});

            const newUser = await user.create({ email, password, role });
            if (role === 'partner' && name) {
                await partner.create({ name, user: newUser._id });
            }
            res.json({ id: newUser._id });
    } catch (error) {
        res.status(500).json({message : "Server Error"});
    }
});

router.post("/login", async (req : Request , res :Response) => {

        const {email, password} = req.body;
        const existingUser = await user.findOne({email,password});
        if(!existingUser)
            return res.status(400).json({message : "Invalid Credentials"});
   
        const token = generateToken({id : existingUser._id, role : existingUser.role});
        res.json({token , role : existingUser.role});
});

export default router;