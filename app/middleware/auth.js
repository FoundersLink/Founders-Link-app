import { makeHttpError } from '../helpers/httpHelper';
import User from '../models/src/user.model';
import jwt from 'jsonwebtoken';

/// SSO connectors
/// https://www.miniorange.com/sso-connector-pricing
/// https://auth0.com/pricing/
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        const decoded = jwt.verify(token, 'livingCorporate2021')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error('You are not authorized');
        }
        /// This will be accessible in the handler functions
        req.token = token;
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).send(
            makeHttpError({
                statusCode: 401,
                error: 'You are not authorized'
            }));
    }
}



export default auth;