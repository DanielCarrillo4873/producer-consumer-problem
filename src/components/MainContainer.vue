<template>
  <div class="row main-container justify-center items-center">
    <div class="row simulator">
      <div class="col">
        <div class="row">
          <div class="col">
            <process producer />
          </div>
          <div class="col">
            <process />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <buffer />
          </div>
        </div>
      </div>
      <q-separator vertical />
      <div class="col">
        <OperationsList />
      </div>
    </div>
  </div>
</template>

<script>
import Process from '@/components/Process.vue';
import Buffer from '@/components/Buffer.vue';
import OperationsList from '@/components/OperationsList.vue';

export default {
  name: 'MainContainer',
  components: {
    Process,
    Buffer,
    OperationsList,
  },
};
</script>

<style scoped>
  .main-container {
    width: 100vw;
    height: 100vh;
  }
  .simulator {
    width: 60vw;
    height: 70vh;
  }
</style>
