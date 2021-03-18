"use strict"
import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const companySchema = new mongoose.Schema({

    companyOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
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
    foundingMembers: [

    ],
    tags: [

    ],
    interests: [

    ],
    {
        timestamps: true
    }
);

const Company = mongoose.model("companies", groupSchema);

export default Company;
