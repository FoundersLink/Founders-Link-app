import adaptRequest from '../helpers/adaptRequest';
import { makeHttpError } from '../helpers/httpHelper';
import Helper from '../helpers/helper';
import Lobby from '../models/src/lobby.model';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

/**
 * Lobby Controller
 * every functionality regarding Groups
 */
export default class LobbyController {

    /**
    * @param {object} req
    * @param {object} res
    * @returns {object} create a lobby with agora link
    */
    static async createLobby(req, res) {
        const APP_ID = process.env.APP_ID;
        const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

        const channelName = req.query.channelName;
        if (!channelName) {
            return resp.status(500).json({ 'error': 'channel is required' });
        }
        // get uid 
        let uid = req.query.uid;
        if (!uid || uid == '') {
            uid = 0;
        }
        // get role
        let role = RtcRole.SUBSCRIBER;
        if (req.query.role == 'publisher') {
            role = RtcRole.PUBLISHER;
        }
        // get the expire time
        let expireTime = req.query.expireTime;
        if (!expireTime || expireTime == '') {
            expireTime = 3600;
        } else {
            expireTime = parseInt(expireTime, 10);
        }
        // calculate privilege expire time
        const currentTime = Math.floor(Date.now() / 1000);
        const privilegeExpireTime = currentTime + expireTime;
        // build the token
        const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);

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

            const lobby = await new Lobby(data).save();
            return res.status(201).send({ lobby });
        } catch (e) {
            return res.status(400).send(makeHttpError({
                statusCode: 400,
                error: e
            }))
        }
    }

    static async nocache(req, resp, next) {
        resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        resp.header('Expires', '-1');
        resp.header('Pragma', 'no-cache');
        next();
    }

    /**
    * @param {object} req
    * @param {object} res
    * @returns {object} get lobby details
    */
    static async getLobby(req, res) {
        const httpRequest = adaptRequest(req);
        const { id } = httpRequest.pathParams || {}

        try {
            const module = await Lobby.find({ _id: id });
            if (!module) {
                return res.status(404).send(makeHttpError({ error: 'Action not allowed' }));
            }
            return res.status(200).send(module);
        } catch (e) {
            return res.status(500).send(makeHttpError({ error: 'Internal issue' }))
        }
    }

}
