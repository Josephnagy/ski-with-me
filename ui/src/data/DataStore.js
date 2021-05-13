/*
 * This represents the reactive data to be edited.
 *
 *
 * @author Joseph Nagy
 */

export const dataStore = {
    data: {
        hotels: [],
        mountains: {},
        flights: {},
        useRemoteServer: true, 
        message: ""
    },

    // ==============================================================================================
    // USERS
    // ==============================================================================================

    async getAllUserDataFromDatabase(){
        // get JSON data from server and use to update app's variables
        const SERVER_URL = this.data.useRemoteServer ? 'https://banana-crisp-68236.herokuapp.com/' : '';
        const url = `${SERVER_URL}api/db/get_all_user_data`;
        console.log(url);
        const response = await fetch(url);
        console.log(response);
        const serverData = await response.json();
        console.log(serverData);

        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            return serverData;
        } else {
            // may not always be wise to simply echo given error
            this.message = serverData.message;
            return false;
        }

    },

    async addUserToDatabase (){
        // get JSON data from server and use to update app's variables
        const SERVER_URL = this.data.useRemoteServer ? 'https://banana-crisp-68236.herokuapp.com/' : '';
        const url = `${SERVER_URL}api/user`;
        console.log(url);
        const response = await fetch(url);
        console.log(response);
        const serverData = await response.json();
        console.log(serverData);

        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            return true;
        } else {
            // may not always be wise to simply echo given error
            this.message = serverData.message;
            return false;
        }

    },

    async getUserTrips (email){
        // get JSON data from server 
        const SERVER_URL = this.data.useRemoteServer ? 'https://banana-crisp-68236.herokuapp.com/' : '';
        const url = `${SERVER_URL}api/db/getUserTrips?email=${email}`;
        console.log("GET: " + url);
        const response = await fetch(url);
        const serverData = await response.json();
        console.log("user trips retrieved from DB: ");
        console.log(serverData);

        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            return Object.entries(serverData).map((e) => ({ [e[0]]: e[1] }));   
        } else {
            // may not always be wise to simply echo given error
            this.message = serverData.message;
            // NOTE: bad, need to fix
            return null; 
        }
    },

    async checkIfUserExists(email) {
        // get JSON data from server 
        const SERVER_URL = this.data.useRemoteServer ? 'https://banana-crisp-68236.herokuapp.com/' : '';
        const url = `${SERVER_URL}api/db/checkUserExistence?email=${email}`;

        const response = await fetch(url);

        const serverData = await response.json();

        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            return serverData;
        } else {
            // may not always be wise to simply echo given error
            this.message = serverData.message;
            return false;
        }
    },

    // ==============================================================================================
    // MOUNTAIN
    // ==============================================================================================

    async getMetaMountainData(){
        // get JSON data from server and use to update app's variables
        const SERVER_URL = this.data.useRemoteServer ? 'https://banana-crisp-68236.herokuapp.com/' : '';
        const url = `${SERVER_URL}api/mountain/meta_mountain_data`;
        console.log(url);
        const response = await fetch(url);
        console.log(response);
        const serverData = await response.json();
        console.log(serverData);

        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            return Object.entries(serverData).map((e) => ({ [e[0]]: e[1] }));
        } else {
            // may not always be wise to simply echo given error
            this.message = serverData.message;
            return false;
        }
    },

    // returns URL to trail map image
    async getTrailMap(urlPath){
        // get JSON data from server and use to update app's variables
        const SERVER_URL = this.data.useRemoteServer ? 'https://banana-crisp-68236.herokuapp.com/' : '';
        const url = `${SERVER_URL}api/mountain/scrape/trailmap?urlpath=${urlPath}`;

        const response = await fetch(url);

        const imageUrl = await response.json();

        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            console.log("this is what's returned by the dataStore:");
            console.log(imageUrl);
            return imageUrl.url;
        } else {
            // may not always be wise to simply echo given error
            this.message = imageUrl.message;
            return "unable to fetch image URL";
        }
    },

    // returns mountain data from firebase DB given mountain key to identify it
    async getSingleMountainData(mountainKey) {
        // get JSON data from server and use to update app's variables
        const SERVER_URL = this.data.useRemoteServer ? 'https://banana-crisp-68236.herokuapp.com/' : '';
        const url = `${SERVER_URL}api/mountain/single_mountain_data?mountainKey=${mountainKey}`;

        const response = await fetch(url);

        const mountainData = await response.json();

        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            console.log("this is what's returned by the dataStore:");
            console.log(mountainData);
            return mountainData;
        } else {
            // may not always be wise to simply echo given error
            this.message = mountainData.message;
            return "unable to fetch mountain data from getSingleMountainData()";
        }
    },

    async getSingleHotelData(hotelKey){
        // get JSON data from server and use to update app's variables
        const SERVER_URL = this.data.useRemoteServer ? 'https://banana-crisp-68236.herokuapp.com/' : '';
        const url = `${SERVER_URL}api/hotel/single_hotel_data?hotelKey=${hotelKey}`;

        const response = await fetch(url);

        const hotelData = await response.json();

        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            console.log("this is what's returned by the dataStore:");
            console.log(hotelData);
            return hotelData;
        } else {
            // may not always be wise to simply echo given error
            this.message = hotelData.message;
            return "unable to fetch hotel data from getSingleHotelData()";
        }
    },




    // ==============================================================================================
    // HOTEL
    // ==============================================================================================

    // get hotel data from server to display
    async getHotelData(sortMethod) {
        // get JSON data from server and use to update app's variables
        const SERVER_URL = this.data.useRemoteServer ? 'https://banana-crisp-68236.herokuapp.com/' : '';
        const sort = sortMethod ? sortMethod : '';
        const url = `${SERVER_URL}/api/hotel/get_hotels?sort=${sort}`;
        console.log(url);
        const response = await fetch(url);
        console.log(response);
        const serverData = await response.json();
        console.log(serverData);
        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            this.data.hotels = serverData;
            return true;
        } else {
            // may not always be wise to simply echo given error
            this.message = serverData.message;
            return false; 
        }
    },
    async getFilteredHotelData(min, max, sortMethod, latitude, longitude, checkIn, checkOut){
        // get JSON data from server and use to update app's variables
        const SERVER_URL = this.data.useRemoteServer ? 'https://banana-crisp-68236.herokuapp.com/' : '';
        const sort = sortMethod ? sortMethod : '';
        console.log("latitude:");
        console.log(latitude);
        const url = `${SERVER_URL}api/hotel/get_filtered_hotels?min=${min}&max=${max}&sort=${sort}&latitude=${latitude}&longitude=${longitude}&checkIn=${checkIn}&checkOut=${checkOut}`;
        console.log(url);
        const response = await fetch(url);
        console.log(response);
        const serverData = await response.json();
        console.log(serverData);
        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            this.data.hotels = serverData;
            return true;
        } else {
            // may not always be wise to simply echo given error
            this.message = serverData.message;
            return false;
        }
    },


    // ==============================================================================================
    // FLIGHT
    // ==============================================================================================

    // get hotel data from server to display
    async getFlightData(origin, destination, departureDate, returnDate) {
        // get JSON data from server and use to update app's variables
        const SERVER_URL = this.data.useRemoteServer ? 'https://banana-crisp-68236.herokuapp.com/' : '';

        const url = `${SERVER_URL}/api/flight/flight_quotes?originplace=${origin}&destinationplace=${destination}&outboundpartialdate=${departureDate}&inboundpartialdate=${returnDate}`;

        const response = await fetch(url);

        const serverData = await response.json();

        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            this.data.flights = serverData;
        } else {
            // may not always be wise to simply echo given error
            this.message = serverData.message;
        }
    },
};
