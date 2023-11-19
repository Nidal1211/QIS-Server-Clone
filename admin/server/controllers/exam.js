import { db } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { createExams } from "../functions/exam.js";

const addExam = (req, res) => {
  const id = uuidv4();
  const { title, pruefer, pruefungensnr, studiengangId } = req.body;
  const parentId = req.body.parentId || null;
  const raum = req.body.raum || null;
  const semester = req.body.semester || null;
  const datum = req.body.datum || null;
  const beginn = req.body.beginn || null;
  const ende = req.body.ende || null;
  const ruecktrittbis = req.body.ruecktrittbis || null;
  const credit_point = req.body.credit_point || null;
  const sqlQuery = `INSERT INTO Pruefungen(id,parentId,title,datum,beginn,ende,pruefer,semester,pruefungensnr,studiengangId,raum,ruecktrittbis,credit_point) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  let queryParams = [
    id,
    parentId,
    title,
    datum,
    beginn,
    ende,
    pruefer,
    semester,
    pruefungensnr,
    studiengangId,
    raum,
    ruecktrittbis,
    credit_point,
  ];

  db.query(sqlQuery, queryParams, (err, data) => {
    if (err) return res.status(500).send(err);
    if (data) {
      res.send({ success: true, message: "exam created" });
    }
  });
};
const getExams = (req, res) => {
  const sqlQuery = `SELECT * FROM Pruefungen`;

  db.query(sqlQuery, (err, data) => {
    if (err) return res.status(500).send(err);
    if (data) {
      const examList = createExams(data);
      res.status(200).json({
        success: true,
        message: "examList get request successfull",
        examList,
      });
    }
  });
};

const deleteExamById = (req, res) => {
  const id = req.params.id;
  const sqlQuery = `delete from Pruefungen WHERE id="${id}" `;
  db.query(sqlQuery, (err, data) => {
    if (err) return res.status(500).send(err);
    if (data) {
      res.status(200).json({
        success: true,
        message: "exam deleted successfull",
      });
    }
  });
};
const getExamById = (req, res) => {
  const id = req.params.id;
  const sqlQuery = `SELECT * FROM Pruefungen WHERE id="${id}" `;
  db.query(sqlQuery, (err, data) => {
    if (err) return res.status(500).send(err);
    if (data) {
      res.status(200).json({
        success: true,
        message: "exam get successfull",
        exam: data[0],
      });
    }
  });
};
export { addExam, getExams, deleteExamById, getExamById };
