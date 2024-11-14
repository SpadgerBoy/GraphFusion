<template>
  <g id='linklayer'>
  </g>
</template>
<script>
export default {
  name: 'LinkLayer',
  props: ['links'],
  data() {
    return {
      // linkPaths: []
    }
  },
  watch: {
    links: {
      handler: function(newLinks, oldLinks) {
        // console.log('path update')
        this.updateView(newLinks)
      },
      deep: true
    }
  },
  methods: {
    createPath: function(link) {
      return 'M' + link.source.x + ',' + link.source.y + 'L' + link.target.x + ',' + link.target.y
    },
    updateView: function(links) {
      let selection = d3.select('#linklayer').selectAll('g')
        .data(links)
      selection.select('path').attr('d', function(d) {
        return d.path
      })

      let enter = selection.enter()
      enter.append('g').append('path').attr('d', function(d) {
          return d.path
        })
        .style('stroke', 'gray')
        .style('stroke-opacity', 0.5)
        .style('stroke-width', '1')
      selection.exit().remove()
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#graphView {
  position: relative;
  width: 100%;
  height: calc(100% - 56px)
}

</style>
