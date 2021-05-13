<template>
    <div> 
        <b-button > Get flight Data </b-button>
        <flight-list> 
        </flight-list>
    </div>
    
</template>

<script>
import { dataStore } from '../../data/DataStore'
import FlightList from './FlightList'

export default {
    name: 'FlightTab', 
    components: {
        FlightList
    }, 

    data() {
        return {
            dataStore: dataStore, 
            displayFlightData: false, 
        }
    }, 

    methods: {

    },

    computed: {

    }
}
</script>

<style scoped>

</style>