import { db } from "../config/db.js";

const registerForExam = (req, res) => {
  const { pruefungsId } = req.body;
  const studentId = req.student.id;
  const sqlQuery = ` INSERT INTO Anmeldelisten(studentId, pruefungsId, anmeldedatum) VALUES(?,?, "CURRENT_TIMESTAMP")`;
  const queryParams = [studentId, pruefungsId];

  db.query(sqlQuery, queryParams, (err, data) => {
    if (err)
      return res.status(500).json({
        succuss: false,
        err,
      });
    if (data) {
      return res.status(201).json({
        succuss: true,
        message: "anmeldelist created",
      });
    }
  });
};

export { registerForExam };
