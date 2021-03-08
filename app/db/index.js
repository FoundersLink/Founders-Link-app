import mongoose from 'mongoose';
require('dotenv').config();

const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
// console.log('this is the environment: ', environment);

export default async function makeDb() {
    const config = {}
    let url;
    config.database = process.env.DB_NAME ? process.env.DB_NAME : 'test';
    config.username = process.env.DB_USER;
    config.password = process.env.DB_PASS;
    config.host = process.env.DB_HOST;
    if (environment === "production") {
        // Use this url when in production
        // url = `mongodb+srv://${config.username}:${config.password}@${config.host}/${config.database}?retryWrites=true&w=majority`;
    } else {
        // Use this url locally
        // url = `mongodb://localhost:27017`;
         url = `mongodb+srv://${config.username}:${config.password}@${config.host}/${config.database}?retryWrites=true&w=majority`;
    }

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
        .then(
            () => console.log(".... Connected ...."))
        .catch(error => {
            console.log("Connections issues");
            throw Error('Connections issues');
        });

    mongoose.Promise = global.Promise
}