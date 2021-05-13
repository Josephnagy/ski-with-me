
/*
 * This represents the server for my final project 
 *
 *
 * @author Joseph Nagy
 */

// =================================================================================
// Setup 
// =================================================================================

// set up dependencies: these modules export functions that can then be called below
// package for responding to requests for a specific URL
const express = require('express');
// package for logging attempts to access the server (for easier debugging)
const morgan = require('morgan');
const morganBody = require('morgan-body');
// package that replicates fetch functionality built into the browser
const fetch = require('node-fetch');
// package that bundles up query parameters given as an Object into URL syntax
const querystring = require('querystring');
const { json } = require('express');

// connect to data store 
const dataStore = require('./DataStore.js');

// allow code to be run locally or when deployed on a remote host
const PORT = process.env.PORT || 3000;

// make a generic server and start listening for requests
const app = express();

// parse JSON data sent to URL requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//---------------------------------------------------------------------
// set up middleware apps that manage "all" URL requests
// log all requests made to the server
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());
morganBody(app, {
    logRequestBody: true,
    logAllReqHeader: true,
    logResponseBody: true,
    logAllResHeader: true,
});

// set up authentication
const auth = require('./authentication.js');
auth.setupAuthentication(app);

// setup CORS options for maximum security
// const whitelist = ['https://compsci290_2021spring.dukecs.io', 'http://localhost:8080'];
// const corsOptions = {
//     origin: (origin, callback) => {
//         // only allow sites listed above or dev-server proxies to access server data
//         if (whitelist.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             const err = new Error('CORS Error: This site is not authorized to access this resource.');
//             err.status = 401;
//             callback(err);
//         }
//     },
// };
// allow connections from anywhere
// app.use(cors());
// app.use(cors(corsOptions));

//---------------------------------------------------------------------
// utility functions

// middleware that reports error if not enough data given
function validateUserData(parts, property) {
    return (req, res, next) => {
        parts.forEach(p => {
            // error, break typical middleware "chain" and allow error handler to be next handler 
            if (req[property][p] === undefined) {
                res.status(400);
                return next(new Error(`Usage: please provide value for expected parameter ${p}`));
            }
        });
        // everything OK, continue to the next request handler
        next();
    }
}

// =================================================================================
// Users
// =================================================================================

// hard coded set of admin users (BOTH remote and local)
const adminEmailAddresses = ['nagyjoseph9@gmail.com', 'fake_alice@cs.duke.edu', 'dquan@cs.duke.edu', 'rcd@cs.duke.edu'];

function extractUserId(req) {
    return req.user?.id || '<none>';
}

// API for getting information on the logged in user
app.get(
    '/api/user',
    (req, res) => {
        // extract out the useful parts of the req.user object
        const id = extractUserId(req);
        const email = req.user?.emails ? req.user.emails[0].value : null;
        res.status(200);
        res.json({
            id,
            displayName: req.user?.displayName,
            email,
            isAdmin: adminEmailAddresses.includes(email),
            photo: req.user?.photos?.length >= 1 ? req.user.photos[0].value : null,
        });
    },
);

// API to add user to DB
app.put(
    '/api/db/addUser',
    // check parameters from the user to make sure they are all included
    // validateUserData(['id', 'title'], 'body'),
    // can now assume complete user data, so do the work to change data structure
    async (req, res, next) => {
        try {
            // declare local variables for code readability
            let user = req.body.user;
            await dataStore.addUserToDatabase(user);
            res.status(200);
        } catch (error) {
            console.log(error);
            // create error object with useful message
            const err = new Error('Error: Check server --- unable to add user to DB ');
            // set status code to return with response
            err.status = 503;
            // forward error on to next middleware handler (the error handler defined below)
            next(err);
        }
    },
);

// API to get all data in DB 
app.get(
    '/api/db/get_all_data',
    async (req, res) => {
        try {
            let allData = await dataStore.getAllData();
            res.status(200);
            res.json(allData);
        } catch(error) {
            console.log(error);
            // create error object with useful message
            const err = new Error('Error: Check server --- unable to get all data from firebase');
            // set status code to return with response
            err.status = 503;
            // forward error on to next middleware handler (the error handler defined below)
            next(err);
        }
    },
);

// API to get all User data in DB 
app.get(
    '/api/db/get_all_user_data',
    async (req, res) => {
        try {
            let allData = await dataStore.getAllUserData();
            res.status(200);
            res.json(allData);
        } catch (error) {
            console.log(error);
            // create error object with useful message
            const err = new Error('Error: Check server --- unable to get all data from firebase');
            // set status code to return with response
            err.status = 503;
            // forward error on to next middleware handler (the error handler defined below)
            next(err);
        }
    },
);

