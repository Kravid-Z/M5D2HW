import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import studentsRoutes from "/Users/Usuario/Documents/GitHub/M5D2/src/students/index.js";

const server = express();
const port = 3001;

server.use(cors()); // This is to avoid errors wotking in frontend and backend in same enviroment
server.use(express.json());
server.listen();
server.use("/students", studentsRoutes);

console.log(listEndpoints(server)); // this is for check it in real time with nodemon package in the console to get all routeslist

server.listen(port, () => {
  console.log("Server is running on port ", port);
});