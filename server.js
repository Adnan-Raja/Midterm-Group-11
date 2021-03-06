// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// Body parser
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// parse application/json
app.use(bodyParser.json());

// Cookie session
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const allQuizRoutes = require("./routes/allquiz-router");
const createQuiz = require("./routes/createquiz-router");
const myquiz = require("./routes/myquiz-router");
const createQuizForm = require("./routes/createquiz_form-router");
const searchRoutes = require("./routes/searchresults");
const createQuestionForm = require("./routes/createquestion-router");
const goToQuizPage = require("./routes/gotoquizpage");
const goToResultsPage= require("./routes/gotoresultspage");
const getquiz = require("./routes/getquiz");

// Mount all resource route
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));

// Homepage receive all quiz routes
app.use("/", allQuizRoutes(db));

app.use("/getquiz", getquiz(db));

// Create Myquiz page
app.use("/myquiz", myquiz(db));

// Create quiz page
app.use("/createquiz", createQuiz(db));

// Create quiz post
app.use("/quiz", urlencodedParser, createQuizForm(db));

//Go To Quiz Page
app.use("/quizpage", goToQuizPage(db));

// Go To Results Page
app.use("/results", goToResultsPage())

// Create Search Results page
app.use("/searchresults", searchRoutes(db));

// Create question
app.use("/newquestion", urlencodedParser, createQuestionForm(db));

// Attempt quiz
//app.use("/quizattempt", urlencodedParser, quizattempt(db));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// User cookie session
app.get('/login/:id', (req, res) => {
  // cookie-session middleware
  req.session.user_id = req.params.id;
  // cookie-parser middleware
  res.cookie('user_id', req.params.id);
  // send the user somewhere
  res.redirect('/');
 });


