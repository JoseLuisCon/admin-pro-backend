// getting-started.js
const mongoose = require('mongoose');

require ('dotenv').config();

const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.DB_CONNECT,
     
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

        console.log('Base de datos Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a  la hora de iniciar la BD en Mongo')
    }

}

module.exports = { dbConnection }

