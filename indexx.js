
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

// const express = require('express');
const app = express();
const PORT = 9000;



const MONGO_URL = process.env.MONGO_URL;

// const movies = [
//     {"id":"100","name":"Iron man 2","language":"English","poster":"https://m.media-amazon.com/images/M/MV5BMTM0MDgwNjMyMl5BMl5BanBnXkFtZTcwNTg3NzAzMw@@._V1_FMjpg_UX1000_.jpg","rating":7,"summary":"With the world now aware that he is Iron Man, billionaire inventor Tony Stark (Robert Downey Jr.) faces pressure from all sides to share his technology with the military. He is reluctant to divulge the secrets of his armored suit, fearing the information will fall into the wrong hands. With Pepper Potts (Gwyneth Paltrow) and Rhodes (Don Cheadle) by his side, Tony must forge new alliances and confront a powerful new enemy.","trailer":"https://www.youtube.com/embed/wKtcmiifycU"},
//     {"id":"101","name":"No Country for Old Men","language":"English","poster":"https://upload.wikimedia.org/wikipedia/en/8/8b/No_Country_for_Old_Men_poster.jpg","rating":8.1,"summary":"A hunter's life takes a drastic turn when he discovers two million dollars while strolling through the aftermath of a drug deal. He is then pursued by a psychopathic killer who wants the money.","trailer":"https://www.youtube.com/embed/38A__WT3-o0"},
//     {"id":"102","name":"Jai Bhim","language":"Tamil","poster":"https://m.media-amazon.com/images/M/MV5BY2Y5ZWMwZDgtZDQxYy00Mjk0LThhY2YtMmU1MTRmMjVhMjRiXkEyXkFqcGdeQXVyMTI1NDEyNTM5._V1_FMjpg_UX1000_.jpg","summary":"A tribal woman and a righteous lawyer battle in court to unravel the mystery around the disappearance of her husband, who was picked up the police on a false case","rating":8.8,"trailer":"https://www.youtube.com/embed/nnXpbTFrqXA"},
//     {"id":"103","name":"The Avengers","language":"English","rating":8,"summary":"Marvel's The Avengers (classified under the name Marvel Avengers\n Assemble in the United Kingdom and Ireland), or simply The Avengers, is\n a 2012 American superhero film based on the Marvel Comics superhero team\n of the same name.","poster":"https://terrigen-cdn-dev.marvel.com/content/prod/1x/avengersendgame_lob_crd_05.jpg","trailer":"https://www.youtube.com/embed/eOrNdBpGMv8"},
//     {"id":"104","name":"Interstellar","language":"English","poster":"https://m.media-amazon.com/images/I/A1JVqNMI7UL._SL1500_.jpg","rating":8.6,"summary":"When Earth becomes uninhabitable in the future, a farmer and ex-NASA\n pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team\n of researchers, to find a new planet for humans.","trailer":"https://www.youtube.com/embed/zSWdZVtXT7E"},
//     {"id":"105","name":"Baahubali","language":"Telugu","poster":"https://flxt.tmsimg.com/assets/p11546593_p_v10_af.jpg","rating":8,"summary":"In the kingdom of Mahishmati, Shivudu falls in love with a young warrior woman. While trying to woo her, he learns about the conflict-ridden past of his family and his true legacy.","trailer":"https://www.youtube.com/embed/sOEg_YZQsTI"},
//     {"id":"106","name":"Ratatouille","language":"English","poster":"https://resizing.flixster.com/gL_JpWcD7sNHNYSwI1ff069Yyug=/ems.ZW1zLXByZC1hc3NldHMvbW92aWVzLzc4ZmJhZjZiLTEzNWMtNDIwOC1hYzU1LTgwZjE3ZjQzNTdiNy5qcGc=","rating":8,"summary":"Remy, a rat, aspires to become a renowned French chef. However, he fails to realise that people despise rodents and will never enjoy a meal cooked by him.","trailer":"https://www.youtube.com/embed/NgsQ8mVkN8w"}
// ]

app.use(express.json());

async function createConnection(){
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongodb connected");

    return client;
}

// createConnection();

app.get('/', (request,response) => {
    response.send("Hello, World!!!!");
});

// app.get('/movies', (request,response) => {

//     const {language, rating} = request.query;
//     let language_movies = movies;
//     if(language)
//     language_movies = language_movies.filter( movie => movie.language === language);
//     if(rating)
//     language_movies = language_movies.filter( movie => movie.rating === +rating);

//     response.send(language_movies);
// });

app.get('/movies', async (request,response) => {

    const filter = request.query;

    if(filter.rating)
    filter.rating = +filter.rating;

    const client = await createConnection();
    const movies = await client.db("newdb").collection("movies").find(filter).toArray();

    response.send(movies);
});

app.get('/movies/:id', async (request,response) => {
    console.log(request.params);
    // const movies = await client.db("newdb").collection("movies").findOne({id:"103"})
    const {id} = request.params;
    const client = await createConnection();
    // response.send(`movie detail ${id}`);
    // response.send(movies.filter( movie => movie.id==id)); //returns an array
    // const movie = movies.find( movie => movie.id=== +id); //returns an object
    const movie = await getMovieById(client, id);
    const notfound = { message : "Not found"};
    movie ? response.send(movie) : response.status(404).send(notfound);
});

app.delete('/movies/:id', async (request,response) => {
    console.log(request.params);
    const {id} = request.params;
    const client = await createConnection();
    const movie = await client.db("newdb").collection("movies").deleteOne({id:id});
    const notfound = { message : "Not found"};
    movie ? response.send(movie) : response.status(404).send(notfound);
});


app.post('/movies', async (request,response) => {
    const client = await createConnection();
    const data = request.body;
    const result = await client.db("newdb").collection("movies").insertMany(data);
    response.send(result);
});

app.put('/movies/:id', async (request,response) => {

    const {id} = request.params;
    const client = await createConnection();
    const data = request.body;
    const result = await client.db("newdb").collection("movies").updateOne({id : id},{ $set : data});
    response.send(result);
});

app.listen(PORT, () => { console.log("App is started on ", PORT)});

async function getMovieById(client, id) {
    return await client.db("newdb").collection("movies").findOne({ id: id });
}
