import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = tokenNr => {
  if (!tokenNr){
    token = null
  } else {
    token = `bearer ${tokenNr}`
  }
  
}

const createPost = newPost => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = axios.post(baseUrl,newPost, config)
  return response.then(result => result.data)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const changeLikes = (newObject) => {
  const response = axios.put(`${baseUrl}/${newObject.id}`, newObject.object)
  return response.then(result => result.data)
}

const deleteABlog = (id) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  
  const response = axios.delete(`${baseUrl}/${id}`, config)
  return response.then(result => result.status)
}

export default { getAll, setToken, createPost, changeLikes, deleteABlog }