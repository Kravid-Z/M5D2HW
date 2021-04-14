import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const router = express.Router();

const currentFileName = fileURLToPath(import.meta.url); // getting current file path
const studentsJSONdataPath = join(dirname(currentFileName), "students.json"); // creating file path for students.json file with data persitance taking in account difenrent OS with diferent fs roots

//Explanation of fs (file system core module when work in machinestorage without database in cloud)
// const fileAsABuffer = fs.readFileSync(studentsJSONPath) // returns a buffer (machine readable, not human readable)
// const fileAsAString = fileAsABuffer.toString() // returns a string from a buffer
// const fileAsAJSON = JSON.parse(fileAsAString) // converts string into JSON

const students = JSON.parse(fs.readFileSync(studentsJSONdataPath).toString()); // simplified version

router.get("/", (req, res) => {
  res.send(students);
});
//Get student by ===> id
router.get("/:id", (req, res) => {
  const student = students.find((student) => student.id === req.params.id);
  res.send(student);
});

router.post("/", (req, res) => {
  const newStudent = req.body;
  newStudent.id = uniqid(); //adding unique id for student
  students.push(newStudent);
  fs.writeFileSync(studentsJSONdataPath, JSON.stringify(students));
  res.status(201).send(newStudent);
});

router.put("/:id", (req, res) => {
  const newStudentsArray = students.filter(
    (student) => student.id !== req.params.id
  ); // filtering out the specific student object

  const studentModified = req.body;
  studentModified.id = req.params.id; //saving student id
  students.push(studentModified);

  fs.writeFileSync(studentsJSONdataPath, JSON.stringify(newStudentsArray));
  res.status(204).send();
});

router.delete("/:id", (req, res) => {
  const newStudentsArray = students.filter(
    (student) => student.id !== req.params.id
  );
  fs.writeFileSync(studentsJSONdataPath, JSON.stringify(newStudentsArray));
  res.status(204).send();
});

export default router;
