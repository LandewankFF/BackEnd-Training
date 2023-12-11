// import function from handler.js
const {postDataBook,viewDataBooks,viewDataBooksbyID,editDataBook,deleteDataBook} = require('./handler')


const routes = [
    {
        method :'GET',
        path: '/books',
        handler: viewDataBooks
    },
    {
        method :'GET',
        path:  '/books/{bookId}',
        handler: viewDataBooksbyID
    },
    {
        method :'POST',
        path: '/books',
        handler: postDataBook
    },
    {
        method :'PUT',
        path: '/books/{bookId}',
        handler: editDataBook
    },
    {
        method :'DELETE',
        path: '/books/{bookId}',
        handler: deleteDataBook
    },
]
module.exports = routes;