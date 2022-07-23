import { Request, Response } from "express";
import connection from "../database/connection";
import { TABLE_PRODUCTS } from "../database/tableNames";
import { Product } from "../models/Product";

export const insertProduct = async(req:Request, res:Response)=> {
    let errorCode = 400
    try {
        const { name, price } = req.body

        if (!name || !price){
            errorCode = 422
            throw new Error("Missing params! Insert a Name and a Price");
        }

        if(typeof name !== 'string' || typeof price !== 'number'){
            errorCode = 422
            throw new Error("Name must be string type, and price a number type");
        }

        const newProduct:Product = {
            id: Date.now().toString(),
            name,
            price
        }

        await connection(TABLE_PRODUCTS)
        .insert({
            id: newProduct.id,
            name: newProduct.name,
            price: newProduct.price
        })

        res.status(201).send({
            newProduct,
            message: "Product added successfully"
        })

    } catch (error) {
        res.status(errorCode).send({
            message: error.message
        })
    }
}