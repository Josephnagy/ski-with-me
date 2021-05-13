Final project app

@author Joseph Nagy

Note, plain text can be used as comments at the top of the file, then use comment type
appropriate to that section of code.

<template>
  <div id="app">
      <div> 
        <h1>Current User: {{currentUserName}}</h1>
        <img :src="profileImageUrl" id="profileImage">
      </div>
      <!-- User Login -->
      <div> 
         <b-navbar type="dark" variant="secondary">
           <b-navbar-nav>
             <!-- login + logout -->
            <b-nav-item :href="`${apiUrlBase}api/auth/login`">Login</b-nav-item>
            <b-nav-item :href="`${apiUrlBase}api/auth/logout`">Logout</b-nav-item>
          </b-navbar-nav>
         </b-navbar>
      </div>
      <b-tabs> 
        <!-- Welcome Page -->
        <b-tab title="Welcome">
          <welcome-tab
            :user="user"
          > </welcome-tab> 
        </b-tab>

        <!-- Mountains -->
        <b-tab title="Mountains"> 
          <mountain-tab
            :user="user"
          >
          </mountain-tab>
          
        </b-tab>

        <!-- Hotels -->
        <b-tab title="Hotels"> 
          <hotel-tab
          :user="user"> </hotel-tab>
        </b-tab>

        <!-- Flights -->
        <b-tab title="Flights"> 
          <flight-tab>  </flight-tab>
        </b-tab>

        <!-- Trips -->
        <b-tab title="Trips"> 
          <trip-tab
            :user="user"
          >
          </trip-tab>
        </b-tab>
        
      </b-tabs>
  </div>
</template>

<script>

import { dataStore } from './data/DataStore.js'
import { getJSON } from './apiHelper';
import HotelTab  from './components/hotel/HotelTab'
import MountainTab  from './components/mountain/MountainTab'
import FlightTab  from './components/flight/FlightTab'
import TripTab  from './components/trip/TripTab'
import WelcomeTab  from './components/WelcomeTab'

export default {
  name: 'App',
  components: { 
    HotelTab, 
    MountainTab,
    FlightTab, 
    TripTab, 
    WelcomeTab
  }, 

  data () {
    return {
      dataStore: dataStore, 
      // set inside .env.* files
      apiUrlBase: process.env.VUE_APP_SERVER_API_BASE,
      user: {},
    }
  }, 

  methods: {
    // helper for calling /api/user
    async getUser() {
      this.user = await getJSON(this.apiUrlBase, 'api/user');
      this.addCurrentUserToDatabase();
    },
    async refreshAll() {
      await this.getUser();
    }, 
    async addCurrentUserToDatabase() {
      // first check if user is already in DB 
      let user = this.user;
      let userExists = await this.dataStore.checkIfUserExists(user.email);
      // if not, add them 
      console.log(userExists);
      if(userExists === false){
        await getJSON(
                this.apiUrlBase,
                'api/db/addUser',
                null,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user }),
                },
            );
      } else {
        return;
      }
    }
  },
  computed: {
    currentUserName () {
      return this.user.displayName ? this.user.displayName : "Guest User";
    }, 
    profileImageUrl () {
      return this.user.photo ? this.user.photo : "";
    }

  }, 
  mounted() {
    this.refreshAll();
  }
}
</script>

<style>
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
#profileImage {
    max-width: 5%;
    display: inline-block;
    border-radius: 15%;
}
h1{
  display: inline-block;
}
</style>
