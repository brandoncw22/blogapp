//Express setup
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const PORT = 3030;

app.use(cors());
app.use(express.json());
//Serves uploaded files to front end
app.use('/storage', express.static(path.join(__dirname, 'storage')));

//Multer Setup
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
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

console.log("Table POSTS created.");
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        userID INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )
    `);
console.log("Table USERS created.");

//Post specific handling
app.get('/loadPosts', (req, res) =>{
    const query = `SELECT postID, title as postTitle, content as postContent FROM posts`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Failed to load posts'});
        } else {
            console.log('Posts loaded');
            res.json(rows);
        }
        
    });
});
app.post('/createPost', express.json(), (req, res) =>{
    const {title, content} = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Post title is required' });
    }

    const sql = `INSERT INTO posts (title, content) VALUES (?, ?)`;

    db.run(sql, [title, content], function(err) {
        if (err) return console.error(err.message);
        const postID = this.lastID;
        console.log("Posted")
        //Sends the postID back to frontend
        res.status(200).json({postID});
    });
});

app.post('/thumbnailUpload', (req, res) => {
    upload.single('thumbnail')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }
        const {postID} = req.body;
        const file = req.file;
        const newFilename = `thumbnail_post${postID}.jpg`;
        const newPath = path.join('storage', newFilename);
        if (!req.body.postID) {
            return res.status(400).json({ error: 'Missing postID in form data' });
        }
        fs.rename(file.path, newPath, (renameErr) => {
        if (renameErr) {
            console.error('File rename error:', renameErr);
            return res.status(500).json({ error: 'Could not rename file' });
        }

        console.log(`Thumbnail saved as ${newFilename}`);
        res.status(200).json({ message: 'Thumbnail uploaded', filename: newFilename });
            
        });

        

    });

});
app.post('/deletePost', (req, res) => {
    const {id} = req.body;
    if (!id) {
        return res.status(400).json({ success: false, error: 'Post ID missing' });
    }
    const query = `DELETE FROM posts WHERE postID=?`;
    db.run(query, [id], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(909).json({success: false, error: 'Failed to delete from DB'});
        }
        const filePath = path.join(__dirname, 'storage', `thumbnail_post${id}.jpg`);
        fs.unlink(filePath, (fsErr) => {
            if (fsErr && fsErr.code !== 'ENOENT') { // ENOENT = file doesn't exist
                console.error(`Error deleting thumbnail:`, fsErr.message);
                return res.status(500).json({ success: false, error: 'DB deleted but failed to delete thumbnail' });
            }

            return res.status(200).json({ success: true, message: 'Post deleted successfully' });
        });
    });
    
});

app.post('/login', (req, res) => {
    const query = `SELECT * FROM users WHERE username = ?`;
    const {username, password} = req.body;

    db.get(query, [username], (err, user) => {
        if (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, error: 'Failed to login' });
        }

        if (!user) {
        // No user found
        return res.status(401).json({ success: false, error: 'User not found' });
        }

        if (user.password !== password) {
        // Incorrect password
        return res.status(401).json({ success: false, error: 'Incorrect password' });
        }

        // Successful login
        console.log(`User ${username} logged in successfully.`);
        return res.json({ success: true, username: user.username });
    });
});
//

app.listen(PORT, console.log(`Server running on http://localhost:${PORT}`));