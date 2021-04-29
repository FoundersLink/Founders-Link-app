import adaptRequest from '../helpers/adaptRequest';
import { makeHttpError } from '../helpers/httpHelper';
import Helper from '../helpers/helper';
import Group from '../models/src/group.model';
import User from '../models/src/user.model';

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
        data.groupOwner = req.user._id;
        const { errors, isValid } = Helper.validateGroupInput(body);
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
            const group = await Group.findOne({ _id: id });
            if (!group) {
                return res.status(404).send(makeHttpError({ error: 'group not found' }));
            }
            const groupMembers = group.users.map( index => {
              const member = User.findOne({ _id : group.users[index]})
              return member;
            }

            )
            return res.status(200).send(groupMembers);
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
      Group.findOne({ _id: req.params.id })
      .then((group) => {
        if (!group)
          return res.status(400).json({
            message: `The group id ${req.params.id} is not associated with any group. Double-check the id and try again.`,
          });
  
        // Login successful, write token, and send back user
        group.users.unshift(req.body.user_id);
        group.save();
        res.status(200).json({ group });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
    }

    /**
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} create a group
	 */
     static async deletePeopleFromGroup(req, res){
      Group.findOne({ _id: req.params.id })
      .then((group) => {
        if (!group)
          return res.status(400).json({
            message: `The group id ${req.params.id} is not associated with any group. Double-check the id and try again.`,
          });
  
        // Login successful, write token, and send back user
        group.users.filter(function(user){ 
          return user != req.body.id; 
        });
        group.save();
        res.status(200).json({ group });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
    }

 }
