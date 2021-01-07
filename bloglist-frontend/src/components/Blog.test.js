import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'


describe('Use <ToggleElement> component with <Blog>', () =>{
    let component
    let changeLikes
    let removeBlog

    beforeEach(() => {
        // Initialize a random blog object
        const blog = {
            author: "Mark",
            id: "5fbaba0a14bf8836225d0239",
            likes: 13,
            title: "This is the seccond note",
            url: "www.example.com",
            user: {
                username: "jackson",
                name: "emil",
                id: "5fbab625362360358db06353"
            }
        }
    
        // Initialize an random user object
        const user = {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ…Tk5fQ.K4-1Om_uGA3NgTkjlzeNtqOWTXuQKfMAa-W6JqFQuc8",
            username: "george", 
            name: "George Mihail"
        }
    
        changeLikes = jest.fn()
        removeBlog = jest.fn()
    
        component = render(
            <Blog blog={blog}
                changeLikes={changeLikes}
                user={user}
                removeBlog={removeBlog}
            />
        )
    })

    test('component displaying the blog title and author, but no others', () => {
        // display author and title
        const div = component.container.querySelector('.showBasic')
        expect(div).toBeDefined()

        // not display url
        expect(
            component.container.querySelector('.showUrl')
        ).toBe(null)

        // not display likes
        expect(
            component.container.querySelector('.showLikes')
        ).toBe(null)   
        
    })

    test('after click on "view" button, component display details', () => {
        const button = component.getByText('view')
        fireEvent.click(button)
        // After click on 'view' button, display url
        expect(
            component.container.querySelector('.showUrl')
        ).not.toBe(null)

        // After click on 'view' button, display likes
        expect(
            component.container.querySelector('.showLikes')
        ).not.toBe(null)
    })

    test('after click twice on "like" btn, changeLikes() is called twice', () => {
        // First, click on view button
        const button = component.getByText('view')
        fireEvent.click(button)

        // Then, click twice on like button
        const likeButton = component.getByText('like')
        fireEvent.click(likeButton)
        fireEvent.click(likeButton)

        // Expect changeLikes to be called twice
        expect(changeLikes.mock.calls).toHaveLength(2)
    })
})

