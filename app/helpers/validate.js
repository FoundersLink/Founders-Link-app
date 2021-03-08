import { check, validationResult } from "express-validator"

class Validate {
	static signup() {
		return [
			check(
				"email",
				"Invalid email address, example: example@gmail.com."
			).isEmail(),
			check(
				"password",
				"Password should be provided and must be alphanumeric with atleast 8 character."
			).isLength({ max: 25, min: 8 }),
			check(
				"firstName",
				"firstName should be provided and must be alphanumeric with atleast 8 character."
			).isLength({ max: 25 }),
			check(
				"lastName",
				"Lastname should be provided and must be alphanumeric with atleast 8 character."
			).isLength({ max: 25 }),
			check(
				"phoneNumber",
				"phoneNumber should be provided and must be alphanumeric with atleast 8 character."
			).isLength({ max: 25 }),
			check(
				"location",
				"location should be provided and must be alphanumeric with atleast 8 character."
			).isLength({ max: 25 }),
		]
	}

	


	static signin() {
		return [
			// username must be an email
			check(
				"email",
				"Invalid email address, example: example@gmail.com."
			).isEmail(),
			// password must be at least 5 chars long
			check(
				"password",
				"Invalid password, your password should be alphanumeric with atleast 8 character."
			).isLength({ min: 8, max: 30 }),
		]
	}

	

	


	
}

export default Validate
