const mongoose = require('mongoose');
const express = require('express');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const Device = require('./models/device');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/**
* @api {get} /api/test Test API
* @apiGroup API
* @apiSuccessExample {json} Success-Response:
    "The API is working"
* @apiErrorExample {json} Error-Response:
    "The API isn't working"
*/

/**
* @api {get} /api/devices All Devices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* [
    * {
        * "_id": "dsohsdohsdofhsofhosfhsofh",
        * "name": "Mary's iPhone",
        * "user": "mary",
        * "sensorData": [
                * {
                * "ts": "1529542230",
                * "temp": 12,
                * "loc": {
                    * "lat": -37.84674,
                    * "lon": 145.115113
                * }
            * },
            * {
                * "ts": "1529572230",
                * "temp": 17,
                * "loc": {
                    * "lat": -37.850026,
                    * "lon": 145.117683
                * }
            * }
        * ]
    * }
* ]
* @apiErrorExample {json} Error-Response:
* {
*    "User does not exist"
* }
*/

/**
* @api {post} /api/devices Upload a new device
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* {
    "Successfully added new device and data"
*  }
* @apiErrorExample {json} Error-Response:
* {
*    "Failed to post new device"
* }
*/


app.use(express.static(`${__dirname}/public`));

app.get('/api/test', (req, res) => {
    res.send('The API is working!');
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(devices);
        }
    });
});
app.post('/api/devices', (req, res) => {
    const { name, user, sensorData } = req.body;
    const newDevice = new Device({
        name,
        user,
        sensorData
    });
    newDevice.save(err => {
        return err
        ? res.send(err)
        : res.send('successfully added device and data');
    });
});

app.post('/api/send-command', (req, res) => {
    console.log(req = body);
});

app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

