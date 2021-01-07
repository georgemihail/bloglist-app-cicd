const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/post')
const testHelper = require('./test_helper')

const api = supertest(app)

 /* Helper function:
 Take the username and id properties of an user
 and return his token */ 
const userToken = (user) => {
    const userForToken = {
        username: user.username,
        id: user.id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    return token
}

beforeEach( async () => {
    // Take a user from the db for performing tests
    const user = await testHelper.usersInDB()

    // Clear the previous entries from database
    await Blog.deleteMany({})

    // Populate the database with blogs data
    for (let blog of testHelper.blogs) {
        const blg = Blog({...blog, user: user[0].id})
        await blg.save()
    }
})

describe('check a property existence', () => {
    test('property "id" of a blog post exists', async () => {
        const result = await api
            .get('/api/blogs')

        // Take first note
        const blog1 = result.body
        expect(blog1[0].id).toBeDefined()
    })
})

describe('blog (POST) creation', () => {
    test('successfully creates a new blog post', async() => {
        // Take a user from the db for performing tests
        const user = await testHelper.usersInDB()
        const token = userToken(user[0])

        const postObj = {
            'title':'This is created with POST method',
            'author':'George',
            'url':'www.createposts.com',
            'likes':5,
            'userId': user[0].id
        }
        await api
            .post('/api/blogs')
            .set('authorization', `bearer ${token}`)
            .send(postObj)
            .expect(200)

        // Get the objects from /api/blogs
        const result = await testHelper.blogsInDB()
        
        // Extract the titles from the objects
        const content = result.map(blg => blg.title)
        
        // Check the expected results
        expect(content).toHaveLength(testHelper.blogs.length + 1)
        expect(content).toContain(postObj.title)

    })
})

describe('missing preperties from request', () => {
    test('likes property is missing from the request', async () => {
        // Take a user from the db for performing tests
        const user = await testHelper.usersInDB()
        const token = userToken(user[0])

        const postObj = {
            'title':'This is post haven\'t like property',
            'author':'George',
            'url':'www.createpostswithoutlikes.com',
            'userId': user[0].id
        }

        const result = await api
            .post('/api/blogs')
            .set('authorization', `bearer ${token}`)
            .send(postObj)

        expect(result.body.likes).toBeDefined()
        
    })

    test('title and url are missing from the request - 404 -', async () => {  
        // Take a user from the db for performing tests
        const user = await testHelper.usersInDB()
        const token = await userToken(user[0])

        const postObj = {
            'author':'George',
            'likes':5,
            'userId': user[0].id
        }
        await api
            .post('/api/blogs')
            .set('authorization', `bearer ${token}`)
            .send(postObj)
            .expect(400)

    })
})

describe('deletion of a post', () => {
    test('delete a single blog post resource', async () => {
        // Take the user creator from db
        const user = await testHelper.usersInDB()
        // const token = await loginUser(user[0].username, 'secret')
        const token = userToken(user[0])

        // Take all the blogs
        const blogsBefore = await testHelper.blogsInDB()
        
        // Delete the first blog, by taking his id
        await api
            .delete(`/api/blogs/${blogsBefore[0].id}`)
            .set('authorization', `bearer ${token}`)
            .expect(204)

        // Take again all blogs
        let blogsAfter = await testHelper.blogsInDB()
        
        // See if the entries is less by 1
        expect(blogsAfter).toHaveLength(blogsBefore.length - 1)
    })

    test('cannot delete a post without a valid token', async () => {
        // Take all the blogs
        const blogsBefore = await testHelper.blogsInDB()
        
        // Delete the first blog, by taking his id
        await api
            .delete(`/api/blogs/${blogsBefore[0].id}`)
            .expect(401)

        // Take again all blogs
        let blogsAfter = await testHelper.blogsInDB()
        
        // See if the entries is the same
        expect(blogsAfter).toHaveLength(blogsBefore.length)
    })
})

describe('update operation', () => {
    test('update a blog\'s number of likes', async () => {
        // Take all the blogs
        const blogs = await testHelper.blogsInDB()

        // Change likes to 12 for the first blog, as a new object
        const newPost = {...blogs[0], likes: 12}

        const result = await api
            .put(`/api/blogs/${blogs[0].id}`)
            .send(newPost)
            .expect(200)
        
        expect(result.body.likes).toBe(12)       

    })
})

describe('don\'t allow a user to POST without token', () => {
    test('not allow to post without a valid token', async () => {
        // Take a user from the db for performing tests
        const user = await testHelper.usersInDB()

        // Set an invalid token intentionally
        const token = 'invalidToken'

        const postObj = {
            'title':'This is created with POST method',
            'author':'George',
            'url':'www.createposts.com',
            'likes':5,
            'userId': user[0].id
        }
        await api
            .post('/api/blogs')
            .set('authorization', `bearer ${token}`)
            .send(postObj)
            .expect(401)

        // Get the objects from /api/blogs
        const result = await testHelper.blogsInDB()
        
        // Extract the titles from the objects
        const content = result.map(blg => blg.title)
        
        // Check the expected results
        expect(content).toHaveLength(testHelper.blogs.length)
        expect(content).not.toContain(postObj.title)
    })
})

afterAll(() => {
    mongoose.connection.close()
})