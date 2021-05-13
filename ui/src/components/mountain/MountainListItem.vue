<template>
  <b-list-group-item> 
    <h3> {{mountainName}} </h3> 
    <p> Total Lift Count: {{liftCount}}</p> 
    <p> Skiable Acres: {{skiableAcres}} Acres</p> 
    <p> Run Count: {{runCount}}</p> 
    <h5> Trail Difficulty Distribution: </h5> 
    <p class="beginner"> Beginner: {{beginnerRunPercentage}}%</p>
    <br>
    <p class="intermediate"> Intermediate: {{intermediateRunPercentage}}%</p>
    <br>
    <p class="expert"> Expert: {{expertRunPercentage}}%</p>
    <br>
    <p class="advanced"> Advanced: {{advancedRunPercentage}}%</p>
    <br>
    <b-button v-b-toggle="mountainNameIdentifier" variant="outline-primary">View Trail Map</b-button>
    <b-collapse :id="mountainNameIdentifier" @show="getTrailMap">
      <img :src="trailMapUrl">
    </b-collapse>
    <b-button variant="outline-success" v-b-modal="'addToTrips'+mountainNameIdentifier" @click="getUserTrips"> Add to my trips</b-button>
    <b-modal 
      :id="'addToTrips'+mountainNameIdentifier"
    > 
      <label>Add to which trip?</label>
      <select v-model="tripToAddMountainTo">
          <option v-for="(trip, t) in userTrips" :key="t" :value="trip">{{Object.values(trip)[0].tripName}}</option>
      </select>
      <b-button variant="success" @click="addMountainToTrip(tripToAddMountainTo)"> Add to Trip</b-button>
    </b-modal>
  </b-list-group-item> 
</template>

<script>
import { dataStore } from '../../data/DataStore'
import { getJSON } from '@/apiHelper.js';

export default {
  name: 'MountainListItem',
  data() {
    return {
        dataStore: dataStore, 
        trailMapUrl: "", 
        userTrips: [],
        tripToAddMountainTo: {},
        apiUrlBase: process.env.VUE_APP_SERVER_API_BASE,
    }
  }, 
  props: {
    mountain: {
      type: Object
    }, 
    user: {
      type: Object
    }
  }, 

  methods: {
    async getUserTrips (){
      this.userTrips = await this.dataStore.getUserTrips(this.user.email);
    },
    async getTrailMap(){
      if(this.trailMapUrl === ""){
        this.trailMapUrl = await this.dataStore.getTrailMap(this.mountain.links.trailmap);
      }
    }, 
    // Add mountain to user's trips 
    async addMountainToTrip (trip){
      // check if user has a profile in DB already 
      let userId = await this.dataStore.checkIfUserExists(this.user.email);
      let mountain = this.mountain;
      // if they are in the DB 
      if(userId !== false){
          // if so, add trip to user's profile in DB
          await getJSON(
            this.apiUrlBase,
            'api/db/addMountainToTrip',
            null,
            {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId, mountain, trip}),
            },
          );
        } else {
          // eventually change this to automatically add them, then create new trip
          window.alert("Sorry! Please login to access your trips."); 
        }

        // if not, create + add user profile to DB, 
        
        // ....then add trip to user's profile in DB
    }
  },

  computed: {
    mountainName () {
      return this.mountain.resort_name;
    }, 
    mountainNameIdentifier () {
      return this.mountain.resort_name.split(" ").join("-");
    }, 
    liftCount () {
      return this.mountain.resortProfile.num_lifts;
    }, 
    skiableAcres(){
      return this.mountain.resortProfile.num_skiable_acres;
    },
    runCount(){
      return this.mountain.resortProfile.number_runs;
    },
    // Run difficulty percentages
    beginnerRunPercentage (){
      return this.mountain.resortProfile.per_beginner_run;
    },
    intermediateRunPercentage (){
      return this.mountain.resortProfile.per_intermediate_run;
    },
    advancedRunPercentage (){
      return this.mountain.resortProfile.per_advanced_run;
    },
    expertRunPercentage (){
      return this.mountain.resortProfile.per_expert_run;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Trail Difficulties */
.beginner{
    max-width: 10%;
    max-height: 10%;
    display: inline-block;
    text-align: center;
    box-sizing: content-box;
    padding: 0.5%;
    background-color: #6af189;
    border-radius: 10%;
    font-weight: 700;
    color: black;
}
.intermediate{
    max-width: 10%;
    max-height: 10%;
    display: inline-block;
    text-align: center;
    box-sizing: content-box;
    padding: 0.5%;
    background-color: #ffc107;
    border-radius: 10%;
    font-weight: 700;
    color: black;
}
.expert{
    max-width: 10%;
    max-height: 10%;
    display: inline-block;
    text-align: center;
    box-sizing: content-box;
    padding: 0.5%;
    background-color: black;
    border-radius: 10%;
    font-weight: 700;
    color: white;
}
.advanced{
    max-width: 10%;
    max-height: 10%;
    display: inline-block;
    text-align: center;
    box-sizing: content-box;
    padding: 0.5%;
    background-color: #dc3545;
    border-radius: 10%;
    font-weight: 700;
    color: white;
}
img{
  max-width: 90%;
}
</style>
