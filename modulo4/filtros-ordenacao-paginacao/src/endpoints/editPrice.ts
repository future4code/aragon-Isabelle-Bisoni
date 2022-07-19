import { Request, Response } from "express";
import connection from "../database/connection";
import { TABLE_PRODUCTS } from "../database/tableNames";

export const editPrice = async (req:Request, res:Response) => {
    let errorCode = 400
    try {
        const productId = req.params.productId
        const newPrice = Number(req.body.price)

        if(!newPrice){
            errorCode = 422
            throw new Error("Parâmetro ausente, insira o novo preço");
        }

        const [searchProduct] = await connection.raw(`
            SELECT * FROM ${TABLE_PRODUCTS}
            WHERE id="${productId}";
        `)

        if(searchProduct.length === 0){
            errorCode = 404
            throw new Error("Usuário não encontrado");
        }

        await connection.raw(`
            UPDATE ${TABLE_PRODUCTS}
            SET price = "${newPrice}"
            WHERE id = "${productId}";
        `)

        const [updatedProduct] = await connection.raw(`
            SELECT * FROM ${TABLE_PRODUCTS}
            WHERE id="${productId}";
        `)

        res.status(200).send({
            message: "Preço alterado com sucesso!",
            product: updatedProduct
        })

    } catch (error) {
        res.status(errorCode).send({message: error.message})
    }
}