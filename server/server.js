//Express setup
const express = require('express');
const app = express();
const PORT = 3030;

const sqlite = require('sqlite3').verbose();

//Setting up the db and the tables
const db = new sqlite.Database('./blogapp.db', (err) =>{
    if(err) return console.error(err.message);
    console.log('Connnected to DB')
});

db.run(`
    CREATE TABLE IF NOT EXISTS posts (
        postID INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        postDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `);


app.get('/loadPosts', (req, res) =>{

});

app.listen(PORT, console.log(`Server running on http://localhost:${PORT}`));