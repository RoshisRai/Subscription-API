import { Router } from 'express';
import authorize from '../middleware/auth.middleware.js';
import { 
    createSubscription, 
    getAllSubscriptions, 
    getUserSubscriptions 
} from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions)

subscriptionRouter.get('/:id', (req, res) => {
    res.send({ title: "GET a subscription."})
})

subscriptionRouter.post('/', authorize, createSubscription)

subscriptionRouter.put('/:id', (req, res) => {
    res.send({ title: "UPDATE a subscription."})
})

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({ title: "DELETE a subscription."})
})

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions)

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({ title: "CANCEL subscription."})
})

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({ title: "GET upcoming renewals."})
})



export default subscriptionRouter;