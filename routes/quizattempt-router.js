// Route for inserting a new quiz into the database

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`
    SELECT questions.quiz_id as quizid, questions.question, questions.answer
    FROM questions
    JOIN quizzes ON quizzes.id=quiz_id
    JOIN users ON users.id=user_id
    WHERE users.id = $1;`, [req.session.user_id])
      .then((data) =>  {
        res.render('quizattempt', data);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/submit", async (req, res) => {
    console.log(req.body);
    let count = 0;
    let quiz_id;
    for (const id in req.body) {
      const result = await db.query(`
      SELECT * FROM questions
      WHERE id = $1`, [id])
      quiz_id = result.rows[0].quiz_id;
      const user_answer = req.body[id];
      const right_answer = result.rows[0].answer;
      if (user_answer === right_answer) {
        count += 1;
      }
    }
    const inserted = await db.query(`
    INSERT INTO quiz_results (quiz_id, user_id, results, time_completed) values ($1, $2, $3, $4) returning *`,
    [quiz_id, req.session.user_id, count, new Date()])
    console.log(inserted.rows);
    res.redirect(`/results/${inserted.rows[0].id}`)
  });

  // router.post("/public", (req, res) => {
  //   console.log("+++++", req.body)
  //   const public = req.body.public
  //   const quizid = parseInt(req.body.quizid)
  //   console.log("XXXXXXXXXXX+++++",public, quizid )
  //   db.query(`
  //     UPDATE quizzes set public = $1 WHERE id = $2 RETURNING *;`, [public, quizid])
  //     .then((data) =>  {
  //       console.log("DATA===========", data.rows)
  //       res.send({ quiz: data.rows[0] });
  //     })
  //     .catch(err => {
  //       console.log(err.message)
  //       res.status(500).json({ error: err.message });
  //     });
  // });

  return router;
};

