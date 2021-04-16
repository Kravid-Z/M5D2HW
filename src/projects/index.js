import express from "express";
import { check, validationResult } from "express-validator";
import uniqid from "uniqid";
import { getProjects, writeProjects } from "../tools/fs-tools.js";

const router = express.Router();

/**-SCHEMA PROJECT
 * - Name *Req
 * - Description *Req
 * - Creation Date /Server Generated
 * - ID / Server Generated
 * - RepoURL -> Code Repo URL (es.: GitHub / BitBucket project URL) *Req
 * - LiveURL -> URL of the "live" project *Req
 * - StudentID *Req
OBJECT TO POST
{
     "name": "",
     "description": "",
     "studentID":"",
     "repoURL": "",
     "liveURL": "",
 }
 * */

//Temporaly input validator *************

const middlewareValidator = [
  check("name").exists().withMessage("Name is mandatory field!"),
  check("description").exists().withMessage("Name is mandatory field!"),
  check("studentID").exists().withMessage("Mandatory Student ID!"),
  check("repoURL").isURL().withMessage("Invalid URL, please check again"),
  check("liveURL").isURL().withMessage("Invalid URL, please check again"),
];
//GET all projects or filetred projects by query ?
router.get("/", async (req, res, next) => {
  try {
    const projects = await getProjects();

    if (req.query && req.query.name) {
      const filteredProjects = projects.filter(
        (s) => s.hasOwnProperty("name") && s.name === req.query.name
      );
      res.send(filteredProjects);
    } else {
      res.send(projects);
    }
  } catch (error) {
    console.log(
      "error in GET all projects or filtered by query, pasing it to errorHandling",
      error
    );
    next(error);
  }
});

//GET project by ===> id
router.get("/:id", async (req, res, next) => {
  try {
    const projects = await getProjects();
    const project = projects.find((project) => project.id === req.params.id);
    if (project) {
      res.send(project);
    } else {
      const err = new Error();
      err.frontEndMssg = "Project not found check id, please";
      err.statusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log("error in GET by id, pasing it to errorHandling" + error);
    next(error);
  }
});
//POST new project
router.post("/", middlewareValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error();
      err.errorList = errors;
      err.statusCode = 400;
      next("error in POST, pasing it to errorHandling", err); // passing error to errorHandling
    } else {
      const projects = await getProjects();
      const newProject = { ...req.body, id: uniqid(), createdAt: new Date() }; //New Student && adding unique id for student && ceratedDate
      projects.push(newProject);
      await writeProjects(projects);
      res.status(201).send({ id: newProject.id });
    }
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
});
//PUT edit project
router.put("/:id", async (req, res, next) => {
  try {
    const projects = await getProjects();
    const newProjectsArray = projects.filter(
      (project) => project.id !== req.params.id
    ); // filtering out the specific project object
    const projectModified = {
      ...req.body,
      id: req.params.id,
      lastModified: new Date(),
    }; // saving Projects.id && adding field lastModified
    newProjectsArray.push(projectModified);
    await writeProjects(newProjectsArray);
    send(projectModified); // if i send like this res.status(204).send(studentModified); status code always will omit the thing passed to send(string || object)
  } catch (error) {
    console.log("error in PUT project, pasing it to errorHandling" + error);
    next(error);
  }
});
//DELETE project
router.delete("/:id", async (req, res, next) => {
  // need another condition to avoid FRONTEND send id that doesn't exist.
  try {
    const projects = await getProjects();
    const newProjectsArray = projects.filter(
      (project) => project.id !== req.params.id
    );
    if (projects.length === newProjectsArray.length) {
      const err = new Error();
      err.frontEndMssg = "This id/project doesn't exist";
      err.statusCode = 404;
      next(err);
    } else {
      await writeProjects(newProjectsArray);
      res.status(204).send({ mssg: "Project Deleted" });
    }
  } catch (error) {
    console.log("error in DELETE project, pasing it to errorHandling" + error);
    next(error);
  }
});

export default router;
