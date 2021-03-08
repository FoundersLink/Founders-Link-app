'use strict'

import mongoose from 'mongoose';


const audioModuleSchema = new mongoose.Schema({
    /// Used for modifying this document with admin
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
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
    coverImage: {
        type: String,
        trim: true,
        default: ''
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
    audioFiles: [
        {
            title: {
                type: String,
                trim: true,
                // required: true,
            },
            audio_url: {
                type: String,
                trim: true,
                // required: true,
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
        }, {
            timestamps: true
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

audioModuleSchema.methods.addAudioFile = async function ({ audioFile }) {
    /// Gives us access to user data
    const modules = this;
    modules.audioFiles = modules.audioFiles.concat(audioFile)
    await modules.save();
    return modules
}

audioModuleSchema.methods.updateAudio = async function ({ id, data }) {
    /// Gives us access to user data
    const modules = this;
    const audioIndex = modules.audioFiles.map(item => item._id).indexOf(id);
    modules.audioFiles[audioIndex].title = data;
    await modules.save();
    console.log(modules.audioFiles[audioIndex]);
    return modules
}

audioModuleSchema.methods.removeAudio = async function ({ id }) {
    /// Gives us access to user data
    const modules = this;
    const checkAudioFile = modules.audioFiles.filter((audioFile) => audioFile._id.toString() === id).length === 0;
    if (checkAudioFile) {
        throw new Error('Not found');
    }
    /// Get remove index
    const removeIndex = modules.audioFiles.map(item => item._id.toString()).indexOf(id);
    modules.audioFiles.splice(removeIndex, 1);
    return await modules.save();
}

const AudioModule = mongoose.model("audio_modules", audioModuleSchema);

export default AudioModule;
