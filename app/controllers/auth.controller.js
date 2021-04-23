import adaptRequest from '../helpers/adaptRequest';
import { makeHttpError } from '../helpers/httpHelper';
import Helper from '../helpers/helper';
import User from '../models/src/user.model';
import mailer from '../helpers/mailer';

/**
 * Auth controller
 * every functionality regarding authentication
 */
export default class AuthController {

    /**
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} user logged in token
	 */
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

    /**
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} user can create account
	 */

    static async createNewUser(req, res) {
        const httpRequest = adaptRequest(req);
        const { body } = httpRequest;
        const data = Helper.requestBody(body);
        const { errors, isValid } = Helper.validateSignUpInput(body);
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

            const user = await new User(data).save();
            const token = await user.generateToken();
            console.log(user, token);

            const emailView = mailer.activateAccountView(token, user.firstName);
            mailer.sendEmail(body.email, 'Verification link', emailView);
            return res.status(201).send({ user, token });
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
	 * @returns {object} user is activated
	 */

    static async activateUser(req, res) {
        const updateUser = await User.findByIdAndUpdate(
            req.user.id, {
              $set: {
                isVerified: true
              }
            }, {
              new: true
            }
          );
    
        if (updateUser.status === 200) {
          return res.redirect(`${process.env.FRONT_END_SUCCESS_REDIRECT}`);
        }
        return res.status(400).send(updateUser.message);
      }
    
    /**
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} user logged out successfully
	 */

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