// API to check if a user exists in Firebase DB
app.get(
    '/api/db/checkUserExistence',
    async (req, res) => {
        try {
            let userExists = await dataStore.checkIfUserExists(req.query.email);
            res.status(200);
            // if user exists, returns userID, if not returns false
            res.json(userExists);
        } catch(error) {
            console.log(error);
            // create error object with useful message
            const err = new Error('Error: Check server --- unable to check user existence');
            // set status code to return with response
            err.status = 503;
            // forward error on to next middleware handler (the error handler defined below)
            next(err);
        }
        
    },
);

// API to get user trips from DB based on email
app.get(
    '/api/db/getUserTrips',
    async (req, res) => {
        try {
            let userTrips = await dataStore.getUserTrips(req.query.email);
            res.status(200);
            res.json(userTrips);
        } catch (error) {
            console.log(error);
            // create error object with useful message
            const err = new Error('Error: Check server --- unable to get user trips from Firebase');
            // set status code to return with response
            err.status = 503;
            // forward error on to next middleware handler (the error handler defined below)
            next(err);
        }
    },
);


// API to add trip to firebase DB 
app.put(
    '/api/trip/createTrip',
    // check parameters from the user to make sure they are all included
    // validateUserData(['id', 'title'], 'body'),
    // can now assume complete user data, so do the work to change data structure
    async (req, res, next) => {
        // declare local variables for code readability
        let userId = req.body.userId;
        let tripName = req.body.tripName;
        let startDate = req.body.startDate; 
        let endDate = req.body.endDate;
        await dataStore.createNewTrip(userId, tripName, startDate, endDate);
        res.status(200);
    },
);

// API to add mountain to user's trip in DB
app.put(
    '/api/db/addMountainToTrip',
    // check parameters from the user to make sure they are all included
    // validateUserData(['id', 'title'], 'body'),
    // can now assume complete user data, so do the work to change data structure
    async (req, res, next) => {
        try {
            // declare local variables for code readability
            let userId = req.body.userId;
            let trip = req.body.trip;
            let mountain = req.body.mountain;
            res.status(200);
            await dataStore.addMountainToTrip(userId, trip, mountain);
        } catch (error) {
            console.log(error);
            // create error object with useful message
            const err = new Error('Error: Check server --- unable to add mountain to users trip ');
            // set status code to return with response
            err.status = 503;
            // forward error on to next middleware handler (the error handler defined below)
            next(err);
        }
    },
);

// API to add hotel to user's trip in DB
app.put(
    '/api/db/addHotelToTrip',
    // check parameters from the user to make sure they are all included
    // validateUserData(['id', 'title'], 'body'),
    // can now assume complete user data, so do the work to change data structure
    async (req, res, next) => {
        try {
            // declare local variables for code readability
            let userId = req.body.userId;
            let trip = req.body.trip;
            let hotel = req.body.hotel;
            res.status(200);
            await dataStore.addHotelToTrip(userId, trip, hotel);
        } catch (error) {
            console.log(error);
            // create error object with useful message
            const err = new Error('Error: Check server --- unable to add mountain to users trip ');
            // set status code to return with response
            err.status = 503;
            // forward error on to next middleware handler (the error handler defined below)
            next(err);
        }
    },
);


// API to test storing in firebase DB
app.put(
    '/api/testUserData',
    // check parameters from the user to make sure they are all included
    // validateUserData(['id', 'title'], 'body'),
    // can now assume complete user data, so do the work to change data structure
    async (req, res, next) => {
        await dataStore.testInput(req.body.testInput);
        res.status(200);
    },
);

// =================================================================================
// Mountain Data
// =================================================================================
const mountain = require("./mountain.js");
mountain.setupApp(app);
 
// =================================================================================
// Hotel Data
// =================================================================================
const hotel = require("./hotel.js");
hotel.setupApp(app);

// =================================================================================
// Flight Data
// =================================================================================
const flight = require("./flight.js");
flight.setupApp(app);


// handle errors thrown by the application code
// NOTE, this actually must be defined LAST in order to catch any errors from others
app.use((err, req, res, next) => {
    console.log(err);
    // delegate to default Express error handler if HTTP header info has already been sent back
    if (res.headersSent) {
        next(err);
        return;
    }
    // set error status and return error message as JSON
    // since that is what the frontend is expecting
    res.status(err.status || 500).json({ message: err.message });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));