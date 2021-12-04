
import express from "express";
import bcrypt from "bcrypt";
import {createUser, getUserByName} from "../helper.js";

const router = express.Router();

router.route("/signup").post( async (request,response) => {
    const {username, password} = request.body;
    // console.log(data);
    // const result = await addMovie(data);
    const { salt, hashedPassword } = await generatePassword(password);
    console.log(salt, hashedPassword);

    const userExist = await getUserByName(username);

    if(userExist){
    response.status(400).send({message:"User already exists"});
    return
    }

    if(!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#%&]).{8,}$/g.test(password)
    ){
        response.send({message:"Password must be stronger"});
    return
    }

    const result = await createUser({username, password : hashedPassword})
    response.send(result);
});


export const usersRouter = router;

async function generatePassword(password) {
    const NO_OF_ROUNDS = 10;
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return { salt, hashedPassword };
}


// Task
// Store the data in users collection
// username & hashedPassword
// 1. verify username already exists
// 2. password is strong are not - "Provide a stronger password"
// at least 8 characters
// at least 1 small, capital letter & one special character