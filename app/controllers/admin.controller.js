import adaptRequest from '../helpers/adaptRequest';
import AudioModule from '../models/src/audio.model';
import { makeHttpError } from '../helpers/httpHelper';
import Helper from '../helpers/helper';


class AdminModuleController {

    static async createModule(req, res) {
        const httpRequest = adaptRequest(req);
        const { body } = httpRequest;
        const dataPayload = Helper.requestBody(body);

        try {
            const module = new AudioModule({ ...dataPayload, admin: req.user._id });
            await module.save();
            return res.status(201).send(module);
        } catch (e) {
            return res.status(400).send(makeHttpError({ error: e }))
        }
    }

    static async getModule(req, res) {
        const httpRequest = adaptRequest(req);
        const { id } = httpRequest.pathParams || {}

        try {
            const module = await AudioModule.findOne({ _id: id, admin: req.user._id });
            if (!module) {
                return res.status(404).send(makeHttpError({ error: 'Action not allowed' }));
            }
            return res.status(200).send(module);
        } catch (e) {
            return res.status(500).send(makeHttpError({ error: 'Internal issue' }))
        }
    }

    static async getAllModule(req, res) {
        const httpRequest = adaptRequest(req);
        const { queryParams } = httpRequest;

        try {
            const module = await req.user.populate({
                path: 'modules',
                match: { isDeleted: false },
                options: {
                    limit: parseInt(queryParams.limit),
                    skip: parseInt(queryParams.skip)
                }
            }).execPopulate();

            if (!module) {
                return res.status(404).send(
                    makeHttpError({ error: 'Action not allowed' }));
            }

            return res.status(200).send(req.user.modules);
        } catch (e) {
            console.log(e);
            return res.status(500).send(makeHttpError({ error: 'Internal issue' }))
        }
    }

    static async getModuleMarked(req, res) {
        /// Module marked for deletion.
        const httpRequest = adaptRequest(req);
        const { queryParams } = httpRequest;

        try {
            const module = await req.user.populate({
                path: 'modules',
                match: { isDeleted: true },
                options: {
                    limit: parseInt(queryParams.limit),
                    skip: parseInt(queryParams.skip)
                }
            }).execPopulate();

            if (!module) {
                return res.status(404).send(
                    makeHttpError({ error: 'Action not allowed' }));
            }

            return res.status(200).send(req.user.modules);
        } catch (e) {
            console.log(e);
            return res.status(500).send(makeHttpError({ error: 'Internal issue' }))
        }
    }

    static async deleteModule(req, res) {
        /// Allows the admin to completely remove a module from the database.
        const httpRequest = adaptRequest(req);
        const { id } = httpRequest.pathParams;
        
        try {
            const module = await AudioModule.findByIdAndDelete({ _id: id, admin: req.user._id });
            if (!module) {
                return res.status(404).send(makeHttpError({ error: 'Module not found' }
                ));
            }

            return res.status(201).send(module);
        } catch (e) {
            return res.status(500).send(makeHttpError({ error: 'Internal issues' }))
        }
    }

    static async markTodeleteModule(req, res) {
        /// Allows admin to see modules marked for deletion before full delete is allowed.     
        const httpRequest = adaptRequest(req);
        const { body } = httpRequest;
        const { id } = httpRequest.pathParams;
        const updates = Object.keys(body);
        const allowedUpdates = ['isDeleted']
        console.log(body, id);

        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(404).send(makeHttpError({ error: 'Invalid updates' }));
        }

        try {
            const updateData = Helper.requestBody(body);
            const audioModule = await AudioModule.findOne({ _id: id, admin: req.user._id });
            if (!audioModule) {
                return res.status(404).send(makeHttpError({ error: 'audioModule not found' }));
            }
            updates.forEach((update) => audioModule[update] = updateData[update]);
            await audioModule.save();

            return res.status(201).send({ success: true, update: audioModule });
        } catch (e) {
            return res.status(400).send(makeHttpError({
                error: e
            }))
        }
    }

    static async updateModule(req, res) {
        const httpRequest = adaptRequest(req);
        const { body } = httpRequest;
        const { id } = httpRequest.pathParams;
        const updates = Object.keys(body);
        const allowedUpdates = ['coverImage', 'title', 'description']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(404).send(makeHttpError({ error: 'Invalid updates' }));
        }

        try {
            const updateData = Helper.requestBody(body);
            const audioModule = await AudioModule.findOne({ _id: id, admin: req.user._id });
            if (!audioModule) {
                return res.status(404).send(makeHttpError({ error: 'audioModule not found' }));
            }
            updates.forEach((update) => audioModule[update] = updateData[update]);
            await audioModule.save();

            return res.status(201).send({ success: true, update: audioModule });
        } catch (e) {
            return res.status(400).send(makeHttpError({
                error: e
            }))
        }
    }

    static async postAudio(req, res) {
        /// Add new audio file
        const httpRequest = adaptRequest(req);
        const { body, file } = httpRequest;
        const { id } = httpRequest.pathParams;
        const dataPayload = Helper.requestBody(body);
        // uploadFile({file: file });

        try {
            const module = await AudioModule.findOne({ _id: id, admin: req.user._id })
            const data = await module.addAudioFile({ audioFile: dataPayload })

            return res.status(201).send(data)
        } catch (e) {
            console.log(e);
            return res.status(500).send(makeHttpError({ error: 'Internal issue' }))
        }
    }

    static async updateAudio(req, res) {
        const httpRequest = adaptRequest(req);
        const { body } = httpRequest;
        const { id, audioId } = httpRequest.pathParams;
        const dataPayload = Helper.requestBody(body);

        try {
            const audio = await AudioModule.findOne({ _id: id, admin: req.user._id });
            if (!audio) {
                return res.status(400).send(makeHttpError({ statusCode: 400, error: 'No AudioFile' }))
            }
            const update = await audio.updateAudio({ id: audioId, data: dataPayload.title })
            return res.status(201).send(update);
        } catch (e) {
            console.log(e);
        }
    }

    static async deleteAudio(req, res) {
        const httpRequest = adaptRequest(req);
        const { id, audioId } = httpRequest.pathParams;

        try {
            const module = await AudioModule.findOne({ _id: id, admin: req.user._id });
            if (!module) {
                return res.status(404).send(makeHttpError({ error: 'Module not found' }));
            }
            const data = await module.removeAudio({ id: audioId });
            
            return res.status(201).send(data);
        } catch (e) {
            return res.status(500).send(makeHttpError({
                error: 'Internal issues'
            }))
        }
    }

}

export default AdminModuleController;
