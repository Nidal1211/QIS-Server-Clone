CREATE TABLE Studenten (
    id VARCHAR(100) PRIMARY KEY NOT NULL,
    username VARCHAR(30) NOT NULL,
    firstname VARCHAR(30) NOT NULL,
    matrikelnummer VARCHAR(30) UNIQUE NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,   
    studiengangId VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
    FOREIGN KEY (studiengangId) REFERENCES Studiengang(id) ON DELETE SET NULL

    );
