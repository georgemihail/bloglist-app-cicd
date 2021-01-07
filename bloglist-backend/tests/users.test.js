const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const test_helper = require('./test_helper')

const api = supertest(app)

beforeEach( async () => {
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('secret', 12)
    const user = new User({
        username: 'johndoe',
        name: 'john',
        passwordHash,
    })
    await user.save()
})

describe('populate the db', () => {
    test('existence of users in db via GET', async () => {
        const users = await api
            .get('/api/users')
            .expect(200)
        expect(users.body).toHaveLength(1)
    })

})

describe('user creation in db via POST', () => {
    test('create a new user', async () => {
        const usersBefore = await test_helper.usersInDB()
        const user1 = {
            username: 'jonny',
            name: 'cash',
            password: 'secret1'
        }

        await api
            .post('/api/users')
            .send(user1)
            .expect(200)

        const usersAtEnd = await test_helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersBefore.length + 1)
        
        // The username is in the 'usersAtEnd'
        const contentUsernames = usersAtEnd.map(u => u.username)
        expect(contentUsernames).toContain(user1.username)
    })
})

describe('Invalid user and/or password', () => {
    test('saving a user with username less than 3 - R400', async () => {
        const usersAtBegining = await test_helper.usersInDB()
        
        const user1 = {
            username: 'jo',
            name: 'Lope',
            password: 'secret2'
        }
        
        await api
            .post('/api/users')
            .send(user1)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        // User are not created
        const usersAtEnd = await test_helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtBegining.length)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).not.toContain(user1.username)
    })

    test('saving a user with a password less than 3 - R400', async () => {
        const usersAtBegining = await test_helper.usersInDB()
        
        const user1 = {
            username: 'jenifer',
            name: 'Lope',
            password: 'se'
        }

        const response = await api
            .post('/api/users')
            .send(user1)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        // User are not created
        const usersAtEnd = await test_helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtBegining.length)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).not.toContain(user1.username)

        // Response are suitable
        expect(response.body.error).toBe('Password invalid')
    })
})


afterAll(() => {
    mongoose.connection.close()
})