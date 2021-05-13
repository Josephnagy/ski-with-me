<template>
  <div> 
      <div> 
          <h6> Star Rating </h6>
          <span> {{starRating}}/5 Stars </span>
      </div>
      <br> 
      <div> 
          <h6> Address </h6>
          <span> {{streetAddress}}</span>
      </div>
      <br> 
      <b-button :href="hotelLink" target="_blank">Book Hotel</b-button>
    </div>
</template>

<script>
export default {
  name: 'HotelModal',
  props: {
    hotel: {
      type: Object
    }, 
  }, 
  computed: {
      streetAddress() {
          return (this.hotel.address.streetAddress) ? this.hotel.address.streetAddress : "No Street Address Available";
      }, 
      starRating (){
        return (this.hotel.starRating) ? this.hotel.starRating : "No Rating Available";
      }, 
      hotelLink () {
        return "https://hotels.com/ho" + this.hotel.id;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
