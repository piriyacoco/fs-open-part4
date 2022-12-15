const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const blogLikes = blogs.map(blog => blog.likes)
  const maxLike = Math.max(...blogLikes)

  const maxLikeBlog = blogs.find(blog => blog.likes === maxLike)

  delete maxLikeBlog._id
  delete maxLikeBlog.__v
  delete maxLikeBlog.url

  return maxLikeBlog
}

const countBy = require('lodash/countBy')

const mostBlogs = (blogs) => {
  const authorBlogs = countBy(blogs, blog => blog.author)

  const maxAuthorBlog = Math.max(...Object.values(authorBlogs))

  return {
    author: Object.keys(authorBlogs).find(k => authorBlogs[k] === maxAuthorBlog),
    blogs: maxAuthorBlog
  }
}

const groupBy = require('lodash/groupBy')
const sumBy = require('lodash/sumBy')

const mostLikes = (blogs) => {
  const likes = blogs.map(blog => {
    const { author, likes } = blog
    return { author, likes }
  })

  const reducer = (likeAgg, item) => {
    const author = item.author
    const entry = likeAgg.get(author) + item.likes || item.likes

    return likeAgg.set(author, entry)
  }

  const authorLikesMap = likes.reduce(reducer, new Map)
  const authorLikesArr = Array.from(authorLikesMap, ([author, likes]) => ({ author, likes}))
  const maxAuthorLikes = Math.max(...authorLikesArr.map(entry => entry.likes))

  return authorLikesArr.find(entry => entry.likes === maxAuthorLikes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}