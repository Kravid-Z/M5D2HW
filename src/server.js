import express from "express";
import {
  notFoundErrorHandler,
  badRequestErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorsHandler,
} from "./errorHandling.js";
// import listEndpoints from "express-list-endpoints";
import cors from "cors";
import studentsRoutes from "./students/index.js";
import projectsRoutes from "./projects/index.js";
import { join } from "path";
import { getCurrentFolderPath } from "./tools/fs-tools.js";

const server = express();

const port = process.env.PORT || 3001;

const publicFolderPath = join(
  getCurrentFolderPath(import.meta.url),
  "../public"
);

server.use(express.static(publicFolderPath));

server.use(cors()); // This is to avoid errors wotking in frontend and backend in same enviroment
server.use(express.json());

server.use("/students", studentsRoutes);
server.use("/projects", projectsRoutes);

// HERE MUST BE THE ERROR MIDDLEWARE (ALWAYS AFTER ALL ROUTES) *ORDER ALWAYS MATTER*
server.use(notFoundErrorHandler); // 1. First check not founds!
server.use(badRequestErrorHandler); // 2. Second check BadRequests!
server.use(forbiddenErrorHandler); // 3. Third check Forbiddens! ??????????????
server.use(catchAllErrorsHandler); // 4. Fourth check FATAL ERRORS!!!!

// console.log(listEndpoints(server)); // this is for check it in real time with nodemon package in the console to get all routeslist
server.listen(port, () => {
  console.log("Server is running on port ", port);
});
