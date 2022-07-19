import { Request, Response } from "express";
import connection from "../database/connection";
import { TABLE_PERFUMES } from "../database/tableNames";

export const deletePerfume = async (req: Request, res: Response) => {
    let errorCode = 400
    try {
        const perfumeId = req.params.perfumeId

        const searchPerfume = await connection(TABLE_PERFUMES)
            .select()
            .where({ id: perfumeId })

        if (searchPerfume.length === 0) {
            errorCode = 404
            throw new Error("Item não encontrado.")
        }

        await connection(TABLE_PERFUMES)
            .delete()
            .where({ id: perfumeId })
        
        res.status(200).send({
            message: "Perfume deletado com sucesso!"
        })

    } catch (error) {
        res.status(errorCode).send({
            message: error.message
        })
    }
}