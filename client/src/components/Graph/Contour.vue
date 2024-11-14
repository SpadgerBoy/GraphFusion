<template>
  <g :id="'contourView_' + graph.key" class="contourView">
  </g>
</template>
<script>
import { calConvexHull, copy } from '../../api/function.js'
import { calContour } from '../../api/contour.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['graph'],
  data() {
    return {
      pathData: null,
      initCenter: {},
      copyContourPosition: {}
    }
  },
  watch: {
    links: {
      handler: function(newLinks, oldLinks) {
        // console.log('path update')
        this.updateView(newLinks)
      },
      deep: true
    },
    updateContourSignal: function(newValue, oldValue) {
      this.calCenterLocation(this.graph)
      this.createContour(this.graph)
    },

    movedNode: function(newValue, oldValue) {
      let self = this
      // console.log(newValue)
      let info = newValue.split(' ')
      let id = info[0]
      let key = info[1]
      let type = info[2]
      if (type == 'list' && key == this.graph.key) return
      let flag = false
      self.graph.nodes.forEach(d => {
        if (d.id == id) {
          flag = true
        }
      })
      // console.log('flag', flag)
      if (flag) {
        self.$store.state.focusSubgraph = self.graph.key
        this.calCenterLocation(this.graph)
        this.createContour(this.graph)
      }
    },

    graph: function(newValue, oldValue) {
      console.log('contour update')
      this.calCenterLocation(this.graph)
      this.createContour(this.graph)
      this.updateSubgraph(copy(this.graph))
    },
    zoomInSubgraph: function() {
      let self = this
      let key = this.graph.key
      if (this.$store.state.focusSubgraph == this.graph.key) {
        this.zoomInSubgraphAction(this.graph, 1.1)
        this.updateSubgraph(copy(this.graph)) // 子图数据的实际大小变化
        self.$store.state.updateContourSignal = Math.random()
      }
    },
    zoomOutSubgraph: function() {
      let self = this
      let key = this.graph.key
      if (this.$store.state.focusSubgraph == this.graph.key) {
        console.log('zoom out contour')
        this.zoomOutSubgraphAction(this.graph, 1.1)
        this.updateSubgraph(copy(this.graph)) // 子图数据的实际大小变化
        self.$store.state.updateContourSignal = Math.random()
      }
    },
    focusSubgraph: function() {
      if (this.$store.state.focusSubgraph == this.graph.key) {
        this.svg.select('path').style('stroke-opacity', this.$store.state.strokeOpacity)
      } else {
        this.svg.select('path').style('stroke-opacity', 0)
      }
    },

    rotateAngle: function(newValue, oldValue) {
      d3.select('#dragView' + this.graph.key).selectAll('path').attr('stroke', null)

      this.rotateView(newValue - oldValue)
    },

    focusSubgraphUpdateFromListSignal: function(newValue, oldValue) {
      console.log('focusSubgraph Update from list')
      let self = this
      let key = this.graph.key
      if (this.$store.state.focusSubgraph == this.graph.key) {
        this.contourUpdateForList(this.$store.state.focusSubgraphData)
        this.updateSubgraph(copy(this.graph))
        // 节点的位置变化了，影响其它子图，需要更新他们的contour，但是子图的数据不影响
        self.$store.state.updateContourSignal = Math.random()
      }
    },
    movedNodeInContour: { //深度监听，可监听到对象、数组的变化
      handler(newValue, oldVal) {
        let self = this
        if (newValue.contourId == this.graph.key) {
          return
        }
        console.log('listened', newValue.id)
        this.graph.nodes.forEach(function(d) {
          console.log(newValue.id, d.id)
          if (d.id == newValue.id) {
            console.log('updated contour')
            self.calCenterLocation(self.graph)
            self.createContour(self.graph)
            return
          }
        })
      },
      deep: true
    },
  },
  computed: {
    ...mapGetters([
      'zoomInSubgraph',
      'zoomOutSubgraph',
      'focusSubgraph',
      'focusSubgraphUpdateFromListSignal',
      'movedNode',
      'rotateAngle'
    ]),
    updateContourSignal() {
      return this.$store.state.updateContourSignal
    },
    movedNodeInContour() {
      return this.$store.state.movedNodeInContour
    }
  },
  mounted: function(argument) {
    console.log('Contour', this.graph)
    // this.addSubgraph(copy(this.graph))
    this.calCenterLocation(this.graph)
    this.createContour(this.graph)
  },
  methods: {
    ...mapActions([
      'moveNodeInContour',
      'addSubgraph',
      'updateSubgraph',
      'setMovedNode',
    ]),
    calCenterLocation: function(graph) {
      // console.log('contour center')
      let centerX = 0,
        centerY = 0
      let self = this
      let nodes = graph.nodes
      for (let i in nodes) {
        centerX = centerX + nodes[i].x
        centerY = centerY + nodes[i].y
      }
      centerX = centerX / nodes.length
      centerY = centerY / nodes.length
      graph.centerX = centerX
      graph.centerY = centerY
      nodes.forEach(d => {
        self.copyContourPosition[d.id] = [d.x - centerX, d.y - centerY]
      })
    },
    contourUpdateForList: function(targetGraph) {
      let self = this
      let graph = self.graph
      let centerX = 0
      let centerY = 0
      let nodes = graph.nodes
      for (let i in nodes) {
        centerX = centerX + nodes[i].x
        centerY = centerY + nodes[i].y
      }
      centerX = centerX / nodes.length
      centerY = centerY / nodes.length
      graph.centerX = centerX
      graph.centerY = centerY

      let targetCX = 0
      let targetCY = 0
      targetGraph.nodes.forEach(d => {
        targetCX = targetCX + d.x
        targetCY = targetCY + d.y
      })
      targetCX = targetCX / targetGraph.nodes.length
      targetCY = targetCY / targetGraph.nodes.length

      let id2pos = {}
      let scale = self.calAverageEdgeLength(graph) / self.calAverageEdgeLength(targetGraph)
      console.log(targetCY, scale, centerX)
      targetGraph.nodes.forEach(d => {
        let x = (d.x - targetCX) * scale + centerX
        let y = (d.y - targetCY) * scale + centerY
        id2pos[d.id] = [x, y]
      })

      graph.nodes.forEach(d => {
        d.x = id2pos[d.id][0]
        d.y = id2pos[d.id][1]
      })

      centerX = 0
      centerY = 0
      for (let i in nodes) {
        centerX = centerX + nodes[i].x
        centerY = centerY + nodes[i].y
      }
      centerX = centerX / nodes.length
      centerY = centerY / nodes.length
      graph.centerX = centerX
      graph.centerY = centerY

      graph.nodes.forEach(d => {
        self.copyContourPosition[d.id] = [d.x - centerX, d.y - centerY]
      })
      self.viewUpdate()
      self.createContour(self.graph)
    },
    calAverageEdgeLength(graph) {
      let distance = 0
      let len = graph.nodes.length
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          distance = distance + this.calDistance(graph.nodes[i], graph.nodes[j])
        }
      }
      return distance / (len * (len - 1) / 2)
    },
    calDistance(a, b) {
      return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
    },

    createContour: function(graph) {
      let self = this
      let radius = graph.setting.radius
      let points = calConvexHull(graph, radius * 2)
      graph.nodes.forEach(d => {
        d.r = radius
      })

      let R = radius * 2
      let minx = 10000
      let miny = 10000
      points.forEach(d => {
        d[0] = d[0] - graph.centerX
        d[1] = d[1] - graph.centerY
      })
      for (let i in points) {
        if (miny > points[i][1]) {
          minx = points[i][0]
          miny = points[i][1]
        }
      }
      let path = 'M ' + points[0][0] + ',' + points[0][1]
      for (var i = 1; i < points.length; i++) {
        if (i % 2 == 1)
          path += 'L ' + points[i][0] + ',' + points[i][1]
        if (i % 2 == 0) {
          path += 'A ' + R + ',' + R + ',' + '0,0,0,' + points[i][0] + ',' + points[i][1]
        }
      }
      // let points = []
      // graph.nodes.forEach(d=>{
      //   points.push({'x': d.x, 'y': d.y, 'r': radius})
      // })
      // let minx = 10000
      // let miny = 10000
      // points.forEach(d => {
      //   d.x = d.x - graph.centerX
      //   d.y = d.y - graph.centerY
      // })
      // for (let i in points) {
      //   if (miny > points[i].y) {
      //     minx = points[i].x
      //     miny = points[i].y
      //   }
      // }
      // let path = calContour(points, radius * 2, 100)
      // console.log(path)
      this.pathData = [path, [minx, miny]]
      this.updateContourView()
    },
    updateContourView: function() {
      let self = this
      let pathData = this.pathData
      let graph = this.graph
      d3.select('#contourView_' + this.graph.key).select('g').remove()
      let svg = d3.select('#contourView_' + this.graph.key)
        .append('g')
        .attr('transform', 'translate(' + this.graph.centerX + ',' + this.graph.centerY + ')')
      svg.append('text')
        // .text(graph.key)
        .text('')
        .attr('x', pathData[1][0])
        .attr('y', pathData[1][1] - graph.setting.radius * 2)

      svg.append('path')
        // .transition()
        // .duration(3000)
        .attr('d', pathData[0])
        .attr('fill', graph.setting.color)
        .attr('class', 'groupConvexHull')
        .style('stroke-width', '2px')
        .style('stroke', graph.setting.color)
        .style('fill-opacity', self.$store.state.fillOpacity)
        .style('stroke-opacity', d => {
          if (self.$store.state.focusSubgraph == self.graph.key) {
            return self.$store.state.strokeOpacity
          }
          return 0
        })
        .attr('id', graph.key)
        .on('click', d => {
          if (self.$store.state.focusSubgraph == self.graph.key) {
            self.$store.state.focusSubgraph = null
          } else {
            self.$store.state.focusSubgraph = self.graph.key
          }
        })
        .on('dbclick', d => {
          console.log('dbclick')
        })

      d3.select('#contourView_' + this.graph.key).call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))

      self.svg = svg

      function dragstarted(d) {
        // d3.select(this).style('z-index', 100)

        self.initCenter.x = self.graph.centerX
        self.initCenter.y = self.graph.centerY
        self.dragFlag = false
        self.translatePosition = {}
        self.translatePosition.x = 0
        self.translatePosition.y = 0

      }

      function dragged(d) {
        console.log('contour drag .....')
        // self.calCenterLocation(self.graph)
        let x = d3.event.x
        let y = d3.event.y
        if (self.dragFlag == false) {
          self.translatePosition.x = self.initCenter.x - x
          self.translatePosition.y = self.initCenter.y - y
          self.dragFlag = true
        }
        let centerPosition = {};
        self.tx = x + self.translatePosition.x - self.graph.centerX
        self.ty = x + self.translatePosition.x - self.graph.centerX
        self.graph.centerX = x + self.translatePosition.x
        self.graph.centerY = y + self.translatePosition.y
        // d3.select(this).attr('transform', 'translate(' + self.tx + ',' + self.ty + ')')
        d3.select('#contourView_' + self.graph.key).select('g').attr('transform', 'translate(' + self.graph.centerX + ',' + self.graph.centerY + ')')
        self.graph.nodes.forEach(d => {
          d.x = self.copyContourPosition[d.id][0] + self.graph.centerX
          d.y = self.copyContourPosition[d.id][1] + self.graph.centerY
          self.$store.state.updateContourSignal = Math.random()
          // self.moveNodeInContour(node)
          // 存在异步问题
          // self.$store.state.movedNodeInContour = node
        })
        d3.select('#' + FusionViewId).selectAll('.node').attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        d3.select('#' + FusionViewId).selectAll('.lassoNode').attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })

        d3.select('#' + FusionViewId).selectAll('.dragNode').attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })


        d3.select('#' + FusionViewId).selectAll('.link').attr("x1", function(line) { return line.source.x; })
          .attr("y1", function(line) { return line.source.y; })
          .attr("x2", function(line) { return line.target.x; })
          .attr("y2", function(line) { return line.target.y; });


      }

      function dragended(d) {
        // if (!d3.event.active) simulation.alphaTarget(0);
        // d.fx = null;
        // d.fy = null;
      }
    },
    rotateView: function(angle) {
      if (this.$store.state.focusSubgraph != this.graph.key) return
      let self = this
      let nodes = self.graph.nodes
      let centerX = 0
      let centerY = 0
      for (let i in nodes) {
        centerX = centerX + nodes[i].x
        centerY = centerY + nodes[i].y
      }
      centerX = centerX / nodes.length
      centerY = centerY / nodes.length

      angle = -1 * angle / 180 * Math.PI
      self.graph.nodes.forEach(d => {
        let x = d.x
        let y = d.y
        x = x - centerX
        y = y - centerY
        d.x = x * Math.cos(angle) + y * Math.sin(angle)
        d.y = -1 * x * Math.sin(angle) + y * Math.cos(angle)
        d.x = d.x + centerX
        d.y = d.y + centerY
      })
      d3.select('#fusionView').select('svg').selectAll('.node')
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })

      d3.select('#fusionView').select('svg').selectAll('.lassoNode')
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })

      d3.select('#fusionView').select('svg').selectAll('.dragNode')
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })

      d3.select('#fusionView').select('svg').selectAll("line")
        .attr('x1', function(d) {
          return d.source.x
        })
        .attr('y1', function(d) {
          return d.source.y
        })
        .attr('x2', function(d) {
          return d.target.x
        })
        .attr('y2', function(d) {
          return d.target.y
        })

      this.createContour(this.graph)
      // this.updateSubgraph(copy(this.graph))
      self.$store.state.updateContourSignal = Math.random()
    },

    zoomInSubgraphAction(graph, factor) {
      let self = this
      let centerX = 0,
        centerY = 0

      let nodes = graph.nodes
      // for (let i in nodes) {
      //   centerX = centerX + nodes[i].x
      //   centerY = centerY + nodes[i].y
      // }

      nodes.forEach(d => {
        centerX = centerX + d.x
        centerY = centerY + d.y
      })

      centerX = centerX / nodes.length
      centerY = centerY / nodes.length
      // console.log('in center', centerX, centerY)
      graph.centerX = centerX
      graph.centerY = centerY
      graph.zoomScale = graph.zoomScale * factor
      nodes.forEach(d => {
        // let dis = Math.sqrt((d.x - centerX) * (d.x - centerX) + (d.y - centerY) * (d.y - centerY))
        // console.log(centerX, centerY, factor)
        d.x = (d.x - centerX) * factor + centerX
        d.y = (d.y - centerY) * factor + centerY
      })

      // centerX = 0
      // centerY = 0
      // nodes.forEach(d => {
      //   centerX = centerX + d.x
      //   centerY = centerY + d.y
      // })
      // centerX = centerX / nodes.length
      // centerY = centerY / nodes.length
      // console.log('2', centerX, centerY)
      nodes.forEach(d => {
        self.copyContourPosition[d.id] = [d.x - centerX, d.y - centerY]
      })
      self.viewUpdate()

    },
    zoomOutSubgraphAction(graph, factor) {
      let self = this
      let centerX = 0,
        centerY = 0

      let nodes = graph.nodes
      for (let i in nodes) {
        centerX = centerX + nodes[i].x
        centerY = centerY + nodes[i].y
      }

      centerX = centerX / nodes.length
      centerY = centerY / nodes.length
      console.log('out center', centerX, centerY)
      graph.centerX = centerX
      graph.centerY = centerY
      graph.zoomScale = graph.zoomScale / factor
      nodes.forEach(d => {
        // let dis = Math.sqrt((d.x - centerX) * (d.x - centerX) + (d.y - centerY) * (d.y - centerY))
        d.x = (d.x - centerX) / factor + centerX
        d.y = (d.y - centerY) / factor + centerY
      })
      nodes.forEach(d => {
        self.copyContourPosition[d.id] = [d.x - centerX, d.y - centerY]
      })
      self.viewUpdate()
    },

    viewUpdate() {
      d3.selectAll('.lassoNode').attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })

      d3.selectAll('.node').attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })

      d3.selectAll('.dragNode').attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })


      d3.select('#fusionView').select('svg').selectAll("line").attr("x1", function(line) { return line.source.x })
        .attr("y1", function(line) { return line.source.y; })
        .attr("x2", function(line) { return line.target.x; })
        .attr("y2", function(line) { return line.target.y; });
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

.contourView:hover {
  cursor: pointer;
  z-index: 100;
}

</style>
