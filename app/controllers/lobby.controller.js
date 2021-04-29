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

        const channelName = 'test';
        let uid = req.query.uid;
        if (!uid || uid == '') {
            uid = 0;
        }
        let role = RtcRole.SUBSCRIBER;
        if (req.query.role == 'publisher') {
            role = RtcRole.PUBLISHER;
        }
        let expireTime = req.query.expireTime;
        if (!expireTime || expireTime == '') {
            expireTime = 3600;
        } else {
            expireTime = parseInt(expireTime, 10);
        }
        const currentTime = Math.floor(Date.now() / 1000);
        const privilegeExpireTime = currentTime + expireTime;
        const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);

        const httpRequest = adaptRequest(req);
        const { body } = httpRequest;
        let data = Helper.requestBody(body);
        data.liveAudioLink = token;
        const { errors, isValid } = Helper.validateLobbyInput(body);
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

    /**
    * @param {object} req
    * @param {object} res
    * @returns {object} get lobby details
    */
    static async getLobby(req, res) {
        const httpRequest = adaptRequest(req);
        const { id } = httpRequest.pathParams || {}

        try {
            const lobby = await Lobby.findOne({ _id: id });
            if (!lobby) {
                return res.status(404).send(makeHttpError({ error: 'lobby not found' }));
            }
            return res.status(200).send(lobby);
        } catch (e) {
            return res.status(500).send(makeHttpError({ error: 'Internal issue' }))
        }
    }

}
