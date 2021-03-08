import adaptRequest from '../helpers/adaptRequest';
import AudioModule from '../models/src/audio.model';
import { makeHttpError } from '../helpers/httpHelper';

/**
 * This controller allows external users who are consumers of the 
 * application to only access the data with no admin privilleges
 */
class PublicModuleController {

    static async getModule(req, res) {
        const httpRequest = adaptRequest(req);
        const { id } = httpRequest.pathParams || {};

        try {
            const module = await AudioModule.findOne({ _id: id });
            if (!module) {
                return res.status(404).send(makeHttpError({ error: 'Action not allowed' }));
            }
            return res.status(200).send(req.user.modules);
        } catch (e) {
            console.log(e);
            return res.status(500).send(makeHttpError({ error: 'Internal issue' }));
        }
    }

    static async getAllModule(req, res) {
        const httpRequest = adaptRequest(req);
        const { queryParams } = httpRequest;
        
        try {
            const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;
            const skip = queryParams.skip ? parseInt(queryParams.skip) : 1;
            const modules = await AudioModule.find({})
                .sort('1')
                .skip((skip - 1) * limit) // Skip number of entries
                .limit(limit) /// eg. Number entries we want to display

            if (!modules) {
                return res.status(404).send(
                    makeHttpError({ error: 'Action not allowed' }));
            }
            return res.status(200).send(modules);
        } catch (e) {
            return res.status(500).send(makeHttpError({ error: 'Internal issue' }))
        }
    }
}


export default PublicModuleController;
