const postsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/post')


postsRouter.get('/', async (request, response) => {
    const posts = await Blog
        .find({})
        .populate('user', {username: 1, name: 1})
    response.json(posts)
})

postsRouter.post('/', async (request, response, next) => {
    // check to be sure that we have a token
    if (!request.token) {
        return response.status(401).json({error: 'You don\'t provide a token'})
    }
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({error: 'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)

    const blog = Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    // If the title and url is missing, respond with 400
    if (!body.title && !body.url)
    {
        return response.status(400).end()
    }

    try {
        const newPost = await blog.save()
        user.blogs = user.blogs.concat(newPost._id)
        await user.save()

        response.status(200).json(newPost.toJSON())
    } catch (exception) {
        next(exception)
    }
})

postsRouter.post('/:id/comments', async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(id)
    const message = request.body.message
    if (!message)
        return response.json({error: "No comment sended"})
    blog.comments.push(message)
    const result = await blog.save()
    response.json(result)
})

postsRouter.delete('/:id', async (request, response, next) => {
    // check to be sure that we have a token
    if (!request.token) {
        return response.status(401).json({error: 'You don\'t provide a token'})
    }

    try {
        // Take the blog id and his user creator details
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }

})

postsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const postModified = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    }

    try {
        const updatedNote = await Blog.findByIdAndUpdate(request.params.id, postModified, { new: true})
        response.json(updatedNote)
    } catch (exception) {
        next(exception)
    }
})

module.exports = postsRouter