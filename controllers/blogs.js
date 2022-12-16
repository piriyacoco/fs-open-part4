const blogsRouter = require('express').Router() // added
const Blog = require('../models/blog') // added

// const express = require('express')
// const app = express()

// app.use(cors())
// app.use(express.json())

blogsRouter.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/api/blogs', async (request, response) => {

  // const blog = new Blog(request.body)

  const body = request.body

  const blog = new Blog({
  	title: body.title,
  	author: body.author,
  	url: body.url,
  	likes: body.likes
  })

  const savedBlog = await blog.save()
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