import { Router , Request , Response} from "express";
import { authenticate } from "../middleware/authMiddleware";
import partner from "../models/partners";

const router = Router();

router.get("/", authenticate , async (req : Request,  res: Response)=> {
    const partners = await partner.find();
    res.json(partners);
});

router.post("/", authenticate, async (req : any , res : Response) => {
    if(req.user.role !== "admin")
        return res.status(403).json({message : "Forbidden"});

    const newPartner = await partner.create(req.body);
    res.json(newPartner);
});

router.put("/:id", authenticate, async (req :  Request , res : Response) => {
    const updatedPartner  =  await partner.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res.json(updatedPartner);
});

// Get current user's partner profile (if role is partner)
router.get("/me", authenticate, async (req: any, res: Response) => {
    if (req.user.role !== 'partner') return res.status(403).json({ message: 'Forbidden' });
    const me = await partner.findOne({ user: req.user.id });
    if (!me) return res.status(404).json({ message: 'Partner profile not found' });
    res.json(me);
});

// Update current partner's status
router.put("/me/status", authenticate, async (req: any, res: Response) => {
    if (req.user.role !== 'partner') return res.status(403).json({ message: 'Forbidden' });
    const me = await partner.findOneAndUpdate({ user: req.user.id }, { status: req.body.status }, { new: true });
    if (!me) return res.status(404).json({ message: 'Partner profile not found' });
    res.json(me);
});

export default router;