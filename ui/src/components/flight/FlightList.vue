COMMENTS

<template>
      <div> 
          <b-list-group>

            <flight-list-item 
            v-for="(flight, flightId) in flights"
            :key="flightId"
            :flight="flight"
            >
            </flight-list-item> 
          
          </b-list-group>
        
      </div>
</template>

<script>
import FlightListItem from './FlightListItem.vue'

export default {
  name: 'FlightList',
  components: {
    FlightListItem
  },
  props: {
    flights: {
      type: Object, 
    }
  }, 
}
</script>

<style scoped>

</style>
