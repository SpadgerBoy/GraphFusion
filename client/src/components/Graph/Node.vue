<template>
  <!--  <transition-group tag="g" name="node">
    <g class="nodeg" v-for="node in nodes" v-bind:key="node.id">
      <circle r="5" v-bind:style="{'fill': 'steelblue'}" v-bind:cx="node.x" v-bind:cy="node.y" v-bind:id="node.id"
      @mousedown></circle>
    </g>
  </transition-group> -->
  <g id='nodelayer'>
  </g>
</template>
<script>

export default {
  name: 'NodeLayer',
  props: ['nodes'],
  data() {
    return {

    }
  },
  mounted: function() {
    var self = this
    this.$nextTick(function() {
      // Code that will run only after the
      // entire view has been rendered
      console.log(d3.selectAll("circle"))
    })
    // Code that will run only after the
    // entire view has been rendered
    // self.addDrag()

  },
  watch: {
    nodes: function(newNodes, oldNodes) {
      this.updateView(newNodes)
    }
  },
  methods: {
    addDrag: function() {
      var self = this
      d3.selectAll("circle")
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))

      function dragstarted(d) {}

      function dragged(d) {
        // console.log(d)
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y)
        self.$emit('moveNodes', [d])
      }

      function dragended(d) {}
    },
    updateView: function(nodes) {
      let selection = d3.select('#nodelayer').selectAll('g')
        .data(nodes)
      selection.select('circle').attr('cx', function(d) {
          return d.x
        })
        .attr('cy', function(d) {
          return d.y
        })

      let enter = selection.enter()
      enter.append('g').append('circle').attr('cx', function(d) {
          return d.x
        })
        .attr('cy', function(d) {
          return d.y
        })
        .style('fill', 'steelblue')
        .attr('r', '4')
      selection.exit().remove()

      this.addDrag()
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
