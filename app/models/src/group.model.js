"use strict"
import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const groupSchema = new mongoose.Schema({

    groupOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    groupTitle: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!value.length > 2) {
                throw new Error('Title is required')
            }
        }
    },
    description: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!value.length > 2) {
                throw new Error('Description is required')
            }
        }
    },
    users: [

    ],
    {
        timestamps: true
    }
);

const Group = mongoose.model("groups", groupSchema);

export default Group;
