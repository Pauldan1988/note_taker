const express = require('express');
const path = require('path');
const fs = require('fs')
const PORT = process.env.PORT || 3001;
const uniqueId = require("uniqid")
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for feedback page
app.get('/api/notes', (req, res) =>
  fs.readFile("./db/db.json", "UTF-8", (err,data)=>{
    res.send(data)
  })
);

app.post('/api/notes', (req, res) =>
  fs.readFile("./db/db.json", "UTF-8", (err,data)=>{
    let notes = JSON.parse(data)
    notes.push({title:req.body.title, text:req.body.text, id:uniqueId()})
    fs.writeFile("./db/db.json", JSON.stringify(notes),(error) =>{
      res.json(req.body)
    })
  })
);

app.delete('/api/notes/:id', (req, res) =>
  fs.readFile("./db/db.json", "UTF-8", (err,data)=>{
    console.log(uniqueId())
    let notes = JSON.parse(data)
    let filteredNotes = notes.filter(note => note.id !== req.params.id)
    fs.writeFile("./db/db.json", JSON.stringify(filteredNotes),(error) =>{
      res.json(req.body)
    })
  })
);
// Wildcard route to direct users to a 404 page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);