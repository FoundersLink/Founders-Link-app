'use strict'
import mongoose from 'mongoose';

const AudioFile = mongoose.model('audioFiles', {
    module: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'audio_modules'
    },
    title: {
        type: String,
        trim: true,
        required: true,
    },
    audio_url: {
        type: String,
        trim: true,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
})


export default AudioFile;

