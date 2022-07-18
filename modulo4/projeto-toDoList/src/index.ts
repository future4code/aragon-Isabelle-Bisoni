import express from "express";
import cors from "cors";
import { ping } from "./endpoints/ping";
import { getUsers } from "./endpoints/getUsers";
import { getToDos } from "./endpoints/getToDos";
import { getResponsible } from "./endpoints/getResponsible";
import { addResponsible } from "./endpoints/addResponsible";
import { editNickname } from "./endpoints/editNickname";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3003, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3003}`)
});

// Endpoint com o callback vindo por import da pasta endpoints
app.get("/ping", ping)

// Endpoint 1
app.get("/users", getUsers)

// Endpoint 2
app.get("/tasks", getToDos)

// Endpoint 3
app.get("/tasks/:taskId/users", getResponsible)

// Endpoint 4
app.post("/tasks/:taskId/users", addResponsible)

// Endpoint 5
app.put("/users/:userId", editNickname)

// Siga o exemplo do ping acima e monte seus endpoints abaixo!