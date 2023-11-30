import { db } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const insertInitialRecords = (exams, parentId, studentId, res) => {
  exams.forEach((exam) => {
    const { pruefungensnr, title, credit_point, id: pruefungsId } = exam;
    const id = uuidv4();
    const insertQuery = `
        INSERT INTO Notenspiegel
        (id, studentId, pruefungsId, parentId, pruefungsnr, pruefungstext, cp_to_achieve)
        VALUES
        (?, ?, ?, ?, ?, ?, ?);
            `;
    const insertValues = [
      id,
      studentId,
      pruefungsId,
      parentId || null,
      pruefungensnr,
      title,
      credit_point,
    ];
    db.query(insertQuery, insertValues, (insertErr, insertResult) => {
      if (insertErr) return res.status(500).send(insertErr);
    });

    if (exam.children && exam.children.length > 0) {
      // Recursively insert records for children
      insertInitialRecords(exam.children, id, studentId, res);
    }
  });
};
const insertExamRecord = (examToRegister, studentId, res) => {
  const {
    pruefungensnr,
    title,
    parentId,
    pruefer,
    datum,
    credit_point,
    id: examId,
    semester,
  } = examToRegister;
  const selectQuery = `SELECT id FROM Notenspiegel WHERE pruefungsId=? `;
  const selectParams = [parentId];
  const parsedDate = new Date(datum);
  const formattedDate = parsedDate.toISOString().slice(0, 10);

  db.query(selectQuery, selectParams, (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length) {
      const id = uuidv4();
      const newParentId = data[0].id;
      const insertQuery = `
      INSERT INTO Notenspiegel
      (id, studentId, pruefungsId, parentId, prueferId, pruefungsnr, pruefungstext, versuch, status, pruefungsdatum, cp_to_achieve,semester)
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);
      `;
      const insertValues = [
        id,
        studentId,
        examId,
        newParentId,
        pruefer,
        pruefungensnr,
        title,
        1,
        "angemeldet",
        formattedDate,
        credit_point,
        semester,
      ];
      db.query(insertQuery, insertValues, (err, data) => {
        if (err) res.status(500).send(err);
      });
    }
  });
};

const registerStudentForExam = (studentId, examsId, res) => {
  const anmeldelistenId = uuidv4();
  const sqlQuery = `INSERT INTO Anmeldelisten(id,studentId, pruefungsId, anmeldedatum) VALUES(?,?,?,CURRENT_TIMESTAMP)`;
  const queryParams = [anmeldelistenId, studentId, examsId];

  db.query(sqlQuery, queryParams, (err, data) => {
    if (err)
      return res.status(500).json({
        succuss: false,
        err,
      });
  });
};

