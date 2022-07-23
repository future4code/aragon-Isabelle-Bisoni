import { Request, Response } from "express";
import connection from "../database/connection";
import { TABLE_USERS } from "../database/tableNames";
import { User } from "../models/User";

export const createUser = async (req: Request, res: Response) => {
    let errorCode = 400
    try {
        const {email, password} = req.body

        if(!email || !password){
            errorCode = 422
            throw new Error("Insert email and password");
        }

        const newUser:User = {
            id: Date.now().toString(),
            email,
            password
        }

        await connection(TABLE_USERS)
        .insert({
            id: newUser.id,
            email: newUser.email,
            password: newUser.password
        })

        res.status(201).send({
            user: newUser,
            message: "New user created!"
        })
        
    } catch (error) {
        res.status(errorCode).send({
            message: error.message
        })
    }
}