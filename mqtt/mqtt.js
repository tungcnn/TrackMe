const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const randomCoordinates = require('random-coordinates');
const rand = require('random-int');

mongoose.connect('mongodb+srv://tungnguyen:21011998@sit209-gzop8.mongodb.net/test');
const Device = require('./models/device');
const app = express();

const port = 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


const client = mqtt.connect('mqtt://soldier.cloudmqtt.com:18773', {
    username: 'mszpvnso',
    password: 'y3xXRdn5qLdJ',
});

client.on('connect', () => {
    console.log('connected');
    client.subscribe('/sensorData');
});

client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
        const data = JSON.parse(message);
        Device.findOne({ "name": data.deviceId }, (err, device) => {
            if (err) {
                console.log(err)
            }
            const { sensorData } = device;
            const { ts, loc, temp } = data;
            sensorData.push({ ts, loc, temp });
            device.sensorData = sensorData;
            device.save(err => {
                if (err) {
                    console.log(err)
                }
            });
        });
    }
});

/**
* @api {post} /send-command Send new command
* @apiGroup Sensor Data
* @apiSuccessExample {json} Success-Response:
* "Published new message"
* @apiErrorExample {json} Error-Response:
* {
* "Failed to publish message"
* }
*/

app.post('/send-command', (req, res) => {
    const { deviceId, command } = req.body;
    const topic = `/command/${deviceId}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    });
});

/**
* @api {put} /sensorData Put new sensor Data
* @apiGroup Sensor Data
* @apiSuccessExample {json} Success-Response:
* "Published new message"
* @apiErrorExample {json} Error-Response:
* {
* "Failed to publish message"
* }
*/

app.put('/sensor-data', (req, res) => {
    const { deviceId } = req.body;
    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    const temp = rand(20, 50);
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });
    client.publish(topic, message, () => {
        res.send('published new message');
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});