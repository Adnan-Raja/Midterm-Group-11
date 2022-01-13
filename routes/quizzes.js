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


  return router;
};
