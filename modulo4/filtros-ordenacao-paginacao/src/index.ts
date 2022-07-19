import express from "express";
import cors from "cors";
import { ping } from "./endpoints/ping";
import { getUsers } from "./endpoints/getUsers";
import { getProducts } from "./endpoints/getProducts";
import { createProduct } from "./endpoints/createProduct";
import { deleteProduct } from "./endpoints/deleteProduct";
import { editPrice } from "./endpoints/editPrice";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3003, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3003}`)
});

app.get("/ping", ping)

// Get users
app.get("/users", getUsers)

// Exercício 1 e 2
app.get("/products",getProducts)

// Exercício 3
app.post("/products", createProduct)

// Exercício 4
app.delete("/products/:productId", deleteProduct)

// Finalizando "CRUD"
app.put("/products/:productId", editPrice)
