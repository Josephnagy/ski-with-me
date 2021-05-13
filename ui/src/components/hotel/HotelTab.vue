<template> 
<div> 
    <h3> Filter By Nightly Rate </h3> 
    <div> 
      <label for="min">Minimum Rate</label>
      <br> 
      <input type="numnber" id="min" autocomplete="off" v-model="minNightlyRate"> 
      <br> 

      <label for="max">Maximum Rate</label>
      <br> 
      <input type="number" id="max" autocomplete="off" v-model="maxNightlyRate"> 
    </div>

    <br>
    <div> 
      <h3> Sort By Nightly Rate </h3> 
      <b-select style="width: 100%" v-model="sortMethod"> 
        <option style="width: 100%" value="1"> No Sorting </option>
        <option style="width: 100%" value="2"> min -> max </option>
        <option style="width: 100%" value="3"> max -> min  </option>
      </b-select>
    </div>

    <div> 
      <h3> Dates </h3> 
      <label for="checkin">Check-In</label>
      <br> 
      <input type="date" id="checkin" autocomplete="off" v-model="checkIn"> 
      <br> 
      <label for="checkout">Check-Out</label>
      <br> 
      <input type="date" id="checkout" autocomplete="off" v-model="checkOut"> 
    </div>
    <br> 
    <div> 
      <h3> Location </h3> 
      <label for="lat">Latitude</label>
      <br> 
      <input type="text" id="lat" v-model="latitude"> 
      <br> 
      <label for="long">Longitude</label>
      <br> 
      <input type="text" id="long" v-model="longitude"> 
      <br> 

    </div>

    <br>
    <div> <b-button @click="getFilteredHotelData">Find Hotels</b-button> </div> 
    <br> 
    
    <div v-if="displayHotelData"> 
      <hotel-list :hotels="hotels" :user="user">
      </hotel-list>
    </div>

    <div v-else> 
      <span> No Data Yet </span>
    </div>
</div>
</template>

<script>

import { dataStore } from '@/data/DataStore.js'
import HotelList  from './HotelList'

export default {
    name: 'HotelTab',
    components: { 
        HotelList
    }, 
    props: {
      user: {
        type: Object
      }
    },

    data() {
        return {
            dataStore: dataStore, 
            displayHotelData: false, 
            minNightlyRate: null, 
            maxNightlyRate: null, 
            sortMethod: null, 
            checkIn: "",
            checkOut: "", 
            latitude: "", 
            longitude: ""
        }
    }, 

    methods: {
        getHotelData(){
            // attempt to retrieve hotel data 
            let result = this.dataStore.getHotelData(this.sortMethod);

            // if function returns back true, display it 
            if(result){
                this.displayHotelData = true; 
            } else {
                window.alert("failed to retrieve hotel data");
                this.displayHotelData = false;
            }
        }, 
        getFilteredHotelData(){
        // make sure user enters all fields 
        if(!(this.userInputLatitude && this.userInputLongitude && this.userInputSortMethod && this.userInputCheckIn && this.userInputCheckOut)){
          window.alert("Please fill out all necessary fields!");
          return; 
        }

        // make sure checkIn date is before checkOut date
        if(!(this.checkIn < this.checkOut)){
          window.alert("Check-In date must come before Check-Out date");
          return;
        }

        // make sure dates are not in the past 

        // attempt to retrieve filtered hotel data 
        let result = this.dataStore.getFilteredHotelData(this.minNightlyRate, this.maxNightlyRate, this.sortMethod, this.latitude, this.longitude, this.checkIn, this.checkOut);

        // if function returns back true, display it 
        if(result){
            this.displayHotelData = true; 
        } else {
            window.alert("failed to retrieve hotel data");
            this.displayHotelData = false;
            }   
        }
  }, 
  computed: {
    hotels () {
      return this.dataStore.data.hotels; 
    }, 
    userInputLatitude (){
      return this.latitude !== "";
    }, 
    userInputLongitude (){
      return this.longitude !== "";
    }, 
    userInputSortMethod () {
      return this.sortMethod !== null;
    }, 
    userInputCheckIn () {
      return this.checkIn !== "";
    }, 
    userInputCheckOut () {
      return this.checkOut !== "";
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