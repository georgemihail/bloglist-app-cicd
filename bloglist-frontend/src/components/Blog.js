import React, {useState} from 'react'
import PropTypes from 'prop-types'
import RemoveButton from './RemoveButton'


const Blog = ({ blog, changeLikes, user, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const newObject = {
      object: {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
      },
      id: blog.id
    }

    changeLikes(newObject)

  }

  const handleDelete = (id) => {
    
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
    {
      removeBlog(id)
    }
      
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (!visible) {
    return (
      <div style={blogStyle} className="showBasic">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
    )
  } else {
    return (
    <div style={blogStyle} className="blogElement">
      <div className="showBasic">
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div className="showUrl">
        {blog.url}
      </div>
      <div className="showLikes">
        likes <span className="likesNr">{blog.likes}</span><button onClick={handleLike}> like </button>
      </div>
      <div className="showAuthor">
        {blog.author}
      </div>
      <div>
        {user && blog.user
          ? <RemoveButton key={blog.id} user={user} blog={blog} delPost={handleDelete}/> 
          : ''
          }
      </div>
      
    </div>
    )
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  changeLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog
