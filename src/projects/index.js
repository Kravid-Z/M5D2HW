import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
// import { check, validationResult } from "express-validator";

const router = express.Router();

const currentFileName = fileURLToPath(import.meta.url); // getting current file path
const projectsJSONdataPath = join(dirname(currentFileName), "projects.json"); // creating file path for projects.json file with data persitance taking in account difenrent OS with diferent fs roots

//Explanation of fs (file system core module when work in machinestorage without database in cloud)
// const fileAsABuffer = fs.readFileSync(projectsJSONPath) // returns a buffer (machine readable, not human readable)
// const fileAsAString = fileAsABuffer.toString() // returns a string from a buffer
// const fileAsAJSON = JSON.parse(fileAsAString) // converts string into JSON

const projects = JSON.parse(fs.readFileSync(projectsJSONdataPath).toString()); // simplified version

router.get("/", (req, res) => {
  res.send(projects);
});
//Get project by ===> id
router.get("/:id", (req, res) => {
  const project = projects.find((project) => project.id === req.params.id);
  res.send(project);
});

router.post("/", (req, res) => {
  const newProject = req.body;
  newProject.id = uniqid(); //adding unique id for Project
  projects.push(newProject);
  fs.writeFileSync(projectsJSONdataPath, JSON.stringify(projects));
  res.status(201).send(newProject);
});

router.put("/:id", (req, res) => {
  const newprojectsArray = projects.filter(
    (project) => project.id !== req.params.id
  ); // filtering out the specific project object

  const projectModified = req.body;
  projectModified.id = req.params.id; //saving project id
  projects.push(projectModified);

  fs.writeFileSync(projectsJSONdataPath, JSON.stringify(newprojectsArray));
  res.status(204).send();
});

router.delete("/:id", (req, res) => {
  const newprojectsArray = projects.filter(
    (project) => project.id !== req.params.id
  );
  fs.writeFileSync(projectsJSONdataPath, JSON.stringify(newprojectsArray));
  res.status(204).send();
});

export default router;
