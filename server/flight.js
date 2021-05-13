

exports.setupApp = app => {

    // =================================================================================
    // Setup 
    // =================================================================================

    // set up dependencies: these modules export functions that can then be called below
    // package for responding to requests for a specific URL
    const express = require('express');
    // package for logging attempts to access the server (for easier debugging)
    const morgan = require('morgan');
    // package that replicates fetch functionality built into the browser
    const fetch = require('node-fetch');
    // package that bundles up query parameters given as an Object into URL syntax
    const querystring = require('querystring');
    // package that allows certain URLs to access the server
    const cors = require('cors');
    const { json } = require('express');

    // set up server specific configuration values
    const { FLIGHT_API } = require('./secrets');

    //---------------------------------------------------------------------
    // utility functions

    function buildSkyscannerEndpoint(parameters, optionalParameters){
        let endpoint = FLIGHT_API.URL + Object.values(parameters).join("/") + "?" + Object.values(optionalParameters);
        return endpoint;
    }

    // access Hotels.com API to get hotel data
    // NOTE: add parameters later, focus on getting it to work first 
    async function fetchFlightData(origin, destination, departureDate, returnDate) {
        // set up query parameters needed to get interesting data
        const parameters = {
            // country user is in 
            country: "US", 
            // currency to return prices in 
            currency: "USD", 
            // locale you want results in (ISO Locale)
            locale: "en-US", 
            // origin 
            originplace: origin,
            // destination 
            destinationplace: destination, 
            // outbound date (YYYY-MM-DD, YY-MM, or "anytime")
            outboundpartialdate: departureDate,
        };
        // Note: inbound date is optional for the api, but NOT for this application
        const optionalParameters = {
            inboundpartialdate: returnDate,
        }
        const headers = {
            headers: {
                // send token 
                "x-rapidapi-key": FLIGHT_API.TOKEN,
                "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                "useQueryString": true
            }
        }

        let flightUrl = buildSkyscannerEndpoint(parameters, optionalParameters);

        // let testURL = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/RDU-sky/JFK-sky/2021-06-01?inboundpartialdate=2021-06-10"

        const response = await fetch(flightUrl, headers);
        const jsonData = await response.json();

        if (jsonData.Quotes?.length > 0) {
            // return just the fields needed by frontend 
            return jsonData;
        }
        // report no 
        throw new Error(`Hotel API Error: no quotes were returned`);
    }

    // return the JSON data from Skyscanner API request 
    app.get(
        '/api/flight/flight_quotes',
        async (req, res, next) => {

            // define local variables for readability
            let origin = req.query.originplace;
            let destination = req.query.destinationplace;
            let departureDate = req.query.outboundpartialdate;
            let returnDate = req.query.inboundpartialdate;

            // make sure user selected the following: origin, destination,  departureDate, returnDate
            if (!(origin && destination && departureDate && returnDate)) {
                // create error object with useful message
                const err = new Error('Usage: please provide all necessary fields');
                // set status code to return with response
                err.status = 400;
                // forward error on to next middleware handler (the error handler defined below)
                next(err);
                return;
            }

            try {
                // use named query parameters to pass to our functions
                const flightData = await fetchFlightData(origin, destination, departureDate, returnDate);
                // everything is OK, so report back to browser
                res.status(200);
                res.json(flightData);
            } catch (error) {
                console.log(error);
                // create error object with useful message
                const err = new Error('Error: Check server --- Skyscanner API unavailable');
                // set status code to return with response
                err.status = 503;
                // forward error on to next middleware handler (the error handler defined below)
                next(err);
            }
        },
    );

}