const express = require('express');
const router = express.Router();

module.exports = (db) => {

  // creating a question for the quiz

  router.get('/:questionid', (req, res) => {
    db.query(`SELECT question FROM questions WHERE id = $1;`, [req.params.questionid])
      .then(data => {
        let question = data.rows[0].question;
        let templateVars = { question_id: req.params.questionid, question };
        res.render('../views/questions', templateVars);
      });
  });
}
