import { mongoose } from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 5,
        maxLength: 255,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'User Password is required'],
        minLength: 6,
    },
    isActive: {
        type: Boolean,
        default: false, 
    },
    activationToken: {
        type: String,
        default: null,
    },
    activationExpires: {
        type: Date,
        default: null,
    },
}, { timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
