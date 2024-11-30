const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());
const port = 3010;

let db;
(async () => {
  db = await open({
    filename: './BD4.1_CW/database.sqlite',
    driver: sqlite3.Database,
  });
})();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

async function fetchAllMovies() {
  const query = 'SELECT * from movies';
  let response = await db.all(query, []);
  return { movies: response };
}

app.get('/movies', async (req, res) => {
  const allMovies = await fetchAllMovies();
  res.status(200).json(allMovies);
});

// async function fetchMoviesByGenre(genre) {
//   const query = `Select * from movies where genre = '${genre}'`;
//   let response = await db.all(query, []);
//   return response;
// }

async function fetchMoviesByGenre(genre) {
  const query = `Select * from movies where genre = ?`;
  let response = await db.all(query, [genre]);
  return response;
}

app.get('/movies/genre/:genre', async (req, res) => {
  const genre = req.params.genre;
  const results = await fetchMoviesByGenre(genre);
  res.status(200).json({ movies: results });
});

async function fetchMovieById(id) {
  const query = 'Select * from movies where id = ?';
  let response = await db.all(query, [id]);
  return response;
}

app.get('/movies/details/:id', async (req, res) => {
  const id = parseFloat(req.params.id);
  const result = await fetchMovieById(id);
  res.status(200).json({ movie: result });
});

async function fetchMoviesByReleaseYear(year) {
  const query = 'select * from movies where release_year = ?';
  const result = await db.all(query, [year]);
  return result;
}

app.get('/movies/release-year/:year', async (req, res) => {
  let releaseYear = req.params['year'];
  const result = await fetchMoviesByReleaseYear(releaseYear);
  res.status(200).json({ movies: result });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
