import { Request, Response } from "express";
import connection from "../database/connection";
import { TABLE_PERFUMES } from "../database/tableNames";
import { Perfume } from "../models/Perfume";

export const createPerfume = async(req: Request, res:Response)=> {
    let errorCode = 400
    try {

        const {name, brand, price, ml} = req.body

        if(!name || !brand || !price || !ml){
            errorCode = 422
            throw new Error("Insira todos os parâmetros: name, brand, price e ml");
        }

        if(typeof name !=='string'|| typeof brand !== 'string'|| typeof price !== 'number' || typeof ml !== 'number'){
            errorCode = 422
            throw new Error("name e brand precisam ser do tipo string, enquanto price e ml precisam ser tipo number");           
        }

        const newPerfume:Perfume = {
            id: Date.now().toString(),
            name,
            brand,
            price,
            ml
        }

        await connection(TABLE_PERFUMES)
        .insert({
            id: newPerfume.id,
            name: newPerfume.name,
            brand: newPerfume.brand,
            price: newPerfume.price,
            ml: newPerfume.ml
        })

        res.status(201).send({
            perfume: newPerfume,
            message: "Perfume adicionado com sucesso!"
        })
        
    } catch (error) {
        res.status(errorCode).send({
            message: error.message
        })
    }
}