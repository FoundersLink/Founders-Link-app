import { validationResult } from "express-validator"
const isValid = (req, res, next) => {
 
	const body = Object.prototype.toString.call(req.body)
	if (body === "[object Array]") return next()
	const results = validationResult(req)
	if (!results.isEmpty()) {

	const message={
	message:results.errors.map((i) => i.msg),
	status: false,
	}
	return res.send({
	 message:message,

	})

	}
	next()
}
export default isValid
