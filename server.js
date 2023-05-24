const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const { exec } = require("child_process");

// Parse application/json
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Define API routes
app.post("/api/data", async (req, res) => {
  // Handle POST request for /api/data
  console.log(req.body.latitude, req.body.longitude);
  const requestUrl = `https://api.open-meteo.com/v1/forecast?latitude=${req.body.latitude}&longitude=${req.body.longitude}&hourly=relativehumidity_2m,windspeed_180m,winddirection_180m,temperature_80m&forecast_days=1`;

  await axios
    .get(requestUrl)
    .then((response) => {
      const forecastData = response.data;
      getProbability(3, 2);

      console.log(forecastData);
      res.json(forecastData);
    })
    .catch((error) => {
      console.error("Error retrieving forecast:", error);
      res.status(500).json({ error: "Error retrieving forecast" });
    });
});

app.post("/api/place", async (req, res) => {
  // Handle POST request for /api/data
  console.log(req.body.latitude, req.body.longitude);
  const requestUrl = `https://geocoding-api.open-meteo.com/v1/search?latitude=${req.body.latitude}&longitude=${req.body.longitude}&format=json`;

  await axios
    .get(requestUrl)
    .then((response) => {
      const place = response.data;
      console.log(place);
      res.json(place);
    })
    .catch((error) => {
      console.error("Error retrieving place:", error);
      res.status(500).json({ error: "Error retrieving place" });
    });
});

function getProbability(var1, var2) {
  exec(`python3 neiro/result.py ${var1} ${var2}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout.trim()}`);
  });
}

function getData(place) {}

// Start the server
const port = 3000; // Specify the port you want to use
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
