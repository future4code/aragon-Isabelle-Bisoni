import express, {Request, Response }from "express";
import cors from "cors";
import connection from "./database/connection";
import { Employee } from "./types";

const app = express();

app.use(express.json());
app.use(cors());

// aula
// GET produtos com query busca
app.get('/produtos',async (req:Request, res:Response)=> {
    let errorCode = 400
    try {
        const busca = req.query.busca as string

        if (busca) {
            const [resultado] = await connection.raw(`
                SELECT * FROM Produtos
                WHERE LOWER(nome) LIKE "%${busca.toLowerCase()}%";
            `)
            return res.status(200).send({produtos: resultado})
        }
        const [resultado] = await connection.raw(`
            SELECT * FROM Produtos
        `)

        res.status(200).send({result: resultado})
    } catch (error) {
        res.status(errorCode).send({message: error.message})
    }
})

// Exercício 1
app.get('/collaborators', async (req: Request, res: Response)=> {
    let errorCode = 400
    try {
        const busca = req.query.busca as string

        if(busca){
            const [result] = await connection.raw(`
                SELECT * FROM Collaborators
                WHERE LOWER(name) LIKE "%${busca.toLowerCase()}%";
            `)

            res.status(200).send({
                result
            })
        }

        const [result] = await connection.raw(`
            SELECT * FROM Collaborators;
        `)

        res.status(200).send({
            result
        })
        
    } catch (error) {
        res.status(errorCode).send({message: error.message})
    }
})

// Exercício 2
app.post('/collaborators',async (req:Request, res: Response) => {
    let errorCode = 400
    try {
        const {name, email} = req.body

        if(!name || !email){
            errorCode = 422
            throw new Error("Variables name and email must exist")
        }

        if(typeof name !== 'string' || typeof email !== 'string'){
            errorCode = 422
            throw new Error("Name and email need to be string type");
        }

        if(!email.includes('@')){
            errorCode = 422
            throw new Error("Invalid email");
        }

        const [users] = await connection.raw(`
            SELECT * FROM Collaborators
            WHERE email = "${email}";
        `)

        if(users.length > 0) {
            errorCode = 409
            throw new Error("Email already exists");
        }

        const [collaborators] = await connection.raw(`
            SELECT * FROM Collaborators
        `)

        if(name.length < 4){
            errorCode = 422
            throw new Error("Name must have at least 4 characters");
        }

        const id = "00" + (collaborators.length + 1)

        const newCollaborator:Employee = {
            id,
            name,
            email
        }

        await connection.raw(`
            INSERT INTO Collaborators (id, name, email)
            VALUES("${newCollaborator.id}", "${newCollaborator.name}", "${newCollaborator.email}");
        `)

        res.status(201).send({
            message: "New collaborator was added successfully!",
            collaborator: newCollaborator
        })

    } catch (error) {
        res.status(errorCode).send({message: error.message})
    }
})

// Exercício 3
app.put('/collaborators/:id', async (req: Request, res: Response)=> {
    let errorCode = 400
    try {
        const id = req.params.id
        const newEmail = req.body.email as string

        if(!newEmail){
            errorCode = 422
            throw new Error("Missing params");
        }

        if(typeof newEmail !== 'string'){
            errorCode = 422
            throw new Error("Email needs to be string type");
        }

        if(!newEmail.includes('@')){
            errorCode = 422
            throw new Error("Invalid email");
        }

        const [collaborator] = await connection.raw(`
            SELECT * FROM Collaborators
            WHERE id="${id}";
        `)

        if(collaborator.length === 0){
            errorCode=404
            throw new Error("Collaborator not found");
        }

        const [existingEmail] = await connection.raw(`
            SELECT * FROM Collaborators
            WHERE email="${newEmail}"
        `)

        if(existingEmail.length > 0){
            errorCode = 409
            throw new Error("Email already exists");
        }

        await connection.raw(`
            UPDATE Collaborators
            SET email="${newEmail}"
            WHERE id="${id}";
        `)

        res.status(200).send({
            message: "Email updated successfully!",
        })
    } catch (error) {
        res.status(errorCode).send({message: error.message})
    }

})

// Exercício 4
app.delete('/collaborators/:id', async (req: Request, res: Response)=> {
    let errorCode = 400
    try {
        const id = req.params.id

        if(!id){
            errorCode = 422
            throw new Error("Missing param: id"); 
        }

        const [collaborator] = await connection.raw(`
            SELECT * FROM Collaborators
            WHERE id="${id}";
        `)

        if(collaborator.length === 0){
            errorCode = 404
            throw new Error("User not found");
        }

        await connection.raw(`
            DELETE FROM Collaborators
            WHERE id="${id}";
        `)

        res.status(200).send({message: "User successfully deleted!"})

    } catch (error) {
        res.status(errorCode).send({message: error.message})
    }
})

app.listen(process.env.PORT || 3003, () => {
  console.log(`Server running on port ${process.env.PORT || 3003}`)
});