<template>
  <div>
    <GraphList></GraphList>
    <GraphFusion></GraphFusion>
  </div>
</template>
<script>
import GraphList from '@/components/GraphList'
import GraphFusion from '@/components/GraphFusion'
export default {
  name: 'Page',
  components: { GraphList, GraphFusion },
  methods: {},
  mounted() {
    let self = this
  }
}

</script>
<style scoped>


</style>
