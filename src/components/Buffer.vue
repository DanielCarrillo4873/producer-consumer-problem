<template>
  <h4>Buffer</h4>
  <h4> {{ occupiedSpaces }} / {{ max }} </h4>
  <ul>
    <li v-for="item in buffer" :key="item" > {{ item }} </li>
  </ul>
  <p> Worker: {{ worker }} </p>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Buffer',
  computed: {
    ...mapState(['buffer', 'worker', 'max']),
    ...mapGetters(['occupiedSpaces']),
  },
};
</script>

<style scoped>

</style>
