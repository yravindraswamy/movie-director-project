const express = require("express");
const app = express();

app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
initializeDbAndPath = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log(`Server is Running At http://localhost:3000`);
    });
  } catch (e) {
    console.log(`DB Error Message: ${e.message}`);
  }
};

initializeDbAndPath();

const convertDbResponseToresponseObject = (eachMovie) => {
  return {
    movieId: eachMovie.movie_id,
    directorId: eachMovie.director_id,
    movieName: eachMovie.movie_name,
    leadActor: eachMovie.lead_actor,
  };
};

//GET Movies API
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `SELECT movie_name AS movieName FROM movie;`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

//Add Movie API
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieQuery = `
        INSERT INTO 
        movie (director_id,movie_name,lead_actor)
        VALUES(
            ${directorId},
            '${movieName}',
            '${leadActor}'
            );`;
  await db.run(addMovieQuery);
  response.send(`Movie Successfully Added`);
});

//GET particular Movie API
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
        SELECT * FROM movie WHERE movie_id = ${movieId};
    `;
  const dbResponse = await db.get(getMovieQuery);
  response.send({
    movieId: dbResponse["movie_id"],
    directorId: dbResponse["director_id"],
    movieName: dbResponse["movieName"],
    leadActor: dbResponse["lead_actor"],
  });
});

//Update Movie API
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const updateMovieQuery = `
        UPDATE movie
        SET 
        director_id= ${directorId},
        movie_name = ${movieName},
        lead_actor = ${leadActor};
    `;
  response.send(`Movie Details Updated`);
});

//Delete Movie API
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
        DELETE FROM movie WHERE movie_id = ${movieId};
    `;
  await db.run(deleteMovieQuery);
  response.send(`Movie Removed`);
});

//GET Directors API
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
        SELECT 
        director_id AS directorId,
        director_name AS directorName
        FROM director
    ;`;
  const dbResponse = await db.all(getDirectorsQuery);
  response.send(dbResponse);
});

//GET Movies of Director API
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMoviesQuery = `
        SELECT 
        movie_name AS movieName 
        FROM movie
        WHERE director_id = ${directorId};
    `;
  const movie = await db.get(getMoviesQuery);
  response.send(movie);
});

// const express = require("express");

// const app = express();
// module.exports = app;
// app.use(express.json());
// const path = require("path");

// const { open } = require("sqlite");
// const sqlite3 = require("sqlite3");

// const dbPath = path.join(__dirname, "moviesData.db");

// let db = null;

// const initializeDbAndServer = async () => {
//   try {
//     db = await open({
//       filename: dbPath,
//       driver: sqlite3.Database,
//     });
//     app.listen(3000, () => {
//       console.log(`Server is Running at http://localhost:3000/`);
//     });
//   } catch (e) {
//     console.log(`DB Error :${e.message}`);
//     process.exit(1);
//   }
// };

// initializeDbAndServer();

// const getMovieName = (eachMovie) => ({ movieName: eachMovie.movie_name });

// //1 API movies
// app.get("/movies/", async (request, response) => {
//   const getMovieQuery = `SELECT * FROM movie;`;
//   const dbResponse = await db.all(getMovieQuery);
//   response.send(dbResponse.map((eachMovie) => getMovieName(eachMovie)));
// });

// //2 API for create movie
// app.post("/movies/", async (request, response) => {
//   const { directorId, movieName, leadActor } = request.body;
//   const addMovieQuery = `INSERT INTO movie(director_id,movie_name,lead_actor)
//     VALUES
//     (
//         ${directorId},
//         '${movieName}',
//         '${leadActor}'
//     );`;
//   await db.run(addMovieQuery);
//   response.send(`Movie Successfully Added`);
// });

// //3 API for movie
// app.get("/movies/:movieId/", async (request, response) => {
//   const { movieId } = request.params;
//   const getMovieQuery = `
//     SELECT * FROM
//     movie
//     WHERE
//         movie_id = ${movieId};`;
//   const dbResponse = await db.get(getMovieQuery);
//   response.send({
//     movieId: dbResponse["movie_id"],
//     directorId: dbResponse["director_id"],
//     movieName: dbResponse["movie_name"],
//     leadActor: dbResponse["lead_actor"],
//   });
// });

// //4 API update movieTable
// app.put("/movies/:movieId/", async (request, response) => {
//   const { movieId } = request.params;
//   const { directorId, movieName, leadActor } = request.body;
//   const updateTableQuery = `UPDATE movie SET
//     director_id = ${directorId},
//     movie_name = '${movieName}',
//     lead_actor = '${leadActor}'
//     WHERE movie_id = ${movieId};`;
//   const dbResponse = await db.run(updateTableQuery);
//   response.send(`Movie Details Updated`);
// });

// //5 API for delete movie
// app.delete("/movies/:movieId/", async (request, response) => {
//   const { movieId } = request.params;
//   const deleteMovieQuery = `DELETE FROM movie WHERE movie_id = ${movieId};`;
//   await db.run(deleteMovieQuery);
//   response.send(`Movie Removed`);
// });

// const getDirectorIdAndName = (director) => ({
//   directorId: director.director_id,
//   directorName: director.director_name,
// });

// //6 API for get directors
// app.get("/directors/", async (request, response) => {
//   const getDirectorsQuery = `SELECT * FROM director;`;
//   const dbResponse = await db.all(getDirectorsQuery);
//   response.send(dbResponse.map((director) => getDirectorIdAndName(director)));
// });

// //7 API for get movies related to director
// app.get("/directors/:directorId/movies/", async (request, response) => {
//   const { directorId } = request.params;
//   const getMoviesQuery = `SELECT movie_name AS movieName from movie WHERE director_id = ${directorId};`;
//   const dbResponse = await db.all(getMoviesQuery);
//   response.send(dbResponse);
// });
module.exports = app;
