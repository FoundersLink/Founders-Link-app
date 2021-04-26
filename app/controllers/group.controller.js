import adaptRequest from '../helpers/adaptRequest';
import { makeHttpError } from '../helpers/httpHelper';
import Helper from '../helpers/helper';
import Group from '../models/src/group.model';

/**
 * Group Controller
 * every functionality regarding Groups
 */
 export default class GroupController {

    /**
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} create a group
	 */
     static async createGroup(req, res){
        const httpRequest = adaptRequest(req);
        const { body } = httpRequest;
        const data = Helper.requestBody(body);
        const { errors, isValid } = Helper.validateSignUpInput(body);
        try {

            if (!isValid) {
                return res.status(400).send(makeHttpError({
                    error: errors
                }))
            }

            const group = await new Group(data).save();
            return res.status(201).send({ group });
        } catch (e) {
            return res.status(400).send(makeHttpError({
                statusCode: 400,
                error: e
            }))
        }


     }

     /**
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} create a group
	 */
      static async getGroupMembers(req, res){
        const httpRequest = adaptRequest(req);
        const { id } = httpRequest.pathParams || {}

        try {
            const module = await Group.findOne({ _id: id });
            if (!module) {
                return res.status(404).send(makeHttpError({ error: 'Action not allowed' }));
            }
            return res.status(200).send(module);
        } catch (e) {
            return res.status(500).send(makeHttpError({ error: 'Internal issue' }))
        }

    }

    /**
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} create a group
	 */
     static async addPeopleToGroup(req, res){
        const updateGroup = await Group.findByIdAndUpdate(
            req.group.id, {
              $set: {
                isVerified: true
              }
            }, {
              new: true
            }
          );
    
        return res.status(400).send(updateGroup.message);
    }

    /**
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} create a group
	 */
     static async deletePeopleFromGroup(req, res){
        const updateGroup = await Group.findByIdAndUpdate(
            req.group.id, {
              $set: {
                isVerified: true
              }
            }, {
              new: true
            }
          );
    
        return res.status(400).send(updateGroup.message);

    }

 }
