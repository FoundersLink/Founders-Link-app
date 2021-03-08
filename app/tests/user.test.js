const { before } = require("lodash")
const request = require("supertest")
const app = require("../../app")
import User from "../models/src/user.model"

const user = {
	firstName: "Kevin",
	lastName: "Kirima",
	email: "njine10@gmail.com",
	phoneNumber: "0717708291",
	password: "Gi10807108",
}
var userToken = ""
var loginToken=""
beforeEach(async () => {
	await User.deleteMany({})
	const newUser = await User(user).save()
	const token = await newUser.generateToken()
	userToken = token
})

test("Should sign up for a user", async () => {
	await request(app)
		.post("/user/signup")
		.send({
			firstName: "Gibson",
			lastName: "Munene",
			email: "njine20@gmail.com",
			phoneNumber: "0741785762",
			password: "Gi10807108",
		})
		.expect(201)
		.then(response => {
			 loginToken=response.body.user.token
      })
})

test("Should login for a user", async () => {
	await request(app)
		.post("/user/login")
		.send({
			email: user.email,
			password: user.password,
		})
		.expect(200)
})

test("Update user", async () => {
	await request(app)
		.patch("/user/profile")
		.set("Accept", "application/json")
		.set("Authorization", "Bearer " + userToken)
		.expect("Content-Type", /json/)
		.send({
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: user.phoneNumber,
		})
		.expect(201)
})

test("Get User", async () => {
	await request(app)
		.get("/user/profile")
		.set("Accept", "application/json")
		.set("Authorization", "Bearer " + userToken)
		.expect(200)
})

test("Logout a  User", async () => {
	await request(app)
		.post("/user/logout")
		.set("Accept", "application/json")
		.set("Authorization", "Bearer " + userToken)
		.expect(200)
})


