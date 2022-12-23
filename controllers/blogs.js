const blogsRouter = require('express').Router() // added
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog') // added
const User = require('../models/user')

// const express = require('express')
// const app = express()

// app.use(cors())
// app.use(express.json())

blogsRouter.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/api/blogs', async (request, response) => {

  // const blog = new Blog(request.body)

  const body = request.body
  // const user = await request.user

  // const token = getTokenFrom(request)
  const decodedToken = jwt.verify(request.token, process.env.SECRET) // token if have single line
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
  	title: body.title,
  	author: body.author,
  	url: body.url,
  	likes: body.likes,
  	user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

blogsRouter.put('/api/blogs/:id', async (request, response) => {
  const body = request.body

  const blog = { // don't add New Blog ! _id to be same
  	title: body.title,
  	author: body.author,
  	url: body.url,
  	likes: body.likes
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(blog)
})

// const PORT = 3003
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

module.exports = blogsRouter // added