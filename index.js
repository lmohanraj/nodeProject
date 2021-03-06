
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import { moviesRouter } from "./routes/movies.js";
import { usersRouter } from "./routes/users.js";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;
const MONGO_URL = process.env.MONGO_URL;
app.use(express.json());
app.use(cors());

async function createConnection(){
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongodb connected");

    return client;
}

export const client = await createConnection();

app.get('/', (request,response) => {
    response.send("Hello, World!!!!");
});

app.use('/movies', moviesRouter)

app.use('/users', usersRouter)

app.listen(PORT, () => { console.log("App is started on ", PORT)});


