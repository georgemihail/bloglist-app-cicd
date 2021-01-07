import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> : when Submit event does fire, update complete his parent state', () => {
    const addBlog = jest.fn()

    const component = render(
        <BlogForm addBlog={addBlog} />
    )

    const inputTitle = component.container.querySelector('.titleInput')
    const inputAuthor = component.container.querySelector('.authorInput')
    const inputUrl = component.container.querySelector('.urlInput')
    const form = component.container.querySelector('form')

    expect(inputTitle).toBeDefined()
    expect(inputAuthor).toBeDefined()
    expect(inputUrl).toBeDefined()

    // Add a title
    fireEvent.change(inputTitle, {
        target: { value: 'first title'}
    })

    // Add author
    fireEvent.change(inputAuthor, {
        target: {value: 'John Author'}
    })

    // Add url
    fireEvent.change(inputUrl, {
        target: { value: 'www.google.com'}
    })

    // Submit the form
    fireEvent.submit(form)

    // Expect to calls the event handlers
    expect(addBlog.mock.calls).toHaveLength(1)

    // Expect to contain the informations
    expect(addBlog.mock.calls[0][0].title).toBe('first title')
    expect(addBlog.mock.calls[0][0].author).toBe('John Author')
    expect(addBlog.mock.calls[0][0].url).toBe('www.google.com')
    
})