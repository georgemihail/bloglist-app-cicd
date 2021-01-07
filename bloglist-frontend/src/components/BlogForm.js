import React, {useState} from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({addBlog}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handlerPost = (event) => {
        event.preventDefault()
        addBlog({
            title: title,
            author: author,
            url: url,
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }
    return(
        <div>
        <h2>create new</h2>
          <form onSubmit={handlerPost}>
            <div>
              title:
              <input
              type="text"
              value={title}
              name="title"
              className="titleInput"
              onChange={({target}) => setTitle(target.value)}
              />
            </div>
            <div>
              author:
              <input
              type="text"
              value={author}
              className="authorInput"
              onChange={({target}) => setAuthor(target.value)}
              />
            </div>
            <div>
              url:
              <input
              type="text"
              value={url}
              className="urlInput"
              onChange={({target}) => setUrl(target.value)}
              />
            </div>
            <div>
              <button id="create-blog">create</button>
            </div>
          </form>
      </div>
    )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default BlogForm