const { result } = require('lodash')
const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const sumLikes = _.sumBy(blogs, function(blog) { return blog.likes })
    return sumLikes
}

const favoriteBlog = (blogs) => {
    // If we have an empty list of blogs
    if (blogs.length === 0)
        return {}

    // Else
    const favBlog = _.maxBy(blogs, function(blog) {return blog.likes})
    return {
        title: favBlog.title,
        author: favBlog.author,
        likes: favBlog.likes
    }
}

const mostBlogs = (blogs) => {
    // Get the name's incidence for each author
    // eg. {'Martin': 3}
    const authorsCount = _.countBy(blogs, function(blog) {return blog.author})

    // Create a list of structured objects {author, blogs} for each authorsCount
    const authorsCountObjects = []
    _.forEach(authorsCount, function(key, value) { authorsCountObjects.push( {
        author: value,
        blogs: key
            }
        )}
    )

    // Take the maximum of blogs and return the object
    return _.maxBy(authorsCountObjects, author => author.blogs)

}

const mostLikes = (blogs) => {
    
    // Count likes of each individual author
    authorLikes = _.reduce(blogs, function(first, next) {
        first[next.author] ? (first[next.author] += next.likes) : (first[next.author] = next.likes)
        return first
    }, {})

    // Organize into a structure objects list {author: ..., likes: ...}
    const result = []
    _.forEach(authorLikes, function(key, value) {
        result.push({
            author: value,
            likes: key
        })
    })

    // Take the author with the maximum likes
    return _.maxBy(result, author => author.likes)
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}