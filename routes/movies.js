
import express from "express";
import {getAllMovies, getMovieById, deleteMovieById, addMovie, editMoviebyId} from "../helper.js";

const router = express.Router();

router
.route("/")
.get( async (request,response) => {
    const filter = request.query;
    if(filter.rating)
    filter.rating = +filter.rating;
    const movies = await getAllMovies(filter);
    response.send(movies);
})
.post( async (request,response) => {
    const data = request.body;
    const result = await addMovie(data);
    response.send(result);
});

router
.route("/:id")
.get( async (request,response) => {
    console.log(request.params);
    const {id} = request.params;
    const movie = await getMovieById(id);
    const notfound = { message : "Not found"};
    movie ? response.send(movie) : response.status(404).send(notfound);
})
.delete( async (request,response) => {
    console.log(request.params);
    const {id} = request.params;
    const result = await deleteMovieById(id);
    const notfound = { message : "Not found"};
    result ? response.send(result) : response.status(404).send(notfound);
})
.put( async (request,response) => {

    const {id} = request.params;
    const data = request.body;
    const result = await editMoviebyId(id, data);
    response.send(result);
});

export const moviesRouter = router;