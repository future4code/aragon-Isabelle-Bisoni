import { Request, Response } from "express";
import connection from "../database/connection";
import { TABLE_PURCHASES, TABLE_USERS } from "../database/tableNames";

export const getPurchases = async(req:Request, res:Response)=> {
    let errorCode = 400
    try {
        const user_id = req.params.user_id

        const searchUser = await connection(TABLE_USERS)
        .select("*")
        .where("id", "=", `${user_id}`)

        if(searchUser.length === 0){
            errorCode = 404
            throw new Error("User not found");
        }

        const searchPurchase = await connection(TABLE_PURCHASES)
        .select("*")
        .where("user_id", "=", `${user_id}`)

        if(searchPurchase.length === 0){
            errorCode = 404
            throw new Error("User doesn't have registered purchases yet");
        }

        const [result] = await connection.raw(`
        SELECT 
        Labe_Users.email,
        Labe_Products.name,
        Labe_Products.price,
        Labe_Purchases.quantity,
        Labe_Purchases.total_price
        FROM Labe_Purchases
        INNER JOIN Labe_Products
        ON Labe_Products.id = Labe_Purchases.product_id
        INNER JOIN Labe_Users
        ON Labe_Users.id = Labe_Purchases.user_id
        WHERE user_id = "${user_id}";
        `)

    res.status(200).send({ purchases: result })

    } catch (error) {
        res.status(errorCode).send({
            message: error.message
        })
    }
}