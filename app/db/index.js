import mongoose from 'mongoose';
require('dotenv').config();

// const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
// console.log('this is the environment: ', environment);

export default async function makeDb() {
    const connUri = process.env.MONGO_PROD_CONN_URL;
    mongoose.promise = global.Promise;
    mongoose.connect(connUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });

    const connection = mongoose.connection;
    connection.once("open", () =>
        console.log("MongoDB --  database connection established successfully!")
    );
    connection.on("error", (err) => {
        console.log(
            `MongoDB connection error. Please make sure MongoDB is running. Err: ${err}`
        );
        process.exit();
    });
}
