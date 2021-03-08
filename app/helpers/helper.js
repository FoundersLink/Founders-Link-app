const Validator = require('validator');

class Helper {
    /**
 * 
 * @param {object} httpRequestBody 
 * @param {object} res 
 */
    static requestBody(httpRequestBody, res) {
        if (!httpRequestBody) {
            return res.status(400).send(makeHttpError({
                statusCode: 400,
                errorMessage: 'Bad request. No POST body.'
            }))
        }

        if (typeof httpRequestBody === 'string') {
            try {
                httpRequestBody = JSON.parse(httpRequestBody)
            } catch {
                return res.status(201).send(makeHttpError({
                    statusCode: 400,
                    errorMessage: 'Bad request. POST body must be valid JSON.'
                }))
            }
        }

        return httpRequestBody;
    }

    static validateLoginInput(data) {
        let errors = {};        
        data.email = !Helper.isEmpty(data.email) ? data.email : '';
        data.password = !Helper.isEmpty(data.password) ? data.password : '';

        if (!Validator.isEmail(data.email)) {
            errors.email = 'Email is invalid';
        }

        if (Validator.isEmpty(data.email)) {
            errors.email = 'Email field is required';
        }

        if (Validator.isEmpty(data.password)) {
            errors.password = 'Password field is required';
        }

        return {
            errors,
            isValid: Helper.isEmpty(errors) // this return true or false exist.
        }
    }

    static isEmpty(value) {
        return value === undefined || value == null ||
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            (typeof value == 'string' && value.trim().length == 0);
    }

}

export default Helper;