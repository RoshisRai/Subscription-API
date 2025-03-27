import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => {
    try {
        // Extract pagination parameters
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        
        // Build filter object based on query parameters
        const filter = {};
        
        // Filter by roles (can be multiple: ?role=admin,manager)
        if (req.query.role) {
            const roles = req.query.role.split(',');
            filter.roles = { $in: roles };
        }
        
        // Filter by active status
        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === 'true';
        }
        
        // Filter by name (partial match)
        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: 'i' }; // case-insensitive
        }
        
        // Filter by email (partial match)
        if (req.query.email) {
            filter.email = { $regex: req.query.email, $options: 'i' };
        }
        
        // Handle sorting (default: newest first)
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order === 'asc' ? 1 : -1;
        const sortOptions = {};
        sortOptions[sortField] = sortOrder;
        
        const users = await User.find(filter)
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort(sortOptions);
            
        const total = await User.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            message: "Users returned successfully",
            data: {
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {

        const { _id } = req.user;

        const user = await User.findById(_id).select('-password');

        res.status(200).json({
            success: true,
            message: "User found",
            data: user
        })
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "User found",
            data: user
        })
    } catch (error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    try {
        const { name, email, password, roles } = req.body;

        // Validate roles
        if (roles) {
            // Only admin can assign admin role to others
            if(roles.includes('admin') && !req.user.roles.includes('admin')) {
                const error = new Error('Only admin can assign admin role');
                error.statusCode = 403;
                throw error;
            }
        }

        // Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            const error = new Error('Email already in use');
            error.statusCode = 400;
            throw error;
        }

        // Hash password and create user with proper roles
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email, 
            password: hashedPassword,
            roles: roles || ['user'], // Default to user role
            isActive: true
        })

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    roles: user.roles,
                    isActive: user.isActive
                }
            },

        })
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, roles } = req.body;

        const updateData = {};

        // Update basic fields
        if (name) updateData.name = name;

        // Check if email is being updated
        if (email) {
            // Check if email already exists
            const emailExists = await User.findOne({ email, _id: { $ne: id } });
            if (emailExists) {
                const error = new Error('Email already in use');
                error.statusCode = 400;
                throw error;
            }
            updateData.email = email;
        }

        // Handle role updates - only admin can update roles
        if (roles && req.user.roles.includes('admin')) {
            updateData.roles = roles;
        } else if (roles) {
            const error = new Error('Only admin can update roles');
            error.statusCode = 403;
            throw error;
        }

        // Find and Update User
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    roles: user.roles,
                    isActive: user.isActive
                }
            }
        })
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        })
    } catch (error) {
        next(error);
    }
}