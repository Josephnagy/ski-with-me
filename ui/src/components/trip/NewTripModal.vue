<template>
    <div> 
        <label for="newTripName">New Trip Name: </label>
        <input type="text" id="newTripName" v-model="newTripName">

        <br>
        <label for="newTripStartDate">New Trip Start Date: </label>
        <input type="date" id="newTripStartDate" v-model="newTripStartDate">
        <br>
        <label for="newTripEndDate">New Trip End Date: </label>
        <input type="date" id="newTripEndDate" v-model="newTripEndDate">

        <br>
        <b-button variant="success" @click="createNewTrip()"> Create Trip</b-button>

    </div>
</template>

<script>
export default {
  name: 'NewTripModal',
  data () {
      return {
          newTripName: "",
          newTripStartDate: "",
          newTripEndDate: ""
      }
  },

  computed: {
      
  }, 
  methods: {
      createNewTrip(){
        // TODO: make sure all fields are valid
        console.log(`EVENT: Creating new trip called " ${this.newTripName}" `);
        // NOTE: will need projectId when mutliple boards implemented 
        this.$emit('create-new-trip', this.newTripName, this.newTripStartDate, this.newTripEndDate);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
