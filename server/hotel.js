

exports.setupApp = app => { 

    // =================================================================================
    // Setup 
    // =================================================================================

    // set up dependencies: these modules export functions that can then be called below

    // package that replicates fetch functionality built into the browser
    const fetch = require('node-fetch');
    // package that bundles up query parameters given as an Object into URL syntax
    const querystring = require('querystring');

    // connect to dataStore
    const dataStore = require('./DataStore.js');

    // set up server specific configuration values
    const { HOTEL_API } = require('./secrets');

    //---------------------------------------------------------------------
    // utility functions

    async function getJSON(url, apiAction, queryParameters, protocolOptions) {
        const parameters = queryParameters ? `?${querystring.stringify(queryParameters)}` : '';
        const urlWithParameters = `${url}${apiAction}${parameters}`;
        console.log('getJSON', urlWithParameters);
        const response = await fetch(urlWithParameters, { credentials: 'include', ...(protocolOptions || {}) });

        // only convert response if request suceeded
        if (response.ok) {
            return response.json();
        }

        // FIXME: probably a better way to handle this - return an empty data object
        console.error(response);
        return {};
    }

    // simple function to factor out common code from the API methods
    // async function getJSON(url, parameters, headers) {
    //     const response = await fetch(`${url}?${querystring.stringify(parameters)}`, headers);
    //     return response.json();
    // }

    // access Hotels.com API to get hotel data
    // NOTE: add parameters later, focus on getting it to work first 
    async function fetchHotelData(latitude, longitude, checkIn, checkOut) {
        // set up query parameters needed to get interesting data
        const parameters = {
            // specify locale
            locale: "en_US",
            // longitude in which searching for nearby hotels 
            longitude: longitude,
            // currency to return prices in 
            currency: "USD",
            // latitude in which searching for nearby hotels 
            latitude: latitude,
            // number of adults staying at hotel
            adults_number: 1,
            // check-in date (YYYY-MM-DD)
            checkin_date: checkIn,
            // check-out date (YYYY-MM-DD)
            checkout_date: checkOut,
            // sort order to return results (few options in the documentation)
            sort_order: "STAR_RATING_HIGHEST_FIRST"
        };
        // const headers = {
        //     headers: {
        //         // send token 
        //         "X-RapidAPI-Key": HOTEL_API.TOKEN
        //     }
        // }
        // fetch data from the API using the set parameters
        const jsonData = await getJSON(
            '',
            HOTEL_API.URL, 
            parameters, 
            {
                method: 'GET',
                headers: {
                    "X-RapidAPI-Key": HOTEL_API.TOKEN,
                },
            });
        // make sure results were returned
        if (jsonData.searchResults?.results?.length > 0) {
            // return just the fields needed by frontend 
            return jsonData.searchResults.results;
        }

        // report invalid API data returned (including NO images matching weather forecast)
        throw new Error(`Hotel API Error: ${jsonData.message}`);
    }

    //---------------------------------------------------------------------
    // compare functions for sorting 

    function compareHotelPrices(hotel1, hotel2) {
        if (hotel1.ratePlan.price.exactCurrent > hotel2.ratePlan.price.exactCurrent) return 1;
        if (hotel2.ratePlan.price.exactCurrent > hotel1.ratePlan.price.exactCurrent) return -1;
    }

    //---------------------------------------------------------------------
    // set up URL responses:
    // provide some response to visiting the server directly (i.e., its homepage)
    app.get(
        '/',
        (req, res) => {
            res.status(200);
            res.send('<a href="api/hotel/get_hotels">Get Hotel Data!</a>');
        },
    );

    app.get(
        '/api/hotel/single_hotel_data',
        async (req, res, next) => {
            try {
                // get mountain data from DB 
                let hotelKey = req.query.hotelKey;
                let hotelData = await dataStore.getSingleHotelData(hotelKey);

                res.status(200);
                res.json(hotelData);
            }
            catch (error) {
                // create error object with useful message
                console.log(error);
                const err = new Error('Error: unable to fetch single hotel data');
                // set status code to return with response
                err.status = 503;
                // forward error on to next middleware handler (the error handler defined below)
                next(err);
            }
        }
    );

    // return the JSON data resulting from remote API requests
    app.get(
        '/api/hotel/get_hotels',
        async (req, res, next) => {
            try {
                // use named query parameters to pass to our functions
                const hotelData = await fetchHotelData();
                // everything is OK, so report back to browser
                res.status(200);
                // define local variables for readability
                let sort = req.query.sort;
                // construct JSON object to return, must match what frontend is expecting
                // sort data if sorting method provided 
                if (req.query.sort) {
                    // sort by price: min -> max
                    if (sort === "2") {
                        res.json(hotelData.sort(compareHotelPrices));
                        // sort by price: max -> min
                    } else if (sort === "3") {
                        res.json(hotelData.sort(compareHotelPrices).reverse());
                        // no sorting
                    } else {
                        res.json(hotelData);
                    }
                } else {
                    res.json(hotelData);
                }
            } catch (error) {
                console.log(error);
                // create error object with useful message
                const err = new Error('Error: Check server --- one or more APIs are currently unavailable.');
                // set status code to return with response
                err.status = 503;
                // forward error on to next middleware handler (the error handler defined below)
                next(err);
            }
        },
    );

    // return the filtered JSON data resulting from remote API requests
    app.get(
        '/api/hotel/get_filtered_hotels',
        async (req, res, next) => {
            // define local variables for readability 
            let min = parseInt(req.query.min);
            let max = parseInt(req.query.max);
            let sort = req.query.sort; 
            let latitude = req.query.latitude; 
            let longitude = req.query.longitude; 
            let checkIn = req.query.checkIn; 
            let checkOut = req.query.checkOut;

            // without all needed fields, cannot do a proper filtered so report "user error"
            if (!(min && max && sort && latitude && longitude && checkIn && checkOut)) {
                // create error object with useful message
                const err = new Error('Usage: please provide all necessary query parameters');
                // set status code to return with response
                err.status = 400;
                // forward error on to next middleware handler (the error handler defined below)
                next(err);
                return;
            }

            try {
                // call helper function to get hotel data
                const hotelData = await fetchHotelData(latitude, longitude, checkIn, checkOut);
                console.log("hoteldata:");
                console.log(hotelData);
                // everything is OK, so report back to browser
                res.status(200);

                // filter JSON data based on hotel price 

                let filteredHotelData = hotelData.filter(hotel => hotel.ratePlan.price.exactCurrent > min && hotel.ratePlan.price.exactCurrent < max);
                // let filteredHotelData = hotelData;
                // construct JSON object to return, must match what frontend is expecting
                console.log(filteredHotelData);
                console.log("filtered hotels:" + filteredHotelData.length);

                // after filtering, sort 

                // construct JSON object to return, must match what frontend is expecting
                // sort data if sorting method provided 
                if (sort) {
                    // sort by price: min -> max
                    if (sort === "2") {
                        res.json(filteredHotelData.sort(compareHotelPrices));
                        // sort by price: max -> min
                    } else if (sort === "3") {
                        res.json(filteredHotelData.sort(compareHotelPrices).reverse());
                        // no sorting
                    } else {
                        res.json(filteredHotelData);
                    }
                } else {
                    res.json(filteredHotelData);
                }
            } catch (error) {
                console.log(error);
                // create error object with useful message
                const err = new Error('Error: Check server --- Hotel API call failed');
                // set status code to return with response
                err.status = 503;
                // forward error on to next middleware handler (the error handler defined below)
                next(err);
            }
        },
    );

    
}
