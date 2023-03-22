const express = require("express");

const app = express();

const PORT = process.env.PORT || 3001;

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

app.use(express.json());

const cors = require("cors");

require("dotenv/config");

// const auth = require("./routes/verify");

// const postDynamicChapterLs = require("./routes/postdynamicchapterls");
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// const postQuestion = require("./routes/postQuestion");
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// const postModule = require("./routes/postModule");
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// const postChapter = require("./routes/postChapter");
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

const getJobs = require("./routes/getJobs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const verifyByAdmin = require("./routes/verifyEmailByAdmin");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const verifyEmail = require("./routes/verifyEmail");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const register = require("./routes/register");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const login = require("./routes/login");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const postJob = require("./routes/postJob");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
// app.use("/getls", getls);
// app.use("/postUserProgress", postUserProgress);
// app.use("/getDynamicChapterQuestion", auth, getDynamicChapterQuestion);
// app.use("/postUnit", postUnit); // incomplete
// app.use("/postChapter", postChapter);
// app.use("/postModule", postModule);
app.use("/getJobs", getJobs);
app.use("/postJob", postJob);
app.use("/verifyJobPoster", verifyByAdmin);
app.use("/verify", verifyEmail);
app.use("/register", register);
app.use("/login", login);

//Routes:
app.get("/", (req, res) => {
  res.json({
    document: "Pb job portal",
  });
});

mongoose.set("strictQuery", false);

//Connect to db:
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB!");
  }
);

//Listen on port:
app.listen(PORT);
