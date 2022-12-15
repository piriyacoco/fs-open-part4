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

blogsRouter.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

// const PORT = 3003
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

module.exports = blogsRouter // added