import React from 'react'

const RemoveButton = (props) => {
  
    if (
      props.user !== null &&
      props.user.username &&
      props.blog.user.username &&
      props.user.username === props.blog.user.username
      ) {
      return (
        <div>
        <button onClick={() => props.delPost(props.blog.id)}>Remove</button>
        </div>
      )
      
    } else {
      return null
    }
}

export default RemoveButton
