<template>
  <b-list-group-item> 
    <h4> {{hotelName}} </h4> 
    <p> {{hotel.ratePlan.price.current}} per night </p> 
    <b-button v-b-modal="'viewHotelModal'+hotelName" variant="info"> More Details </b-button>

    <b-modal 
        :id="'viewHotelModal'+hotelName" 
        :title="hotelName"
        ok-only
        ok-title="Close"
        > 

        <hotel-modal
          :hotel="hotel"
        > </hotel-modal>
        
      </b-modal>
    <b-button variant="success" v-b-modal="'addHotelToTrip'+hotelId" @click="getUserTrips"> Add to Trip</b-button>
    <b-modal 
      :id="'addHotelToTrip'+hotelId"
    > 
      <label>Add to which trip?</label>
      <select v-model="tripToAddHotelTo">
          <option v-for="(trip, t) in userTrips" :key="t" :value="trip">{{Object.values(trip)[0].tripName}}</option>
      </select>
      <b-button variant="success" @click="addHotelToTrip(tripToAddHotelTo)">Add to Trip</b-button>
    </b-modal>
  </b-list-group-item> 
</template>

<script>
import { getJSON } from '@/apiHelper.js';
import { dataStore } from '../../data/DataStore'
import HotelModal from './HotelModal.vue'

export default {
  components: { HotelModal },
  name: 'HotelListItem',
  props: {
    hotel: {
      type: Object
    }, 
    user: {
      type: Object
    }
  }, 
  data (){
    return {
      dataStore: dataStore,
      userTrips: [],
      tripToAddHotelTo: null,
      apiUrlBase: process.env.VUE_APP_SERVER_API_BASE,
    }
  },
  methods: {
    async getUserTrips (){
      this.userTrips = await this.dataStore.getUserTrips(this.user.email);
    },
    async addHotelToTrip(trip){
      // check if user has a profile in DB already 
      let userId = await this.dataStore.checkIfUserExists(this.user.email);
      let hotel = this.hotel;
      // if they are in the DB 
      if(userId !== false){
          // if so, add trip to user's profile in DB
          await getJSON(
            this.apiUrlBase,
            'api/db/addHotelToTrip',
            null,
            {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId, hotel, trip}),
            },
          );
        } else {
          // eventually change this to automatically add them, then create new trip
          window.alert("sorry you're not in the DB yet!"); 
        }

        // if not, create + add user profile to DB, 
        
        // ....then add trip to user's profile in DB

    }
  },
  computed: {
    hotelName () {
      return this.hotel.name;
    }, 
    hotelId () {
      return this.hotel.id;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
