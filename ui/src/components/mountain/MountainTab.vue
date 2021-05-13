<template>
    <div> 
        <vue-fuse 
            :list="formattedMountainList" 
            :fuse-opts="searchOptions" 
            :keys="keys"
            placeholder="Search Mountains..."
            @fuse-results="handleSearchResults">
        </vue-fuse>
        <div v-if="displayMountainData"> 
            <mountain-list 
                :mountains="filteredMountains"
                :user="user"
            >
            </mountain-list>
        </div>

        <div v-else> 
        <h2> Loading Mountains... </h2>
        </div>
    </div>
    
</template>

<script>
import { dataStore } from '../../data/DataStore'
import MountainList from './MountainList'
import VueFuse from 'vue-fuse'

export default {
    name: 'MountainTab', 
    props: {
        user: {
            type: Object
        }
    },
    components: {
        MountainList, 
        VueFuse
    }, 

    data() {
        return {
            dataStore: dataStore, 
            mountains: [], 
            filteredMountains: [], 
            keys: ["id.resort_name"],
            searchOptions: {
                // which TEXT fields to use in the search, use . to show nesting
                // NOTE, search results are grouped in order given here
                keys: ["resort_name"],
                // report exactly which fields and which characters signaled the match
                includeMatches: true,
                // 0 is an exact match up to 1 is very loose match
                threshold: 0.3
            },
        }
    }, 

    methods: {
        async getMountainData(){
            // attempt to retrieve mountain data 
            this.mountains = await this.dataStore.getMetaMountainData();
        }, 
        // helper function to reformat vue-fuse search results
        getMountainFromSearchResults(result){
            return result.item;
        },
        // receive vue-fuse search results and prepare for app
        handleSearchResults(results){
            console.log(results);
            // search actually took place and checked for specific results
            if (results.some(group => group.matches)) {
                console.log(results.map(group => group.matches?.map(match => match.value)));
                // save local filteredTaskLists
                this.filteredMountains = results.map(group => this.getMountainFromSearchResults(group));
            }
            // search was initialized or cleared, so return all data
            else {
                this.filteredMountains = this.formattedMountainList;
            }
        }
    },

    computed: {
        displayMountainData (){
            return this.mountains.length > 0; 
        }, 
        formattedMountainList (){
            return Object.values(this.mountains).map(object => Object.values(object)[0]);
        }
    }, 
    mounted (){
        this.getMountainData();
    }
}
</script>

<style scoped>

</style>