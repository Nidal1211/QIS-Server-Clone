CREATE TABLE Anmeldelisten (
    id VARCHAR(100) PRIMARY KEY NOT NULL,
    studentId VARCHAR(100) ,    
    pruefungsId VARCHAR(100) ,
    versuch int NOT NULL,
    anmeldedatum  DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (studentId) REFERENCES Studenten(id) ON DELETE CASCADE,
    FOREIGN KEY (pruefungsId) REFERENCES Pruefungen(id) ON DELETE CASCADE
    );
