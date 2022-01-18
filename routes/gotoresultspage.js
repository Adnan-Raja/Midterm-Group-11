const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get('/:id',(req,res)=> {
    db.query(`
    SELECT * from quiz_results WHERE id = $1`, [req.params.id]).then(query_result => {
      const result = query_result.rows[0];
      console.log(result);
      const templateVars = {result};
      res.render("resultspage", templateVars);

    })

  });

  return router;
 }
