// Route for inserting a new quiz into the database

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    res.render("getquiz")
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
  });
  return router;
};
