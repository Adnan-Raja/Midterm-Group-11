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

  // the answers page where creators of a quiz can input 5 answers to a question

  router.get("/:quizid/questions/:questionid", (req, res) => {
    db.query(``, [req.params.questionid])
      .then(data => {
        let question = data.rows[0];
        let templateVars = { quiz_id: req.params.quizid, question_id: req.params.questionid, question };
        res.render('../views/answers', templateVars);
      });
  });



  return router;
};
