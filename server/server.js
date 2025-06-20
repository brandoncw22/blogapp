//Express setup
const express = require('express');
const app = express();
const path = require('path');
const PORT = 3030;

//Serves uploaded files to front end
app.use('/storage', express.static(path.join(__dirname, 'storage')));

//Multer Setup
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage/');
    },
    filename: (req, file, cb) => {
        const postID = req.body.postID;
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        const finalName = `thumbnail_post${postID}${ext}`;
        cb(null, finalName);
    }
});
const upload = multer({ storage });

//Setting up the db and the tables
const sqlite = require('sqlite3').verbose();


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
console.log("Table POSTS created.")

//Post specific handling
app.get('/loadPosts', (req, res) =>{

});
app.post('/createPost', express.json(), (req, res) =>{
    const {title, content} = req.body;

    const sql = `INSERT INTO posts (title, content) VALUES (?, ?)`;

    db.run(sql, [title, content], function(err) {
        if (err) return console.error(err.message);
        const postID = this.lastID;
        //Sends the postID back to frontend
        res.status(200).json({postID});
    });
});

app.post('/thumbnailUpload', upload.single('thumbnail'), (req, res) => {
    res.json({message: 'Thumbnail uploaded'});
})
//

app.listen(PORT, console.log(`Server running on http://localhost:${PORT}`));