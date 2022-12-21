const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})
  //await User.insertMany(helper.initialBlogs)
})

describe('when there is initially no users', () => {
	test('users are returned as json', async () => {
	  await api
	    .get('/api/users')
	    .expect(200)
	    .expect('Content-Type', /application\/json/)
	})

	test('a username is required', async () => {
	  const usersAtStart = await helper.usersInDb()

	  const newUser = {
	    username: "",
	    password: "abc"
	  }

	  await api
	    .post('/api/users')
	    .send(newUser)
	    .expect(400)

	  const usersAtEnd = await helper.usersInDb()
	  expect(usersAtEnd).toHaveLength(usersAtStart.length)

	})

	test('password is required', async () => {
	  const usersAtStart = await helper.usersInDb()

	  const newUser = {
	    username: "abc",
	    password: ""
	  }

	  await api
	    .post('/api/users')
	    .send(newUser)
	    .expect(400)

	  const usersAtEnd = await helper.usersInDb()
	  expect(usersAtEnd).toHaveLength(usersAtStart.length)

	})

	test('a username must be at least 3 characters long', async () => {
	  const usersAtStart = await helper.usersInDb()

	  const newUser = {
	    username: "ab",
	    password: "abc"
	  }

	  await api
	    .post('/api/users')
	    .send(newUser)
	    .expect(400)

	  const usersAtEnd = await helper.usersInDb()
	  expect(usersAtEnd).toHaveLength(usersAtStart.length)

	})

	test('a password must be at least 3 characters long', async () => {
	  const usersAtStart = await helper.usersInDb()

	  const newUser = {
	    username: "abc",
	    password: "ab"
	  }

	  await api
	    .post('/api/users')
	    .send(newUser)
	    .expect(400)

	  const usersAtEnd = await helper.usersInDb()
	  expect(usersAtEnd).toHaveLength(usersAtStart.length)

	})

	test('a password must be at least 3 characters long', async () => {
	  const usersAtStart = await helper.usersInDb()

	  const newUser = {
	    username: "abc",
	    password: "abc"
	  }

	  const newUser2 = {
	    username: "abc",
	    password: "abc2"
	  }

	  await api
	    .post('/api/users')
	    .send(newUser)
	    .send(newUser2)
	    .expect(500)

	  const usersAtEnd = await helper.usersInDb()
	  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

	})
}, 100000)