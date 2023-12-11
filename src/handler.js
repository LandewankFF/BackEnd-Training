const databook = require('./app') //array data book, that import from file app.js
const {nanoid} =require('nanoid') // Import the Nanoid Module to provide a Unique ID to be used for each book added

const postDataBook = (request, hapi)=>{
    // (request, hapi) hapi is a framework that use for create server on my projek
    
    // create object data that requsted by client
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;


    /**
     * This's conditions response server if value the readPage large than pageCount
     */
    if(readPage > pageCount){
        const responseMesage = hapi.response({
            status:'fail',
            message:'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        responseMesage.code(400)
        return responseMesage
    }
    /**
     This's condition for determining whether a book is finished reading or not, based on the and values, 
     1. if the readpage value is equal to the pageCount value then it returns true, and if the readPage value is less than pageCount then it returns false
     */
    const isFinished =(readPage,pageCount)=>{
        if(readPage === pageCount){
            return true
        }
        if(readPage < pageCount){
            return false
        }
    }
    /*
        * initialize varibale object that will be store on server
            1. const finished initialize that the value of varibable finished is a function of isFinished
            2. const insertedAt = new Date().toISOString() for used to create a string containing a date and time 
            3. const updateAt = insertedAt, this variable name the value aqual of insertAt.
            4. const id = nanoid(10), id use module nanoid with generated id 10 string number or alphabet
    */
    const finished = isFinished(readPage,pageCount)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const id = nanoid(10) 

    // request body check data name must not zero, if zero this server will respone with status fail and message "Gagal menambahkan buku. Mohon isi nama buku"
    if(name === undefined ){
        const responseMesage =hapi.response({
            status:'fail',
            message:'Gagal menambahkan buku. Mohon isi nama buku'
        })
        responseMesage.code(400)
        return responseMesage
    }

    /**
     * This code used to new add data to array with the name variable databook
     */
    const newData = {id,name, year, author, summary, publisher, pageCount, readPage,finished,reading,insertedAt,updatedAt}
    databook.push(newData)

    /**
     * const isSucces = initialize data from array databook with the condition that we want to search for books with the same ID as id which was just added. with condition the lenght more then zero
     */
    const isSuccess = databook.filter(book =>book.id === id).length > 0
    try{
        // respone server
        if(isSuccess){
            const responseMesage = hapi.response({
                status :'success',
                message :'Buku berhasil ditambahkan',
                data:{
                    bookId :id
                }
            })
            // if response success then give code 201
            responseMesage.code(201)
            return responseMesage
        }
    } catch{
        // if fail to add data to array respon on below
        const responseMesage = hapi.response({
            status:'error',
            message:'Buku gagal ditambahkan'
        })
        responseMesage.code(500)
        return responseMesage
    }

}


const viewDataBooks = (request, hapi) => {
    // Map the 'databook' array to create a new array of selected book properties.
    const booksData = databook.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    // this's resnpone server if check there are not books in array
    if (booksData.length === 0) {
        const emptyResponse = hapi.response({
            status: 'success',
            data: {
                books: [],
            },
        });
        emptyResponse.code(200);
        return emptyResponse;
    }

    //this's respone server when data available on array
    const responseMesage = hapi.response({
        status: 'success',
        data: {
            books: booksData,
        },
    })
    responseMesage.code(200);
    return responseMesage;
};


const viewDataBooksbyID = (request, hapi) => {
    const { bookId } = request.params;

    // Search for a book in the databook array based on the provided bookId
    const book = databook.find(book => book.id === bookId);

    if (!book) {
        // If the book is not found, respond with a 404 status code and appropriate message
        const notFoundResponse = hapi.response({
            status: 'fail',
            message: 'Buku tidak ditemukan', // Book not found message
        });

        notFoundResponse.code(404); // Set the response code to 404
        return notFoundResponse; // Return the notFoundResponse
    }

    // If the book is found, respond with a 200 status code and book details
    const responseMesage = hapi.response({
        status: 'success', // Success status
        data: {
            book: book, // Include the found book in the response
        },
    });

    responseMesage.code(200); // Set the response code to 200
    return responseMesage; // Return the responseMesage
};


const editDataBook = (request, hapi) => {
    const { bookId } = request.params
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    // Find the book based on its ID
    const bookIndex = databook.findIndex((book) => book.id === bookId);

    // Validate that the book with the given ID is found
    if (bookIndex === -1) {
        // If the book is not found, create a response indicating failure and a 404 status code
        const notFoundResponse = hapi.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        notFoundResponse.code(404);
        return notFoundResponse;
    }

    // Validate that the 'name' property exists in the request body
    if (name=== undefined) {
        // If 'name' is missing, create a response indicating failure and a 400 status code
        const responseMessage = hapi.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });

        responseMessage.code(400);
        return responseMessage;
    }

    // Validate that 'readPage' is not greater than 'pageCount'
    if (readPage > pageCount) {
        // If 'readPage' is greater, create a response indicating failure and a 400 status code
        const responseMessage = hapi.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });

        responseMessage.code(400);
        return responseMessage;
    }

    // Update the book's data with the new values
    databook[bookIndex] = {
        ...databook[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt: new Date().toISOString(),
    };

    // Create a success response with a 200 status code
    const responseMessage = hapi.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });

    responseMessage.code(200);
    return responseMessage;
};


const deleteDataBook = (request, hapi) => {
    const { bookId } = request.params;

    // Find the index of the book with the matching ID
    const bookIndex = databook.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
        // Validate that a book with the given ID was not found
        const notFoundResponse = hapi.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        });

        notFoundResponse.code(404);
        return notFoundResponse;
    }

    // Remove the book from databook based on its index
    databook.splice(bookIndex, 1);

    const responseMessage = hapi.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
    });

    responseMessage.code(200);
    return responseMessage;
};


// export function  so that can use on routes.js file
module.exports ={postDataBook,viewDataBooks,viewDataBooksbyID,editDataBook,deleteDataBook}

/*
================== NOTE FOR LEARN ==================
1. 
*/