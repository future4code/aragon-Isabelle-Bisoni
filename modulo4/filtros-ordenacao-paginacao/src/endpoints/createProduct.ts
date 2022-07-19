import { Request, Response } from "express";
import connection from "../database/connection";
import { TABLE_PRODUCTS } from "../database/tableNames";


export const createProduct = async(req:Request, res:Response) => {
    let errorCode = 400
    try {
        const {name, price} = req.body

        if (!name || !price) {
            res.statusCode = 422
            throw new Error("Insira nome e preço do produto");
        }

        if (typeof name !== 'string' || typeof price !== 'number') {
            res.statusCode = 422
            throw new Error("'name' precisa ser do tipo string e 'price' do tipo número");
        }

        const newProduct = {
            id: Date.now(),
            name,
            price
        }

        await connection.raw(`
            INSERT INTO ${TABLE_PRODUCTS} (id, name, price)
            VALUES ("${newProduct.id}", "${newProduct.name}", "${newProduct.price}");
        `)

        res.status(201).send({
            message: "Produto criado com sucesso!",
            return: newProduct
        })

    } catch (error) {
        res.status(errorCode).send({message: error.message})
    }
}