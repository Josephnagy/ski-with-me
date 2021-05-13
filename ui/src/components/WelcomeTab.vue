<!-- Vue files are divided into three parts: HTML template, JavaScript Object, and CSS styling -->
<template>
  <div>
      <h2> Project Idea</h2>
      <p> {{projectIdea1}}</p>
      <p> {{projectIdea2}}</p>

      <h2> Implementation</h2>
      <p> {{implementation1}}</p>
      <p> {{implementation2}}</p>
      <p> {{implementation3}}</p>

      <h2> Attributions </h2>
      <ul> 
          <li>- OnTheSnow.com for all mountain related data</li>
          <li>- Hotel.com for all hotel related data </li>
      </ul>
      <h2> Demo Video </h2>
      <a href="https://youtu.be/ddJhFTrIAao" target="_blank">Youtube Link</a>

      <div v-if="isAdmin"> 
        <h2> Admin Data:</h2>
        <b-button @click="getAllUserData()"> Get Data</b-button>
        <p> User Data: </p>
        <span> {{this.allUserData}}</span>
      </div>
  </div>
</template>

<script>
import { dataStore } from '@/data/DataStore.js'

// make this object "public", available outside this module, with the name "App"
export default {
    name: 'WelcomeTab',
    props: {
      user: {
        type: Object
      }

    },
    data() {
        return {
          dataStore: dataStore,
          allUserData: null
        };
    },
    methods: {
      async getAllUserData(){
        let data = await this.dataStore.getAllUserDataFromDatabase();
        console.log(data);
        this.allUserData = data;
      }
    },
    computed: {
        projectIdea1 (){
            return `My project is a web app that allows you to plan ski and snowboarding trips. Originally, I was planning on having many more features than I am about to explain; however, things did not work out as planned so I was only able to implement some features. So, in the app’s current state, the first thing users need to do decide if they want to sign in or remain a guest. Guests can view the page, but they cannot plan their own trips; they’d need to log in with their google account to do that. So after a user sings in, the first thing they’ll need to do is navigate to the “Trips” tab where they can create a trip with a trip name and start/end dates. `;
        }, 
        projectIdea2(){
            return `Once a trip is created, the user can navigate to the “Mountains” tab where they will be able to browse all of the mountains in the United States. Users are able to see the total number of lifts, skiable acres, total number of runs and trail difficulty distribution. {POSSIBLY GET WEATHER AND TRAIL MAP IMPLEMENTED}. Once the user finds the mountain they’d like to ski or snowboard on their trip, they can press “add to my trips” and select which one they want to add it to. Similarly, users can navigate to the “Hotels” tab where they can search for the hotel they want to stay at during their trip. By entering their price range, trip dates, location and sort method, the user can press “Find Hotels” to find out what hotels there are. Once the user finds a hotel they like, they can press “Add to trip” like in the “Mountains” tab to add it to their trip. Once their trip is set up, they can navigate back to the “Trips” tab to view their trips and their associated mountains and hotels.`;
        },
        implementation1 (){
            return `To build the mountains tab, I first called an API from OnTheSnow.com, an online resource for snow reports and ski details, to get all of the data for each mountain. This includes both the information displayed on the front end (trail difficulties, trial count, total skiable acres, etc.), but also necessary links to other pages where more data is scraped from. Specifically, there is a mountain overview page which I scrape the mountain’s trail map from. This API was not “publicly advertised,” but I discovered it by loading an OnTheSnow webpage and sifting through the Network tab in the Chrome Dev Tools pane until I found what I needed. Once I got this data, I stored all of it in my Firebase Realtime Database because 1) This data is static 2) I was afraid OnTheSnow would eventually increase their security measures and hide this data from the public 3) It made it much easier to organize the database because I didn’t have to worry about adding mountains to it. The trail maps were obtained through web scraping each mountain’s page from OnTheSnow.com by using Puppeteer. Unfortunately, Puppeteer is incompatible with Heroku, so the “view trail map” buttons don’t work on the deployed version of the website. `;
        }, 
        implementation2(){
            return `To build the hotels tab, I used a public API provided by Hotels.com. The API works by providing a minimum and maximum nightly rate, check-in and check-out dates, a sorting method and latitude and longitude. The API returns nearby hotels based on the location given. It provides basic information about the hotel including nightly rate, address and how many stars the hotel has. `;
        }, 
        implementation3 (){
            return `When a user first logs into the website, a profile in the Firebase Realtime Database is automatically created for them and stores all of their associated details (ie name, email, if they’re an admin or not and their profile picture). Once a user is logged in, they’re able to create trips with mountains and hotels as described above. Adding a mountain to a user’s trip is implemented by adding the mountain’s database key to the user’s mountain field in the Firebase Realtime Database. Adding a hotel works the same way, but the hotel data is also pushed to the database since it’s not automatically stored there like the mountains are.`;
        }, 
        isAdmin(){
          return this.user.isAdmin;
        }
    }
};
</script>
<style scoped>
p{
    max-width: 75%;
    text-align: center;
    display: inline-block;
}
li{
    list-style: none;
}

@media only screen and (max-width: 10000) {
  body {
    background-color: lightgray;
  }
}

@media only screen and (max-width: 600px) {
  body {
    background-color: lightblue;
  }
}

@media only screen and (max-width: 200px) {
  body {
    background-color: lightcoral;
  }
}

</style>
