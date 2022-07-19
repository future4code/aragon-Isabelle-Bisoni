import { Request, Response } from "express";
import connection from "../database/connection";
import { TABLE_PRODUCTS } from "../database/tableNames";

export const deleteProduct = async(req: Request, res: Response) => {
    let errorCode = 400
    try {
        const productId = req.params.productId

        const [searchProduct] = await connection.raw(`
            SELECT * FROM ${TABLE_PRODUCTS}
            WHERE id = "${productId}";
        `)

        if(searchProduct.length === 0){
            errorCode = 404
            throw new Error("Produto não encontrado");
        }

        await connection.raw(`
            DELETE FROM ${TABLE_PRODUCTS}
            WHERE id = "${productId}"
        `)

        res.status(200).send({message: "Tarefa deletada com sucesso!"})

    } catch (error) {
        res.status(errorCode).send({message:error.message})
    }
}