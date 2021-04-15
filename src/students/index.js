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

const writeChanges = (arr, item) => {
  try {
    if (item) {
      arr.push(item);
      fs.writeFileSync(studentsJSONdataPath, JSON.stringify(arr));
    } else{
      fs.writeFileSync(studentsJSONdataPath, JSON.stringify(arr));
    }
  } catch (error) {
    console.log("Probably you have an error with fs write method",error);
  }
};

router.get("/", (req, res) => {
  res.send(students);
});
//Get student by ===> id
router.get("/:id", (req, res) => {
  const student = students.find((student) => student.id === req.params.id);
  res.send(student);
});

router.post("/", (req, res) => {
  const newStudent = { ...req.body, id: uniqid(), createdAt: new Date() }; //New Student && adding unique id for student && ceratedDate
  writeChanges(students, newStudent);
  res.status(201).send(newStudent);
});

router.put("/:id", (req, res) => {
  const newStudentsArray = students.filter(
    (student) => student.id !== req.params.id
  ); // filtering out the specific student object

  const studentModified = {
    ...req.body,
    id: req.params.id,
    lastModified: new Date(),
  }; // saving Student.id && adding field lastModified

  writeChanges(newStudentsArray, studentModified);
  res.status(204).send();
});

router.delete("/:id", (req, res) => {
  const newStudentsArray = students.filter(
    (student) => student.id !== req.params.id
  );
  writeChanges(newStudentsArray);
  // fs.writeFileSync(studentsJSONdataPath, JSON.stringify(newStudentsArray));
  res.status(204).send();
});

export default router;
