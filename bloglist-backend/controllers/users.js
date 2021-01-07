const bcrypt = require('bcrypt')
usersRouter = require('express').Router()
User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', {url: 1, title: 1, author: 1})
    response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
    const body = request.body

    // Check if the password is valid
    if (!body.password || body.password.length < 3)
        return response.status(400).json({error: 'Password invalid'})
    
    const saltRounds = 12
    try {
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()
    response.json(savedUser)
    } catch (exception) {
        next(exception)
    }
})

module.exports = usersRouter