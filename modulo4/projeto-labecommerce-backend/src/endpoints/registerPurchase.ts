import { Request, Response } from "express";
import connection from "../database/connection";
import { TABLE_PRODUCTS, TABLE_PURCHASES, TABLE_USERS } from "../database/tableNames";
import { Purchase } from "../models/Purchase";

export const registerPurchase = async (req: Request, res: Response) => {
    let errorCode = 400
    try {
        const { user_id, product_id, quantity } = req.body

        if (!user_id || !product_id || !quantity) {
            errorCode = 422
            throw new Error("Missing params! Try again");
        }

        if (typeof quantity !== 'number') {
            errorCode = 422
            throw new Error("Quantity must be a number");
        }

        const searchUser = await connection(TABLE_USERS)
            .select()
            .where('id', '=', `${user_id}`)

        if (searchUser.length === 0) {
            errorCode = 404
            throw new Error("User not found");
        }

        const searchProduct = await connection(TABLE_PRODUCTS)
            .select()
            .where('id', '=', `${product_id}`)

        if (searchProduct.length !== 0) {

            const newPurchase: Purchase = {
                id: Date.now().toString(),
                user_id,
                product_id,
                quantity,
                total_price: searchProduct[0].price * quantity
            }

            await connection(TABLE_PURCHASES)
                .insert({
                    id: newPurchase.id,
                    user_id: newPurchase.user_id,
                    product_id: newPurchase.product_id,
                    quantity: newPurchase.quantity,
                    total_price: newPurchase.total_price
                })

            res.status(201).send({
                newPurchase,
                message: "Your purchase was registered successfully"
            })

        }
    } catch (error) {
        res.status(errorCode).send({
            message: error.message
        })
    }
}