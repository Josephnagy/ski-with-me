COMMENTS

<template>
      <div> 
          <div> 
          </div>

          <b-list-group>
            <mountain-list-item 
            v-for="(mountain, m) in mountains"
            :key="m"
            :mountain="mountain"
            :user="user"
            >
            </mountain-list-item> 
          </b-list-group>
      </div>
</template>

<script>
import MountainListItem from './MountainListItem.vue'

export default {
  name: 'MountainList',
  components: {
    MountainListItem
  },
  props: {
    mountains: {
      type: Array, 
    }, 
    user: {
      type: Object
    }
  }, 
}
</script>

<style scoped>

</style>
