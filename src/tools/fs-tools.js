import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

// tool for get all paths wherever folder, must import always this import { dirname, join } from "path"; only PARAMETER will be the new path stucture AS STRING that i want to join
// const thisFolderPath = (newPath) => {
//   join(dirname(fileURLToPath(import.meta.url)), newPath); // DOESN'T WORK error with string type in path
// };

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPathImgProjects = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/projects")



export const getCurrentFolderPath = currentFile => dirname(fileURLToPath(currentFile))

export const getStudents = async () =>
  await readJSON(join(dataFolderPath, "students.json"));
export const getProjects = async () =>
  await readJSON(join(dataFolderPath, "projects.json"));
export const writeStudents = async (content) =>
  await writeJSON(join(dataFolderPath, "students.json"), content);
export const writeProjects = async (content) =>
  await writeJSON(join(dataFolderPath, "projects.json"), content);

  export const writeProjectsPictures = async (fileName, content) => await writeFile(join(publicFolderPathImgProjects, fileName), content);
  export const readProjectsPictures = fileName => createReadStream(join(publicFolderPathImgProjects, fileName))

