import adaptRequest from '../helpers/adaptRequest';
import { makeHttpError } from '../helpers/httpHelper';
import Helper from '../helpers/helper';
import User from '../models/src/user.model';


export default class AuthController {

    static async login(req, res) {
        const httpRequest = adaptRequest(req);
        const { body } = httpRequest;
        const credentials = Helper.requestBody(body);
        const { errors, isValid } = Helper.validateLoginInput(req.body);

        try {
            if (!isValid) {
                return res.status(400).send(makeHttpError({
                    error: errors
                }));
            }

            const checkUser = await User.findOne({ email: body.email });
            if (!checkUser) {
                errors.email = "No such account";
                return res.status(400).send(makeHttpError({ error: errors }))
            }

            const user = await User.findUserByCredentials(credentials.email, credentials.password)
            const token = await user.generateToken();
            return res.status(200).send({ status: 200, user, token });
        } catch (e) {
            return res.status(400).send(makeHttpError({ error: e.message }));
        }

    }

    static async createNewUser(req, res) {
        /// Add a new user
        const httpRequest = adaptRequest(req);
        const { body } = httpRequest;
        const data = Helper.requestBody(body);
        const { errors, isValid } = Helper.validateLoginInput(body);
        const checkUser = await User.findOne({ email: body.email });

        try {

            if (!isValid) {
                return res.status(400).send(makeHttpError({
                    error: errors
                }))
            }

            if (checkUser) {
                errors.email = "Email already exists";
                return res.status(400).send(makeHttpError({
                    error: errors
                }))
            };
            // send verification email
            // verify the email

            const user = await new User(data).save();
            const token = await user.generateToken();
            return res.status(201).send({ user, token });
        } catch (e) {
            return res.status(400).send(makeHttpError({
                statusCode: 400,
                error: e
            }))
        }
    }

    static async logout(req, res) {
        /// Log out from current session
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token;
            })
            await req.user.save();
            return res.status(200).send({ success: true });
        } catch (e) {
            return res.status(500).send(
                makeHttpError({
                    error: e.message
                })
            );
        }
    }

    static async logoutAll(req, res) {
        /// Log out all sessions from every devices
        try {
            req.user.tokens = [];
            req.user.save();
            return res.status(200).send({ success: true });
        } catch (e) {
            return res.status(500).send(
                makeHttpError({
                    error: e.message
                })
            );
        }
    }

}