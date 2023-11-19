CREATE TABLE NotenSpiegel (
    id VARCHAR(100) PRIMARY KEY NOT NULL,
    studentId VARCHAR(100),    
    pruefungsId VARCHAR(100),
    bewertung VARCHAR(50),
    status VARCHAR(50),
    vermerk VARCHAR(50),
    versuch int,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (studentId) REFERENCES Studenten(id) ON DELETE CASCADE,
    FOREIGN KEY (pruefungsId) REFERENCES Pruefungen(id) ON DELETE CASCADE

    );
