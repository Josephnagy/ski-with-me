/* eslint-disable */
/*
 * This represents "database" to be edited.
 * 
 * Note, this is NOT a good solution for handling shared data (the default for a web app)
 *
 * @author Joseph Nagy
 */

const admin = require('firebase-admin');

// provide global access to initialized app database
const { FIREBASE_CONFIG } = require('./secrets');
admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_CONFIG),
    databaseURL: `https://${FIREBASE_CONFIG.project_id}-default-rtdb.firebaseio.com`,
});
const DB = admin.database();

// actual data structure that the rest of the program will interact with
module.exports = {
    // could store a local copy of the database data to reduce time querying,
    // but note that any "extra" data only here in server will be wiped out 
    // periodically when Heroku restarts server
    dataRef: DB.ref('data'),


    // ==============================================================================================
    // General functions
    // ==============================================================================================

    // return all the data
    async getAllData() {
        console.log(`Getting data at ${this.getTimeStamp()}`);
        // NOT the data directly, get current snapshot of all data to process locally
        const snapshot = await this.dataRef.once('value');
        console.log(snapshot);
        // return actual data held within snapshot (also has convenience functions like forEach to process the data)
        return snapshot.val();
        // note could catch possible errors here, but should be caught be "general" error middleware
    },

    // return all the data
    async getAllUserData() {
        console.log(`Getting data at ${this.getTimeStamp()}`);
        // NOT the data directly, get current snapshot of all data to process locally
        const snapshot = await this.dataRef.once('value');
        console.log(snapshot);
        // return actual data held within snapshot (also has convenience functions like forEach to process the data)
        return snapshot.val().users;
        // note could catch possible errors here, but should be caught be "general" error middleware
    },

    // helepr function to check if user already exists in DB
    async checkIfUserExists(userEmail) {
        console.log(`Checking if user exists with this email: ${userEmail}`);
        // NOT the data directly, get current snapshot of all data to process locally
        const snapshot = await this.dataRef.once('value');
        // get keys to users object so you can use .find()
        let users = snapshot.val().users;
        console.log("users: ");
        console.log(users);
        let keys = Object.keys(users);
        // try to find user based on email 
        let userKey = keys.find(userKey => users[userKey].email === userEmail);
        return userKey ? userKey : false; 
    },

    // basic utility to display the time in a readable format
    getTimeStamp() {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }, 

    // ==============================================================================================
    // User Specific 
    // ==============================================================================================

    // adds user data to DB
    async addUserToDatabase (user) {
        console.log(`Adding user with this email: ${user.email}`);
        console.log("hello world");
        // add user to DB, use user.id as key 
        this.dataRef.child(`users`).child(user.id).set(user);
    },

    async getUserTrips(userEmail) {
        console.log(`Looking for trips for user with this email: ${userEmail}`);

        // make sure user exists before doing anything
        userKey = await this.checkIfUserExists(userEmail);
        // if user exists, find their trips 
        if(userKey !== false){
            // NOT the data directly, get current snapshot of all data to process locally
            const snapshot = await this.dataRef.once('value');
            // find user's trips based on userKey 
            let users = snapshot.val().users;
            // return empty aray if they don't have trips 
            console.log("trips for " + userKey);
            console.log(users[userKey].trips);
            return users[userKey].trips ? users[userKey].trips : [];
        } else {
            return false; 
        }
    },

    async createNewTrip(userId, tripName, startDate, endDate) {
        // print whats happening
        console.log(`Creating new trip called ${tripName} for userId: ${userId}`);

        // format trip object
        let trip = { "tripName": tripName, "startDate": startDate, "endDate": endDate};

        // add to DB
        console.log("dataRef push location:");
        console.log(this.dataRef.child(`users/${userId}/trips`));
        await this.dataRef.child(`users/${userId}/trips`).push(trip);
    }, 

    async addMountainToTrip(userId, trip, mountain) {
        // print whats happening
        console.log(`Adding mountain ${mountain.resort_name} for userId: ${userId}`);
        // NOT the data directly, get current snapshot of all data to process locally
        const snapshot = await this.dataRef.once('value');

        // get mountain path 
        let mountains = snapshot.val().mountains;
        // get keys so you can use .find()
        let mountainKeys = Object.keys(mountains);
        // mountain key is the mountainID in data/mountains/{mountainID}
        let mountainKey = mountainKeys.find(mountainKey => mountains[mountainKey].resort_name === mountain.resort_name);

        // check if data/users/{userId}/trips/{tripKey}/mountain exists 
        let tripKey = Object.keys(trip)[0];
        // prevent user from adding another mountain 
        if(!snapshot.child(`users/${userId}/trips/${tripKey}/mountain`).exists()){
            this.dataRef.child(`users/${userId}/trips/${tripKey}`).child("mountain").set(mountainKey);
        } 
    }, 

    // ==============================================================================================
    // Hotel Data 
    // ==============================================================================================

    async addHotelToTrip(userId, trip, hotel) {
        // print whats happening
        console.log(`Adding hotel ${hotel.name} for userId: ${userId}`);
        // NOT the data directly, get current snapshot of all data to process locally
        const snapshot = await this.dataRef.once('value');
        let hotelKey = hotel.id;
        // add hotel to DB 
        this.dataRef.child("hotels").child(hotelKey).set(hotel);

        // check if data/users/{userId}/trips/{tripKey}/hotel exists 
        let tripKey = Object.keys(trip)[0];
        // prevent user from adding another mountain 
        if (!snapshot.child(`users/${userId}/trips/${tripKey}/hotel`).exists()) {
            this.dataRef.child(`users/${userId}/trips/${tripKey}`).child("hotel").set(hotelKey);
        } 
    },

    async getSingleHotelData(hotelKey){
        // print whats happening
        console.log(`getting hotel with this key: ${hotelKey}`);
        // NOT the data directly, get current snapshot of all data to process locally
        const snapshot = await this.dataRef.once('value');
        // return mountain
        return snapshot.val().hotels[hotelKey];
    },

    // ==============================================================================================
    // Mountain Data 
    // ==============================================================================================

    async getMountainData () {
        // print whats happening
        console.log(`getting all mountain data from firebase`);
        // NOT the data directly, get current snapshot of all data to process locally
        const snapshot = await this.dataRef.once('value');
        // return mountains
        return snapshot.val().mountains;
    },

    async getSingleMountainData(mountainKey) {
        // print whats happening
        console.log(`getting mountain with this key: ${mountainKey}`);
        // NOT the data directly, get current snapshot of all data to process locally
        const snapshot = await this.dataRef.once('value');
        // return mountain
        return snapshot.val().mountains[mountainKey];
    }
};