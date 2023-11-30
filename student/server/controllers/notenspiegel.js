import { db } from "../config/db.js";
import { createNotenspiegel } from "../functions/notenspiegel.js";

const getNotenspiegel = (req, res) => {
  const sqlQuery = `
  SELECT *
  FROM Notenspiegel n
  WHERE studentId ='${req.student.id}'
  ORDER BY pruefungsId ASC, versuch ASC;
  `;
  db.query(sqlQuery, (err, data) => {
    if (err) return res.status(500).json(err); // 500: internel server error
    if (data.length) {
      const notenspiegelList = createNotenspiegel(data);

      return res.status(200).json({
        success: true,
        notenspiegel: notenspiegelList,
      });
    } else {
      return res.json({
        success: false,
        message: "no records found",
        notenspiegel: [],
      });
    }
  });
};
export { getNotenspiegel };
