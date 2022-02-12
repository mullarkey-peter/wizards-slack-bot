const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('cross-fetch');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/wizards-never-die', (req, res) => {
  res.send('************* Wizards Never Die!');
});

/*
    Endpoint for communication with slack
*/
app.post('/wizards-never-die/schedule', function (req, res) {
    var apiUrl = `https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2021/league/00_full_schedule.json`
    let today = new Date();

    // Get full NBA schedule for the given year
    fetch(apiUrl).then((resp) => {
        return resp.json();
    }).then((data) => {
        var games = [];
        // Access the league schedule object
        for ( i in data.lscd) {
            // Access the array of games from the month schedule object
            for( j in data.lscd[i].mscd.g) {
                // Find all games where to wizards are the home team
                if(data.lscd[i].mscd.g[j].h.tn == 'Wizards') {
                    var gameTime = new Date(data.lscd[i].mscd.g[j].gdte);
                    if(gameTime >= today) {
                        var gameData = {
                            "date" : data.lscd[i].mscd.g[j].gdte,
                            "dayOfTheWeek" : getDayOfTheWeek(gameTime),
                            "opponent" : data.lscd[i].mscd.g[j].v.tn
                        };
                        games.push(gameData);
                    }
                }
            }
        }
        res.status(200).send(games);
    }).catch((error) => {
        console.log(error);
    });
  });

app.listen(port, () => {
  console.log(`Slack Bot listening on port ${port}`);
});

// Return the day of the week from a date object
function getDayOfTheWeek(date) {
    var k = date.getUTCDay();
    var weekDay;
    switch(k) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
    };
    return weekDay;
};
