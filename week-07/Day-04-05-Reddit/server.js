'use strict'

require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3000

app.use(express.static(__dirname));

app.use(express.json());

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/hello', (req, res) => {
  res.send('Hello')
})

app.get('/posts', (req, res) => {
  let sql = `SELECT * from posts`;
  conn.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    res.json({
      rows,
    });
  });
});

app.post('/posts', (req, res) => {
  let sql = `INSERT INTO posts (post_title, post_url, post_timestamp, post_score) VALUES ("${req.body.post_title}", "${req.body.post_url}", unix_timestamp(), "0");`;
  conn.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    sql = `SELECT * from posts WHERE post_id = ${rows.insertId}`;
    conn.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send();
        return;
      }
      res.json({
        rows,
      });
    });
  });
});

app.put('/posts/upvote', (req, res) => {
  let id = req.body.id;
  let sql = `UPDATE posts SET post_score = post_score + 1 WHERE post_id = ${id};`;
  conn.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    sql = `SELECT * from posts WHERE post_id = ${id};`;
    conn.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send();
        return;
      }
      res.json({
        rows,
      });
    });
  });
});

app.put('/posts/downvote', (req, res) => {
  let id = req.body.id;
  let sql = `UPDATE posts SET post_score = post_score - 1 WHERE post_id = ${id};`;
  conn.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    sql = `SELECT * from posts WHERE post_id = ${id};`;
    conn.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send();
        return;
      }
      res.json({
        rows,
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Dr. Frankenserver: "IT'S ALIVE on port:${PORT}"`);
});