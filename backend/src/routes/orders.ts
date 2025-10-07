import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/authMiddleware";
import order from "../models/orders";
import partners from "../models/partners";

const router = Router();

router.get("/", authenticate, async (req : Request , res :Response) => {
    const orders = await order.find().populate('assignedTo');
    res.json(orders);   
});


// create order
router.post("/" , authenticate, async (req : any , res : Response) =>{
    if(req.user.role !=="admin")
        return res.status(403).json({message : "Forbidden"});
    const newOrder = await order.create(req.body);
    res.json(newOrder);
});

// update order
router.put("/:id" , authenticate, async (req : any , res : Response) =>{
    const id = req.params.id;
    const {assignedTo, status} = req.body;

    // Only admin can assign orders
    if (assignedTo && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    // Reassignment rules: allow reassign only if not picked up/delivered; when reassigning, free previous partner
    if (assignedTo) {
        const existing = await order.findById(id);
        if (!existing) return res.status(404).json({ message: "Order not found" });
        const status = String(existing.status);
        const isLocked = status === 'picked_up' || status === 'delivered' || status === 'shipped' || status === 'deliveried';
        if (existing.assignedTo && String(existing.assignedTo) !== String(assignedTo)) {
            if (isLocked) {
                return res.status(400).json({ message: "Order already in progress or delivered" });
            }
            // free previous partner
            await partners.findByIdAndUpdate(existing.assignedTo, { status: 'available' });
        }
    }

    const updated = await order.findByIdAndUpdate(id, req.body, { new : true });
    if(!updated)
        return res.status(404).json({message : "Order not found"});

    if(assignedTo)
        await partners.findByIdAndUpdate(assignedTo, {status : "busy"});

    if(status === "delivered" && updated.assignedTo)
        await partners.findByIdAndUpdate(updated.assignedTo, {status : "available"});

    res.json(updated);
});


export default router;