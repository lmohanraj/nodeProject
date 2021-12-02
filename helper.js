
import {client} from "./index.js";

async function editMoviebyId(id, data) {
    return await client.db("newdb").collection("movies").updateOne({ id: id }, { $set: data });
}
async function addMovie(data) {
    return await client.db("newdb").collection("movies").insertMany(data);
}
function deleteMovieById( id) {
    return client.db("newdb").collection("movies").deleteOne({ id: id });
}
async function getAllMovies( filter) {
    return await client.db("newdb").collection("movies").find(filter).toArray();
}
async function getMovieById( id) {
    return await client.db("newdb").collection("movies").findOne({ id: id });
}

export { getAllMovies, getMovieById, deleteMovieById, addMovie, editMoviebyId };
