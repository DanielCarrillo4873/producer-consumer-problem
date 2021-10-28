<template>
  <q-card
    flat
    class="q-ma-lg"
    :class="{
      'bg-grey': state === 0,
      'bg-blue': state === 1,
      'bg-green': state === 2,
      'bg-yellow': state === 3,
    }"
  >
    <q-card-section>
      <p> {{ type }} </p>
      <p v-if="state === 2" >
        {{ this.producer ? 'Inserting' : 'Extracting' }}
        {{ remainingProduct }} / {{ totalProduct }}
      </p>
      <p v-if="state === 0"> Time to wake up: {{ timeToWake }} secs </p>
      <p v-else> {{ actualTask }} </p>
      <p>state: {{ stateStr }}</p>
    </q-card-section>
  </q-card>
</template>

<script>
import _ from 'lodash';
import {
  mapMutations, mapGetters, mapState, mapActions,
} from 'vuex';

export default {
  name: 'Process',
  props: {
    producer: Boolean,
  },
  data() {
    return {
      state: null,
      totalSleepingTime: null,
      timeToWake: null,
      intervalId: null,
      actualTask: '',
      workingDelay: 6000,
      wakeDelay: 3000,
      maxSleepingTime: 10,
      remainingProduct: null,
      totalProduct: null,

    };
  },
  watch: {
    state() {
      switch (this.state) {
        case 0: {
          this.sleep();
          break;
        }
        case 1: {
          this.wake();
          break;
        }
        case 2: {
          this.work();
          break;
        }
        case 3: {
          this.wait();
          break;
        }
        default:
          break;
      }
    },
  },
  computed: {
    ...mapGetters(['occupied', 'freeSpaces', 'occupiedSpaces', 'full', 'empty']),
    ...mapState(['buffer']),
    stateStr() {
      let state;
      switch (this.state) {
        case 0:
          state = 'sleeping';
          break;
        case 1:
          state = 'awake';
          break;
        case 2:
          state = 'working';
          break;
        case 3:
          state = 'waiting';
          break;
        default:
          state = '';
      }
      return state;
    },
    type() {
      return this.producer ? 'Producer' : 'Consumer';
    },
  },
  methods: {
    ...mapMutations(['free']),
    ...mapActions(['useBuffer', 'insertToBuffer', 'extractFromBuffer']),
    sleep() {
      this.timeToWake = _.random(1, this.maxSleepingTime);
      this.totalSleepingTime = this.timeToWake;
      this.intervalId = setInterval(() => {
        if (this.timeToWake > 0) {
          this.timeToWake -= 1;
        } else {
          clearInterval(this.intervalId);
          this.state = 1;
          this.timeToWake = null;
          this.totalSleepingTime = null;
          this.intervalId = null;
        }
      }, 1000);
    },
    wake() {
      this.actualTask = 'Trying to access buffer';
      this.useBuffer(this.type)
        .then(() => {
          this.state = 2;
        })
        .catch(() => {
          this.state = 0;
        });
    },
    async work() {
      let numItems;
      let actualItem;
      if (this.producer) {
        numItems = _.random(1, this.freeSpaces);
      } else {
        numItems = _.random(1, this.occupiedSpaces);
      }
      this.remainingProduct = 0;
      this.totalProduct = numItems;
      for (let i = 0; i < numItems; i += 1) {
        if (this.producer) {
          actualItem = _.random(0, 99);
          this.actualTask = `Inserting ${actualItem} to buffer`;
          this.remainingProduct += 1;
          // eslint-disable-next-line no-await-in-loop
          await this.insertToBuffer(actualItem);
        } else {
          [actualItem] = this.buffer;
          this.actualTask = `Extracting ${actualItem} from buffer`;
          this.remainingProduct += 1;
          // eslint-disable-next-line no-await-in-loop
          await this.extractFromBuffer();
        }
      }
      this.free();
      this.state = 0;
    },
  },
  mounted() {
    this.state = 0;
  },
};
</script>

<style scoped>

</style>
