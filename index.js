const express = require('express');
const bodyParser = require('body-parser');
const { DateTime } = require("luxon");
const fetch = require('cross-fetch');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/wizards-never-die', (req, res) => {
  res.send('************* Wizards Never Die!');
});

/*
    Endpoint for communication with slack
    ToDo: slack verification from req header
*/
app.post('/slack/actions', (req, res) => {
    console.log(req.body.toJson());
  });

app.listen(port, () => {
  console.log(`Slack Bot listening on port ${port}`);
});
