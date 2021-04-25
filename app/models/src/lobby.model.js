"use strict"
import mongoose from 'mongoose';
import validator from 'validator';

const lobbySchema = new mongoose.Schema({

    title: {
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
    liveAudioLink: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!value.length > 2) {
                throw new Error('Live Audio Link is required')
            }
        }
    },
    status: {
        type: String,
        trim: true,
        default: "active"
    },
    users: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
        }
    ],
},
    {
        timestamps: true
    }
);

const Lobby = mongoose.model("lobbies", lobbySchema);

export default Lobby;
