import adaptRequest from '../helpers/adaptRequest';
import { makeHttpError } from '../helpers/httpHelper';
import Helper from '../helpers/helper';

export default class UserController {
    
    static async getUser(req, res) {
        try {
            const user = req.user;
            return res.status(200).send({ user: user });

        } catch (e) {
            return res.status(500).send(makeHttpError({
                error: 'Internal issue'
            }))
        }
    }

    static async deleteUserAccount(req, res) {
        try {
            await req.user.remove();

            return res.status(201).send(req.user);
        } catch (e) {
            return res.status(500).send(
                makeHttpError({
                    error: 'Internal issues'
                }))
        }
    }

    static async updateUser(req, res) {
        const httpRequest = adaptRequest(req);
        const { body } = httpRequest;
        const updates = Object.keys(body);
        const allowedUpdates = ['firstName', 'lastName', 'password', 'email', 'phoneNumber']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(404).send(makeHttpError({ error: 'Invalid updates' }));
        }

        try {
            const updateData = Helper.requestBody(body);
            const user = await req.user;
            updates.forEach((update) => user[update] = updateData[update]);
            await user.save();
            return res.status(201).send({ success: true, update: user });
        } catch (e) {
            return res.status(400).send(
                makeHttpError({
                    statusCode: 400,
                    error: e
                }))
        }
    }



}
