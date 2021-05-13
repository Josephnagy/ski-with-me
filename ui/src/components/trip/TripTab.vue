<template> 
    <div>
        <b-button variant="primary" v-b-modal="'newTrip'"> Create New Trip</b-button>
        <b-modal
          id="newTrip"
          title="Create New Trip"
          ok-only
          ok-title="Cancel"
          ok-variant="danger"
        > 
          <new-trip-modal
            @create-new-trip="createNewTrip"
          >  </new-trip-modal>
        </b-modal>

        <b-button variant="secondary" @click="getTrips()"> Get My Trips</b-button>

        <div v-if="displayTrips">
          <trip-list :trips="trips"> </trip-list>
        </div>

        <div v-else> 
        </div>

    </div>
</template>

<script>

import { dataStore } from '@/data/DataStore.js'
import { getJSON } from '@/apiHelper.js';
import NewTripModal  from './NewTripModal.vue'
import TripList from './TripList.vue'

export default {
    name: 'TripTab',
    components: { 
      NewTripModal,
        TripList
    }, 
    props: {
      user: {
        type: Object
      }
    },

    data() {
        return {
            dataStore: dataStore, 
            trips: [],
            testInput: "",
            apiUrlBase: process.env.VUE_APP_SERVER_API_BASE,
        }
    }, 

    methods: {
      // Get all trips for the given user, use email to find user in DB 
      async getTrips() {
        // check if user has a profile in DB already 
        let userId = await this.dataStore.checkIfUserExists(this.user.email);

        // if user exists
        if(userId !== false) {
          // try to get their trips 
          let trips = await this.dataStore.getUserTrips(this.user.email);
          if (trips === false){
            window.alert("Sorry! You don't have any trips");
            this.trips = [];
          } else {
            this.trips = trips;
          }
        } else {
          window.alert("Sorry! Please sign in to get trips.")
          return; 
        }
      },

      // Add new trip to Firebase DB for current user 
      async createNewTrip(tripName, startDate, endDate){
        // check if user has a profile in DB already 
        let userId = await this.dataStore.checkIfUserExists(this.user.email);

        if(userId !== false){
          // if so, add trip to user's profile in DB
          await getJSON(
            this.apiUrlBase,
            'api/trip/createTrip',
            null,
            {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId, tripName, startDate, endDate}),
            },
          );
        } else {
          // eventually change this to automatically add them, then create new trip
          window.alert("Sorry! Please sign in to create trips."); 
        }

        // if not, create + add user profile to DB, 
        
        // ....then add trip to user's profile in DB
      }
  },
    computed: {
      currentUserName () {
        return this.user.displayName ? this.user.displayName : "No User Signed In";
    }, 
      userEmail () {
        return this.user.email;
      }, 
      displayTrips() {
        return this.trips.length > 0; 
      }

  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.center{
  text-align: center;
}

</style>