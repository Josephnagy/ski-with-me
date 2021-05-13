COMMENTS

<template>
  <div> 
    <b-list-group>
      <trip-list-item 
        v-for="(trip, t) in trips"
        :key="t"
        :trip="trip"
      >
      </trip-list-item> 
    </b-list-group>
  </div>
</template>

<script>
import TripListItem from './TripListItem.vue'

export default {
  name: 'TripList',
  components: {
    TripListItem
  },
  props: {
    trips: {
      type: Array, 
    }
  }, 
  computed: {

  }
}
</script>


<style scoped>

</style>
