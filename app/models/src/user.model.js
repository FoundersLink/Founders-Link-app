"use strict"
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AudioModule from './audio.model';

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Valid email is required")
            }
        }
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error("Phone number is required")
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        required: true,
    },
    // Track user logins.
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    role: {
        type: String,
        enum: ['admin', 'none'],
        default: 'none'
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

userSchema.methods.toJSON = function () {
    /// Gives us access to user data
    const user = this;
    const userObject = user.toObject();
    /// Hide private data
    delete userObject.password;
    delete userObject.tokens;
    return userObject
}

userSchema.virtual('modules', {
    ref: 'audio_modules',
    localField: '_id',
    foreignField: 'admin'
})

userSchema.methods.generateToken = async function () {
    /// Gives us access to user data
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'livingCorporate2021')
    user.tokens = user.tokens.concat({ token })
    await user.save();
    return token
}

userSchema.statics.findUserByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}

/// save password
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})


// Delete user and audioFiles 
userSchema.pre('remove', async function (next) {
    const user = this;
    await AudioModule.deleteMany({ admin: user._id });
    next();
})

const User = mongoose.model("users", userSchema);

export default User; 