import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/notification'
import BlogForm from './components/BlogForm'
import ToggleElement from './components/ToggleElement'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [notifysuccess, setNotifySuccess] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const userSaved = window.localStorage.getItem('userSaved')
    if (userSaved) {
      const parsedUser = JSON.parse(userSaved)
      setUser(parsedUser)
      blogService.setToken(parsedUser.token)
    }
  }, [])
  
  const handleLogin = (event) => {
    event.preventDefault()
    loginService
      .login({
        username: username,
        password: password
      })
      .then(result => {
        setUser(result)
        window.localStorage.setItem('userSaved', JSON.stringify(result))
        blogService.setToken(result.token)
        
      })
      .catch(error => {
        setNotifyMessage('wrong username or password')
        setTimeout(() => {
          setNotifyMessage(null)
        }, 4000)
      })
      setUsername('')
      setPassword('')
  }

  const removeUser = () => {
    window.localStorage.removeItem('userSaved')
    setUser(null)
    blogService.setToken(null)
  }

  const handlerPost = (newPost) => {
    blogService.createPost(newPost)
    .then(result => {
      
      setBlogs(blogs.concat(result))
      setNotifySuccess(true)
      setNotifyMessage(
      `a new blog ${result.title} by ${result.author} added`
      )
      setTimeout(() => {
        setNotifyMessage(null)
        setNotifySuccess(false)
      }, 4000)
    })
    .catch(error => {
      setNotifyMessage(
        `Cannot create a new post because ${error.message}`
      )
      setTimeout(() => {
        setNotifyMessage(null)
      }, 4000)
    })
  }

  const handleLikes = (newObject) => {
    blogService
      .changeLikes(newObject)
      .then(updatedBlog => {
        setBlogs(
          blogs.map(b => b.id !== newObject.id ? b : updatedBlog)
        )
      })
      .catch(error => {
        console.log('There is an error: ', error)
      })
  }

  const deleteBlog = (id) => {
    blogService
      .deleteABlog(id)
      .then(result => {
        setBlogs(
          blogs.filter(blog => blog.id !== id)
        )
      })
      .catch(error => {
        console.log('Could not detele the blog because', error)
      })
  }

  const loginForm = () => (
    <div>
      <h2> log in to aplication </h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
          type="text"
          name="Username"
          value={username}
          onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
          type="password"
          value={password}
          onChange={({target}) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const displayBlogs = blogs.sort(function(a, b) { 
    return b.likes - a.likes
  })

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notifyMessage} success={notifysuccess}/>
      {user === null
        ? loginForm()
        : <div>
            <div>
              {user.name} logged in
              <button onClick={removeUser}>logout</button>
            </div>
            <div>
            <ToggleElement label="new blog">
              <BlogForm addBlog={handlerPost} />
            </ToggleElement>
            </div>
            
          </div>
          
        }
      
      {displayBlogs.map(blog =>
        <Blog 
          key={blog.id}
          blog={blog}
          changeLikes={handleLikes}
          user={user}
          removeBlog={deleteBlog}
        />
        
      )}
    </div>
  )
}

export default App