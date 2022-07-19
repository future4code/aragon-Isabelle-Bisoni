import { Request, Response } from "express";
import connection from "../database/connection";
import { TABLE_PERFUMES } from "../database/tableNames";

export const editPrice = async (req: Request, res: Response) => {
    let errorCode = 400
    try {
        const perfumeId = req.params.perfumeId
        const newPrice = Number(req.body.price)

        if (!newPrice) {
            errorCode = 422
            throw new Error("Parâmetro ausente, insira o novo preço");
        }

        const searchPerfume = await connection(TABLE_PERFUMES)
            .select()
            .where({ id: perfumeId })

        if (searchPerfume.length === 0) {
            errorCode = 404
            throw new Error("Item não encontrado");
        }

        await connection(TABLE_PERFUMES)
            .update({
                price: newPrice
            })
            .where({ id: perfumeId })

        const updatedPerfume = await connection(TABLE_PERFUMES)
            .select()
            .where({ id: perfumeId })

        res.status(200).send({
            message: "Preço do produto editado com sucesso.",
            perfume: updatedPerfume[0]
        })

    } catch (error) {
        res.status(errorCode).send({
            message: error.message
        })
    }
}