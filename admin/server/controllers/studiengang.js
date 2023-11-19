import { db } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const addStudiengang = (req, res) => {
  const { title } = req.body;
  const id = uuidv4();

  const sqlQuery = `INSERT INTO Studiengang(id,title) VALUES(?,?)`;

  let queryParams = [id, title];

  db.query(sqlQuery, queryParams, (err, data) => {
    if (err) return res.status(500).send(err);
    if (data) {
      res.send({ success: true, message: "Studiengang created" });
    }
  });
};

const getStudiengang = (req, res) => {
  const sqlQuery = `SELECT * FROM Studiengang`;

  db.query(sqlQuery, (err, data) => {
    if (err) return res.status(500).send(err);
    if (data) {
      res.send({
        success: true,
        message: "StudiengangList get succussfull",
        studiengangList: data,
      });
    }
  });
};

const deleteStudiengangById = (req, res) => {
  const id = req.params.id;
  const sqlQuery = `delete from Studiengang WHERE id="${id}" `;
  db.query(sqlQuery, (err, data) => {
    if (err) return res.status(500).send(err);
    if (data) {
      res.status(200).json({
        success: true,
        message: "student deleted successfull",
      });
    }
  });
};
export { addStudiengang, getStudiengang, deleteStudiengangById };
