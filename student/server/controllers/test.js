const registerForExam = (req, res) => {
    const { pruefungsId, pruefungsdatum, pruefungsnr, pruefungstext, semester } = req.body;
    const id = uuidv4();
    const studentId = req.student.id;
  
    // Insert into Anmeldelisten table
    const anmeldelistenQuery = `INSERT INTO Anmeldelisten(id, studentId, pruefungsId, anmeldedatum) VALUES(?,?,?,CURRENT_TIMESTAMP)`;
    const anmeldelistenParams = [id, studentId, pruefungsId];
  
    db.query(anmeldelistenQuery, anmeldelistenParams, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err,
        });
      }
  
      // Insert into Notenspiegel table
      const notenspiegelQuery = `INSERT INTO Notenspiegel(id, studentId, pruefungsId, parentId, status) VALUES(?,?,?,?,?)`;
      const notenspiegelParams = [id, studentId, pruefungsId, null, 'angemeldet'];
  
      db.query(notenspiegelQuery, notenspiegelParams, (err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err,
          });
        }
  
        // Get the ID of the newly inserted row in Notenspiegel
        const insertedId = data.insertId;
  
        // Check if the student has registered for the exam in the past
        const checkPreviousRegistrationsQuery = `SELECT * FROM Notenspiegel WHERE studentId='${studentId}' AND pruefungsId='${pruefungsId}'`;
        db.query(checkPreviousRegistrationsQuery, (err, data) => {
          if (err) {
            return res.status(500).json({
              success: false,
              error: err,
            });
          }
  
          // If the student has registered before, update the parentId for nested structure
          if (data.length > 0) {
            const parentId = data[0].id;
  
            const updateParentIdQuery = `UPDATE Notenspiegel SET parentId=? WHERE id=?`;
            const updateParentIdParams = [parentId, insertedId];
  
            db.query(updateParentIdQuery, updateParentIdParams, (err, data) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  error: err,
                });
              }
  
              return res.status(201).json({
                success: true,
                message: 'Pruefung angemeldet',
              });
            });
          } else {
            return res.status(201).json({
              success: true,
              message: 'Pruefung angemeldet',
            });
          }
        });
      });
    });
  };
  