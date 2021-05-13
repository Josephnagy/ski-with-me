<template>
  <b-list-group-item> 
    <h2> {{tripName}} </h2>
    <h5>({{tripStartDate}} to {{tripEndDate}})</h5>
      <b-row class="tripCardRow">
         <!--only show if there's data   -->
        <div v-if="displayMountainCard"> 
            <b-card
              :title="mountainName"
              :subTitle="mountainLocation"
            > 
              <p> Total Lift Count: {{liftCount}}</p> 
              <p> Skiable Acres: {{skiableAcres}} Acres</p> 
              <p> Run Count: {{runCount}}</p> 
              <h6> Trail Difficulty Distribution: </h6> 
              <p class="beginner"> Beginner: {{beginnerRunPercentage}}%</p>
              <p class="intermediate"> Intermediate: {{intermediateRunPercentage}}%</p>
              <p class="expert"> Expert: {{expertRunPercentage}}%</p>
              <p class="advanced"> Advanced: {{advancedRunPercentage}}%</p>
              <b-button v-b-modal="'showTrailMap'+mountainNameIdentifier" @click="getTrailMap"> View Trail Map </b-button>
              <b-modal :id="'showTrailMap'+mountainNameIdentifier" size="xl" :title="trailMapTitle"> 
                <img :src="trailMapLink" class="trailMap">
              </b-modal>
            </b-card>
        </div>

        <!--only show if there's data   -->
        <div v-if="displayHotelCard"> 
            <b-card
              :title="hotelName"
              :subTitle="hotelCity"
              :img-src="hotelImageUrl"
              img-alt="Image"
              img-top
            > 
              <p> Nightly Rate: {{hotelNightlyRate}}</p>
              <p> Star Rating: {{hotelStarRating}}/5</p>
            </b-card>
        </div>
    </b-row>

  </b-list-group-item> 
</template>

<script>
import { dataStore } from '../../data/DataStore'


export default {
  name: 'TripListItem',
  props: {
    trip: {
      type: Object
    }, 
  }, 
  data () {
    return {
      dataStore: dataStore,
      mountain: null, 
      trailMapUrl: "",
      hotel: null
    }

  },
  methods: {
    async getMountainData (){
      console.log(Object.values(this.trip)[0].mountain);
      if(Object.values(this.trip)[0].mountain){
        this.mountain = await this.dataStore.getSingleMountainData(Object.values(this.trip)[0].mountain);
      } else {
        window.alert("You either don't have a mountain yet or need to press get my trips again.");
      }
    }, 
    async getHotelData (){
      console.log(Object.values(this.trip)[0].hotel);
      if(Object.values(this.trip)[0].hotel){
        this.hotel = await this.dataStore.getSingleHotelData(Object.values(this.trip)[0].hotel);
      } else {
        window.alert("You either don't have a hotel yet or need to press get my trips again.");
      }
    }, 
    async getTrailMap(){
      if(this.trailMapUrl === ""){
        this.trailMapUrl = await this.dataStore.getTrailMap(this.mountain.links.trailmap);
      }
    }, 
    // Date functions 

  },
  mounted() {
    this.getMountainData();
    this.getHotelData();
  },
  computed: {
    // TRIP
    tripName () {
      return Object.values(this.trip)[0].tripName;
    }, 
    tripUniqueId (){
      return Object.keys(this.trip)[0];
    }, 
    tripStartDate() {
      return Object.values(this.trip)[0].startDate;
    },
    tripEndDate() {
      return Object.values(this.trip)[0].endDate;
    },
    // MOUNTAIN
    displayMountainCard () {
      return this.mountain !== null; 
    }, 
    mountainName (){
      return this.mountain.resort_name;
    }, 
    mountainLocation (){
      return '(' + this.mountain.primaryRegion.meta_region_name + ')';
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
    trailMapLink () {
      return this.trailMapUrl;
    },
    trailMapTitle (){
      return this.mountain.resort_name + " Trail Map";
    },
    // HOTEL
    displayHotelCard () {
      return this.hotel !== null; 
    }, 
    hotelName (){
      return this.hotel.name;
    }, 
    hotelCity (){
      return '(' + this.hotel.address.locality + ')';
    }, 
    hotelImageUrl (){
      return this.hotel.optimizedThumbUrls.srpDesktop; 
    }, 
    hotelNightlyRate() {
      return this.hotel.ratePlan.price.current; 
    }, 
    hotelStarRating() {
      return this.hotel.starRating;
    }, 
  }
}
</script>

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

.tripCardRow{
  display: inline-flex;
}
.trailMap{
  max-width: 100%;
}

/* Trail Difficulties */
.beginner{
    background-color: #6af189;
    border-radius: 10%;
    padding: 5%;
    font-weight: 700;
    color: black;
}
.intermediate{
    background-color: #ffc107;
    border-radius: 10%;
    padding: 5%;
    font-weight: 700;
    color: black;
}
.expert{
    background-color: #000000;
    border-radius: 10%;
    padding: 5%;
    font-weight: 700;
    color: white;
}
.advanced{
    background-color: #dc3545;
    border-radius: 10%;
    padding: 5%;
    font-weight: 700;
    color: black;
}
</style>
