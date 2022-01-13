const express = require('express');
const router = express.Router();


module.exports = (db) => {

  // quiz in progress page, users can still add questions

  router.get('/:quizid', (req, res) => {
    db.query(``, [req.params.quizid])
      .then(data => {
        let templateVar = { input: data.rows }
        res.render('../views/quiz_in_prog', templateVar)
      });
  });

  // adding a question after creating the quiz

  router.get("/:quizid/questions", (req, res) => {
    req.session.quiz_id = req.params.quizid;
    db.query(``, [req.params.quizid])
    .then(data => {
      let templateVar = { quizId: req.params.quizid, user: data.rows[0] };
      res.render('../views/questions', templateVar);
    })
  })



  return router;
};
