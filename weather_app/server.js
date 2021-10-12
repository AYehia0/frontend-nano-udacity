// Setup empty JS object to act as endpoint for all routes
projectData = {};
PORT = 8080;

// Require Express to run server and routes
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server

// GET : returns the existing data : weather, temp, and user feelings idk
app.get("/result", (req, res, err) => {
  try {
    // sending the data stored in the endpoint as projectData
    res.send(projectData);
  } catch (e) {
    res.send(e.message);
  }
});

app.post("/add", (req, res, err) => {
  try {
    // saving the data
    const resData = req.body;

    // if (!Object.keys(resData).includes("data"))
    // throw new Error("Invalid response type");

    //projectData.push(resData);
    projectData = resData;

    res.send({
      message: "Success",
      data: resData,
    });
  } catch (e) {
    res.send({
      message: e.message,
      data: "",
    });
  }
});

// Listening for requests
app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