const registerForExam = (req, res, next) => {
  const { initialdata, desiredExam } = req.body;
  const examToRegister = JSON.parse(desiredExam);
  const initialExamsDataDataArray = JSON.parse(initialdata);
  const studentId = req.student.id;

  // check if the student has regeistered for the first exam for the first time
  const sqlQuery = "SELECT * FROM Notenspiegel WHERE studentId=?";
  db.query(sqlQuery, [studentId], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
    if (data.length === 0) {
      db.beginTransaction((err) => {
        if (err) return res.status(500).send(err);
        // Insert initial records
        insertInitialRecords(initialExamsDataDataArray, null, studentId, res);

        // Insert record for the desired exam
        insertExamRecord(examToRegister, studentId, res);

        // Additional logic for registering the student for the desired exam
        registerStudentForExam(studentId, examToRegister.id, res);

        // Commit the transaction
        db.commit((commitErr) => {
          if (commitErr) {
            console.error(commitErr);
            return res.status(500).json({
              success: false,
              message: "Transaction Failed",
            });
          }
        });

        res.status(200).send({
          success: true,
          message: "Prüfung angemeldet",
        });
      });
    } else {
      //the student has already registred for an exam in the past
      //check how many time the student has registred for the exam
      const sqlQuery = `SELECT * FROM Notenspiegel WHERE studentId='${studentId}' AND pruefungsId='${examToRegister.id}'`;
      db.query(sqlQuery, (err, data) => {
        // if yes create Notenspiegel with versuch = versuch +1
        if (err) return res.status(500).send(err);
        if (data.length > 0) {
          const id = uuidv4();
          const versuch = data.length;
          const newVersuch = versuch + 1;
          const parsedDate = new Date(examToRegister.datum);
          const formattedDate = parsedDate.toISOString().slice(0, 10);
          const insertQuery = `
          INSERT INTO Notenspiegel
          (id, studentId, pruefungsId, parentId, prueferId, pruefungsnr, pruefungstext, versuch, status, pruefungsdatum, cp_to_achieve,semester)
          VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
          const insertValues = [
            id,
            studentId,
            examToRegister.id,
            data[0].parentId,
            examToRegister.pruefer,
            examToRegister.pruefungensnr,
            examToRegister.title,
            newVersuch,
            "angemeldet",
            formattedDate,
            examToRegister.credit_point,
            examToRegister.semester,
          ];

          db.query(insertQuery, insertValues, (err, data) => {
            if (err) return res.status(500).send(err);
            if (data) {
              const anmeldelistenId = uuidv4();
              const insertQuery = `INSERT INTO Anmeldelisten(id,studentId, pruefungsId, anmeldedatum) VALUES(?,?,?,CURRENT_TIMESTAMP)`;
              const queryParams = [
                anmeldelistenId,
                studentId,
                examToRegister.id,
              ];

              db.query(insertQuery, queryParams, (err, data) => {
                if (err) return res.status(500).send(err);
                if (data) {
                  return res.status(201).json({
                    succuss: true,
                    message: "pruefung angemeldet",
                  });
                }
              });
            }
          });
        } else {
          const parsedDate = new Date(examToRegister.datum);
          const formattedDate = parsedDate.toISOString().slice(0, 10);

          const sqlQuery =
            "SELECT id FROM Notenspiegel WHERE studentId = ? AND pruefungsId = ?";
          const sqlParams = [studentId, examToRegister.parentId];

          db.query(sqlQuery, sqlParams, (err, data) => {
            if (err)
              return res.status(500).json({
                succuss: false,
                err,
              });
            if (data.length) {
              const newParentId = data[0].id;
              const id = uuidv4();
              const versuch = 1;
              const insertQuery = `
              INSERT INTO Notenspiegel
              (id, studentId, pruefungsId, parentId, prueferId, pruefungsnr, pruefungstext, versuch, status, pruefungsdatum, cp_to_achieve, semester)
              VALUES
              (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
             `;
              const insertValues = [
                id,
                studentId,
                examToRegister.id,
                newParentId,
                examToRegister.pruefer,
                examToRegister.pruefungensnr,
                examToRegister.title,
                versuch,
                "angemeldet",
                formattedDate,
                examToRegister.credit_point,
                examToRegister.semester,
              ];
              db.query(insertQuery, insertValues, (err, data) => {
                if (err) return res.status(500).send(err);
                if (data) {
                  const anmeldelistenId = uuidv4();
                  const insertQuery = `INSERT INTO Anmeldelisten(id,studentId, pruefungsId, anmeldedatum) VALUES(?,?,?,CURRENT_TIMESTAMP)`;
                  const queryParams = [
                    anmeldelistenId,
                    studentId,
                    examToRegister.id,
                  ];

                  db.query(insertQuery, queryParams, (err, data) => {
                    if (err) return res.status(500).send(err);
                    if (data) {
                      return res.status(201).json({
                        succuss: true,
                        message: "pruefung angemeldet",
                      });
                    }
                  });
                }
              });
            } else {
              // handle new exams for new initial   data
              const selectQuery = `SELECT * FROM Pruefungen WHERE id=?`;
              const queryParams = [examToRegister.parentId];
              db.query(selectQuery, queryParams, (err, data) => {
                if (err) res.send(err);
                if (data.length) {
                  const parentId = data[0].parentId;
                  const examData = { ...data[0] };
                  const selectQuery = `SELECT * FROM Notenspiegel WHERE pruefungsId=? AND studentId=?`;
                  const queryParams = [parentId, studentId];
                  db.query(selectQuery, queryParams, (err, data) => {
                    if (err) res.status(500).send(err);

                    if (data) {
                      // insert records into Notenspiegel
                      const parentExamData = { ...data[0] };
                      const id = uuidv4();
                      const insertQuery = `INSERT INTO Notenspiegel(id, studentId, pruefungsId, parentId, pruefungsnr, pruefungstext,cp_to_achieve) VALUES(?,?,?,?,?,?,?)`;
                      const queryParams = [
                        id,
                        studentId,
                        examData.id,
                        parentExamData.id,
                        examData.pruefungensnr,
                        examData.title,
                        examData.credit_point,
                      ];
                      db.query(insertQuery, queryParams, (err, data) => {
                        if (err) res.send(err);
                        if (data) {
                          // register for the desired exam
                          const parsedDate = new Date(examToRegister.datum);
                          const formattedDate = parsedDate
                            .toISOString()
                            .slice(0, 10);
                          const newId = uuidv4();
                          const versuch = 1;
                          const insertQuery = `
                          INSERT INTO Notenspiegel
                          (id, studentId, pruefungsId, parentId, prueferId, pruefungsnr, pruefungstext, versuch, status, pruefungsdatum, cp_to_achieve,semester)
                          VALUES
                          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                        `;

                          const insertValues = [
                            newId,
                            studentId,
                            examToRegister.id,
                            id,
                            examToRegister.pruefer,
                            examToRegister.pruefungensnr,
                            examToRegister.title,
                            versuch,
                            "angemeldet",
                            formattedDate,
                            examToRegister.credit_point,
                            examToRegister.semester,
                          ];

                          db.query(insertQuery, insertValues, (err, data) => {
                            if (err) return res.status(500).send(err);
                            if (data) {
                              const anmeldelistenId = uuidv4();
                              const insertQuery = `INSERT INTO Anmeldelisten(id,studentId, pruefungsId, anmeldedatum) VALUES(?,?,?,CURRENT_TIMESTAMP)`;
                              const queryParams = [
                                anmeldelistenId,
                                studentId,
                                examToRegister.id,
                              ];

                              db.query(
                                insertQuery,
                                queryParams,
                                (err, data) => {
                                  if (err) return res.status(500).send(err);
                                  if (data) {
                                    return res.status(201).json({
                                      succuss: true,
                                      message: "pruefung angemeldet",
                                    });
                                  }
                                }
                              );
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

const cancelExam = (req, res) => {
  const examId = req.params.examId;
  const sqlQuery = `DELETE FROM Anmeldelisten WHERE pruefungsId="${examId}"`;
  db.query(sqlQuery, (err, data) => {
    if (err)
      return res.status(500).json({
        succuss: false,
        err,
      });
    if (data) {
      // todo: handle rücktritt fristen
      const sqlQuery = `
      UPDATE Notenspiegel SET vermerk='RT'  
      WHERE pruefungsId="${examId}"
      ORDER BY created_at DESC
      LIMIT 1`;
      db.query(sqlQuery, (err, data) => {
        if (err)
          return res.status(500).json({
            succuss: false,
            err,
          });
        if (data) {
          return res.status(200).json({
            succuss: true,
            message: "pruefung abgemeldet",
          });
        }
      });
    }
  });
};

const getAnmeldeListe = (req, res) => {
  const id = req.student.id;
  const sqlQuery = `
  SELECT an.*,
  p.title as pruefungstitle,
  p.pruefungensnr as Pruefungsnr,
  p.semester as semester,
  p.raum as raum,
  p.beginn as beginn,
  p.datum as datum, 
  p.ruecktrittbis as ruecktrittbis,
  pr.lastname as prueferLastname
  FROM Anmeldelisten an 
  LEFT JOIN Pruefungen p ON an.pruefungsId = p.id
  LEFT JOIN Professor pr ON pr.id = p.pruefer
  WHERE studentId="${id}"`;

  db.query(sqlQuery, (err, data) => {
    if (err) return res.status(500).send(err);

    if (data) {
      return res.status(201).json({
        succuss: true,
        anmeldeliste: data,
      });
    }
  });
};

export { registerForExam, getAnmeldeListe, cancelExam };
