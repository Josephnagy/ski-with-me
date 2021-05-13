<template>
  <b-list-group-item> 
      <p> hello world</p>
  </b-list-group-item> 
</template>

<script>
import { dataStore } from '../../data/DataStore'

export default {
  name: 'FlightListItem',
  data() {
    return {
        dataStore: dataStore, 
    }
  }, 
  props: {
    flight: {
      type: Object
    }, 
  }, 

  methods: {

  },

  computed: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
