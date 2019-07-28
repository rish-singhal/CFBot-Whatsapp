var express = require('express');
var app = express();
var request = require('request');
const bodyParser = require('body-parser');


const accountSid = process.env.SID;
const authToken = process.env.KEY;

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));


app.post('/incoming', (req, res) => {
    const twiml = new MessagingResponse();
    var base = 'https://codeforces.com/api/contest.list?gym=false';
    request(base, function (error, response, body) {
        body = JSON.parse(body)
        var i = 0;
        var str = "Upcoming Contests: \n\n";

        while (body["result"][i]["phase"] == "BEFORE") {
            str += body["result"][i]["name"] + "\n";
            totalSeconds = body["result"][i]["relativeTimeSeconds"];
            totalSeconds *= -1;
            hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            minutes = Math.floor(totalSeconds / 60);
            seconds = totalSeconds % 60;
            days = Math.floor(hours / 24);
            hours = hours % 24;
            str = str + "Time Left: " + days + " Days, " + hours + " Hrs , " + minutes + " Min, " + seconds + " s\n\n";
            i += 1;
        }
        var msg = twiml.message(str);
        res.writeHead(200, {
            'Content-Type': 'text/xml'
        });
        res.end(twiml.toString());
    });
});

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
});


var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});