const Blog = require('../models/post')
const User = require('../models/user')

const blogs = [
    {'title':'This is first test_post','author':'John W','url':'www.blogs.sports.com','likes':4},
    {'title':'And that\'s the seccond','author':'Mozzart W','url':'www.blogs.muzic.com','likes':10}
]

const nonExistingId = async () => {
    const blog = Blog({
        'title': 'This is a new post',
        'author': 'John Doe',
        'url': 'www.newpostdoe.com'
    })
    
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    blogs, nonExistingId, blogsInDB, usersInDB
}