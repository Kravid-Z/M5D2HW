import express from "express";
import { check, validationResult } from "express-validator";
import uniqid from "uniqid";
import { getStudents, writeStudents } from "../tools/fs-tools.js";

const router = express.Router();

//Temporaly input validator *************

const middlewareValidator = [
  check("name").exists().withMessage("Name is mandatory field!"),
  check("surname").exists().withMessage("Name is mandatory field!"),
  check("age").isInt().withMessage("Age must be an integer!"),
  check("email").isEmail().withMessage("Invalid email, please check again"),
];
//GET all students or filetred students by query ?
router.get("/", async (req, res, next) => {
  try {
    const students = await getStudents();

    if (req.query && req.query.name) {
      const filteredStudents = students.filter(
        (s) => s.hasOwnProperty("name") && s.name === req.query.name
      );
      res.send(filteredStudents);
    } else {
      res.send(students);
    }
  } catch (error) {
    console.log(
      "error in GET all students or filtered by query, pasing it to errorHandling",
      error
    );
    next(error);
  }
});

//GET student by ===> id
router.get("/:id", async (req, res, next) => {
  try {
    const students = await getStudents();
    const student = students.find((student) => student.id === req.params.id);
    if (student) {
      res.send(student);
    } else {
      const err = new Error("User not found check id, please");
      err.statusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log("error in GET by id, pasing it to errorHandling" + error);
    next(error);
  }
});
//POST new student
router.post("/", middlewareValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error();
      err.errorList = errors;
      err.statusCode = 400;
      next("error in POST, pasing it to errorHandling", err); // passing error to errorHandling
    } else {
      const students = await getStudents();
      const newStudent = { ...req.body, id: uniqid(), createdAt: new Date() }; //New Student && adding unique id for student && ceratedDate
      students.push(newStudent);
      await writeStudents(students);
      res.status(201).send({ id: newStudent.id });
    }
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
});
//PUT edit student
router.put("/:id", async (req, res, next) => {
  try {
    const students = await getStudents();
    const newStudentsArray = students.filter(
      (student) => student.id !== req.params.id
    ); // filtering out the specific student object
    const studentModified = {
      ...req.body,
      id: req.params.id,
      lastModified: new Date(),
    }; // saving Student.id && adding field lastModified
    newStudentsArray.push(studentModified);
    await writeStudents(newStudentsArray);
    res.status(204).send();
  } catch (error) {
    console.log("error in PUT student, pasing it to errorHandling" + error);
    next(error);
  }
});
//DELETE student
router.delete("/:id", async (req, res, next) => {
  try {
    const students = await getStudents();
    const newStudentsArray = students.filter(
      (student) => student.id !== req.params.id
    );
    await writeStudents(newStudentsArray);
    res.status(204).send();
  } catch (error) {
    console.log("error in DELETE student, pasing it to errorHandling" + error);
    next(error);
  }
});

export default router;
