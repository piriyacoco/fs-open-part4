const bcrypt = require('bcrypt')
const usersRouter = require('express').Router() // added
const User = require('../models/user') // added

usersRouter.get('/api/users', async (request, response) => {
  const users = await User
    .find({})

    response.json(users)
})

usersRouter.post('/api/users', async (request, response) => {
  
  const body = request.body

  if (body.password.length === 0) {
  	response.status(400).send({ error: 'password cannot be empty' })
  }
  if (body.password.length < 3) {
  	response.status(400).send({ error: 'password length too short' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
  	username: body.username,
  	name: body.name,
  	passwordHash: passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter // added