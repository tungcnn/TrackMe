const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');


mongoose.connect('mongodb+srv://tungnguyen:21011998@sit209-gzop8.mongodb.net/test', { useNewUrlParser: true }); /*process.env.MONGO_URL, { useNewUrlParser: true }**/
const Device = require('./models/device');
const User = require('./models/user');
const verify = require('./verifyToken');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5000;

app.use(function (req, res, next) {
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
app.get('/api/test', (req, res) => {
    res.send('The API is working!');
});

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
app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(devices);
        }
    });
});

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

app.use(express.static(`${__dirname}/public`));


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

app.post('/api/authenticate', (req, res) => {
    const { user, password } = req.body;
    console.log(req.body)
    User.find({ username: user, password: password }, (err, result) => {
        if (err) {
            return res.send(err);
        } else {
            if (result.length < 1) {
                return res.send('Wrong user name or password');
            } else {
                try {
                    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
                    return res.json({
                        success: true,
                        token: token
                    });
                } catch (err) {
                    return res.send(err);
                }
            }
        }
    })
});

app.post('/api/registration', (req, res) => {
    const { user, password,
        // isAdmin 
    } = req.body;
    User.find({ username: user }, (err, result) => {
        if (err) {
            return res.send(err);
        } else {
            if (result.length > 0) {
                return res.send('User already existed');
            }
            else {
                const newUser = new User({
                    username: user,
                    password,
                    // isAdmin
                });
                newUser.save(err => {
                    return err
                        ? res.send(err)
                        : res.json({
                            success: true,
                            message: 'Created new user'
                        });
                });
            }
        }
    })
});

// --------- Authorization Middleware ---------
app.use(function (req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
});

app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const { deviceId } = req.params;
    Device.findOne({ "_id": deviceId }, (err, devices) => {
        const { sensorData } = devices;
        return err
            ? res.send(err)
            : res.send(sensorData);
    });
});

app.get('/api/users/:user/devices', (req, res) => {
    const { user } = req.params;
    Device.find({ "user": user }, (err, devices) => {
        return err
            ? res.send(err)
            : res.send(devices);
    });
});

app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
})