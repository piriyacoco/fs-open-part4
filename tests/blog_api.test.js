const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  // await Blog.deleteMany({})
  await User.deleteMany({})
  await api
  	.post('/api/users')
  	.send(helper.initialUsers[0])

  await api
  	.post('/api/login')
  	.send(helper.initialUsers[0])
  	.expect(response => { initialToken = response.body.token })

  await Blog.deleteMany({})

  await api
  	.post('/api/blogs')
  	.set('Authorization', `bearer ${initialToken}`)
  	.send(helper.initialBlogs[0])

  await api
  	.post('/api/blogs')
  	.set('Authorization', `bearer ${initialToken}`)
  	.send(helper.initialBlogs[1])


  // await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
	test('blogs are returned as json', async () => {
	  await api
	    .get('/api/blogs')
	    .expect(200)
	    .expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
	  const response = await api.get('/api/blogs')

	  expect(response.body).toHaveLength(helper.initialBlogs.length)
	})

	test('blogs have property id', async () => {
		const response = await api.get('/api/blogs')

	 	response.body.map(blog => expect(blog).toHaveProperty('id'))
	})

	test('a valid blog can be added ', async () => {
	  const newBlog = {
	    title: "Canonical string reduction",
	    author: "Edsger W. Dijkstra",
	    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
	    likes: 12
	  }

	  await api
	    .post('/api/blogs')
	    .set('Authorization', `bearer ${initialToken}`)
	    .send(newBlog)
	    .expect(201)
	    .expect('Content-Type', /application\/json/)

	  const blogsAtEnd = await helper.blogsInDb()
	  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

	  const titles = blogsAtEnd.map(n => n.title)
	  expect(titles).toContain(
	    'Canonical string reduction'
	  )
	})

	test('a blog cannot be added without token ', async () => {
	  const newBlog = {
	    title: "Canonical string reduction",
	    author: "Edsger W. Dijkstra",
	    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
	    likes: 12
	  }

	  await api
	    .post('/api/blogs')
	    .set('Authorization', `bearer `)
	    .send(newBlog)
	    .expect(401)
	    //.expect('Content-Type', /application\/json/)

	  const blogsAtEnd = await helper.blogsInDb()
	  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
	})

	test('a blog without property likes will default value to 0 ', async () => {
	  const newBlog = {
	    title: "Canonical string reduction",
	    author: "Edsger W. Dijkstra",
	    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
	  }

	  await api
	    .post('/api/blogs')
	    .set('Authorization', `bearer ${initialToken}`)
	    .send(newBlog)
	    .expect(201)
	    .expect('Content-Type', /application\/json/)

	  const blogsAtEnd = await helper.blogsInDb()

	  expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
	})

	test('a blog without property title or url will return 400', async () => {
	  const newBlogNoTitle = {
	    author: "Edsger W. Dijkstra",
	    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
	    likes: 12
	  }

	  const newBlogNoUrl = {
	  	title: "Canonical string reduction",
	    author: "Edsger W. Dijkstra",
	    likes: 12
	  }

	  await api
	    .post('/api/blogs')
	    .set('Authorization', `bearer ${initialToken}`)
	    .send(newBlogNoTitle)
	    .expect(400)

	  await api
	    .post('/api/blogs')
	    .set('Authorization', `bearer ${initialToken}`)
	    .send(newBlogNoUrl)
	    .expect(400)

	  const blogsAtEnd = await helper.blogsInDb()

	  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

	})

	test('a blog can be deleted ', async () => {
	  const blogsAtStart = await helper.blogsInDb()
	  const blogToDelete = await blogsAtStart[Math.floor(Math.random() * blogsAtStart.length)]

	  await api
	    .delete(`/api/blogs/${blogToDelete.id}`)
	    .set('Authorization', `bearer ${initialToken}`)
	    .expect(204)

	  const blogsAtEnd = await helper.blogsInDb()

	  expect(blogsAtEnd).toHaveLength(
	    helper.initialBlogs.length - 1
	  )

	  const titles = blogsAtEnd.map(r => r.title)

  	  expect(titles).not.toContain(blogToDelete.title)
	})

	test('a blog can be updated ', async () => {
	  const blogsAtStart = await helper.blogsInDb()
	  const blogToUpdate = await blogsAtStart[Math.floor(Math.random() * blogsAtStart.length)]

	  const newBlog = {
	    title: "Canonical string reduction",
	    author: "Edsger W. Dijkstra",
	    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
	    likes: 12
	  }

	  await api
	    .put(`/api/blogs/${blogToUpdate.id}`, newBlog)
	    .expect(200)

	  const blogsAtEnd = await helper.blogsInDb()

	  expect(blogsAtEnd).toHaveLength(
	    helper.initialBlogs.length
	  )

	  const titles = blogsAtEnd.map(r => r.title)

  	  expect(titles).not.toContain(newBlog.title)
	})
})