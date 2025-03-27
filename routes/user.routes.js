import { Router } from 'express';

import authorize from '../middleware/auth.middleware.js';
import { 
    getCurrentUser, 
    getUser, 
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js';
import hasRole from '../middleware/hasrole.middleware.js';

const userRouter = Router();

// Get all users PATH: /api/v1/users
userRouter.get('/', authorize, hasRole(['admin', 'manager','support']), getUsers)

// Get current user PATH: /api/v1/users/me
userRouter.get('/me', authorize, getCurrentUser)

// Get a user PATH: /api/v1/users/:id
// User can get themselves, admin/manager/support can get any user
userRouter.get('/:id', authorize, (req, res, next) => {
    // Allow users to access their own data
    if(req.params.id === req.user._id.toString()) {
        return next();
    }

    // Allow admin/manager/support to access any user data
    return hasRole(['admin', 'manager','support'])(req, res, next);
}, getUser)


// Create a user PATH: /api/v1/users
// Only admin/manager can create a user
userRouter.post('/', authorize, hasRole(['admin', 'manager']), createUser)

// Update a user PATH: /api/v1/users/:id
// Update user - themselves, admin, or manager can update any user
userRouter.put('/:id', authorize, (req, res, next) => {
    // Allow users to update their own data
    if(req.params.id === req.user._id.toString()) {
        return next();
    }

    // Allow admin/manager to update any
    return hasRole(['admin', 'manager'])(req, res, next);
}, updateUser)

// Delete a user PATH: /api/v1/users/:id
// Delete user - themselves and admin can delete any user
userRouter.delete('/:id', authorize, (req, res, next) => {
    // Allow users to delete their own data
    if(req.params.id === req.user._id.toString()) {
        return next();
    }

    // Allow admin to delete any
    return hasRole(['admin'])(req, res, next);
}, deleteUser)

export default userRouter;