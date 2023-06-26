const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        //Middlewares
        this.middlewares();
        //Rutas
        this.routes();
    }


    middlewares() {

        //Cors 
        this.app.use(cors());
        //Lectura y parseo del body
        this.app.use(express.json());
        //Public estatico
        this.app.use(express.static('public'));

    }

    routes() {

        this.app.use('/encryption', require('../routes/encryption_routes'));
        this.app.use('/encryption2', require('../routes/encryption2_routes'));

    }

    listen() {

        this.app.listen(process.env.PORT, () => {
            console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
        });

    }

}


module.exports = Server;