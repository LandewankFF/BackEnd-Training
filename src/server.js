const Hapi = require('@hapi/hapi'); // Import the Hapi.js framework for create server
const routes = require('./routes'); // Import the defined routes for the server

const init = async () => {
    const server = Hapi.server({
        port: 9000, // Configuring the server to listen on port 9000
        host: 'localhost', // Configuring the server to listen on the 'localhost'
    });
    
    server.route(routes); // Associating the defined routes with the server instance

    await server.start();  // Starting the server

    console.log('Server running on %s', server.info.uri); // Printing a message on terminal
}

init(); // Calling the init function to start the server
