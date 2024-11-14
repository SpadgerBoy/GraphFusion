<template>
  <div class='svgDiv' v-bind:style="{borderColor:borderColor, boxShadow:boxShadow}" :id="'div' + initGraph.key">
    <span style="float: left;margin-left: 10px"> {{ initGraph.key }} </span>
    <button class="btn" style="float: right;" v-on:click="handleDelete()">
      <i class="iconfont icon-delete1"></i>
    </button>
    <svg v-bind:width="initGraph.setting.width" v-bind:height="initGraph.setting.height" v-bind:transform="initGraph.setting.transform" :id="initGraph.key" v-on:click="clickSvg(initGraph.key)">
      <g :id="'contourView' + initGraph.key"> </g>
      <g :id="'canvasView' + initGraph.key"> </g>
      <g :id="'dragView' + initGraph.key"></g>
    </svg>
  </div>
</template>
<script>
import Vue from 'vue'
import { contourExpansion, subgraphNameList } from '../../api/global.js'
import { calConvexHull, transformPosition, copy } from '../../api/function.js'
import { circleLayout, lineLayout, rectLayout } from '../../api/layout.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'GraphView',
  props: ['initGraph', 'clickedIcon'],
  data() {
    return {
      simulation: null,
      data: null,
      layout: false,
      isList: true,
      lassoIds: [],
      isFocus: false,
      borderColor: '#ddd',
      boxShadow: "0px 0px 2px 2px #ddd"
    }
  },
  watch: {
    focusSubgraph: function(newValue, oldValue) {
      let currentFocus = newValue
      // console.log(currentFocus)
      if(this.$store.state.dragNodeEventStop == false) return
      if (currentFocus != this.graph.key) {
        this.isFocus = false
        this.borderColor = '#ddd'
        this.boxShadow = "0px 0px 2px 2px #ddd"
        this.svg.select('path').style('stroke-opacity', 0)
      } else {
        this.isFocus = true
        this.borderColor = this.graph.setting.color
        this.boxShadow = "0px 0px 2px 2px " + this.graph.setting.color
        this.svg.select('path').style('stroke-opacity', this.$store.state.strokeOpacity)

        let scrollTop = document.getElementById("div" + this.graph.key).offsetTop - this.graph.setting.height

        $('#listView').animate({ scrollTop: scrollTop }, 400);
      }
    },
    clickedIcon: function(newValue, oldValue) {
      if (newValue == null) return
      let icon = this.clickedIcon.split(',')[0]
      // console.log(icon, this.graph)
      if (this.isFocus) {
        if (icon == 'circle') {
          console.log('this.graph:',this.graph)
          circleLayout(this.graph, this.graph.setting.width, this.graph.setting.height)
          this.updateView('circle')
          this.createContour(this.graph)
        }
        if (icon == 'line') {
          lineLayout(this.graph, this.graph.setting.width, this.graph.setting.height)
          this.updateView('line')
          this.createContour(this.graph)
        }
        if (icon == 'grid') {
          rectLayout(this.graph, this.graph.setting.width, this.graph.setting.height)
          this.updateView('rect')
          this.createContour(this.graph)
        }
        if (icon == 'reset') {
          // rectLayout(this.graph, this.graph.setting.width, this.graph.setting.height)
          this.graph.nodes.forEach(d => {
            d.x = d.copyx
            d.y = d.copyy
          })
          this.updateView('reset')
          this.createContour(this.graph)
        }
        this.$store.state.focusSubgraphData = this.graph
        this.$store.state.focusSubgraphUpdateFromListSignal = Math.random()
      }
    },
    updateSubgraphSignal: function() {
      let self = this
      console.log("updateSubgraph", self.$store.state.updatedSubgraphId)
      if (self.$store.state.updatedSubgraphIds.indexOf(self.graph.key) >=0) {
        let subgraphViewList = self.$store.state.subgraphViewList
        let tmpGraph
        for(let i in subgraphViewList) {
          if(subgraphViewList[i].key == self.graph.key)
            tmpGraph = subgraphViewList[i]
        }
        tmpGraph.setting = self.graph.setting
        self.graph = tmpGraph
        self.init()
        self.createView()
        self.createContour()
        self.createDragView()
      }
    },
    linkSize: function(newValue, oldValue) {
      this.svg.selectAll('.link').selectAll('line').style('stroke-width', newValue)
    },
    nodeSize: function(newValue, oldValue) {
      this.svg.selectAll('.node').selectAll('circle').attr('r', newValue)
    },
    labelSize: function(newValue, oldValue) {
      this.svg.selectAll('.node').selectAll('text').style('font-size', newValue + 'em')
    },
    removeAllSubgraphTime: function() {
      this.handleDelete()
    }
  },
  computed: {
    focusSubgraph: function() {
      let currentFocus = this.$store.state.focusSubgraph
      return currentFocus
    },
    removeAllSubgraphTime: function() {
      return this.$store.state.removeTime
    },
    updateSubgraphSignal: function() {
      return this.$store.state.updateSubgraphSignal
    },
    linkSize: function() {
      return this.$store.state.linkSize
    },
    nodeSize: function() {
      return this.$store.state.nodeSize
    },
    labelSize: function() {
      return this.$store.state.labelSize
    }
  },
  mounted: function() {
    var self = this
    self.graph = copy(self.initGraph)
    self.init()
    self.createView()
    self.createContour()
    self.createDragView()
    self.$store.state.focusSubgraph = self.graph.key
    self.isFocus = true
    this.borderColor = this.graph.setting.color
    this.boxShadow = "0px 0px 2px 2px " + this.graph.setting.color
  },
  methods: {
    ...mapActions([
      'setFocusSubgraph',
      'removeSubgraph',
      'addSubgraph'
    ]),
    init: function() {
      let self = this
      let nodes = self.graph.nodes
      let links = self.graph.links
      let id2link = {}
      let id2node = {}
      for (let i in links) {
        let s = links[i].source.id
        let t = links[i].target.id
        id2link[s + ',' + t] = true
        id2link[t + ',' + s] = true
      }
      for (let i in nodes) {
        let id = nodes[i].id
        id2node[id] = nodes[i]
      }
      self.id2link = id2link
      self.id2node = id2node
    },
    handleDelete: function() {
      let key = this.graph.key
      for (let i in subgraphNameList) {
        if (subgraphNameList[i][0] == key) {
          subgraphNameList[i][1] = 0
          break
        }
      }
      if (this.$store.state.focusSubgraph == key) {
        this.$store.state.focusSubgraph = null
      }
      this.removeSubgraph(key)
    },
    clickSvg: function(key) {
      let self = this
      if (self.$store.state.focusSubgraph == key) {
        self.$store.state.focusSubgraph = null
      } else {
        self.setFocusSubgraph(key)
      }
    },

    createView: function() {
      let self = this
      let graph = self.graph
      let nodes = graph.nodes
      let links = graph.links
      let radius = graph.setting.radius
      let width = graph.setting.width
      let height = graph.setting.height
      let id2node = self.id2node
      transformPosition(graph, graph.setting.width, graph.setting.height)
      this.scale = graph.setting.scale
      links.forEach(function(d) {
        d.source = id2node[d.source.id]
        d.target = id2node[d.target.id]
      })
      let svg = d3.select('#' + graph.key).select('#canvasView' + graph.key)
      this.svg = svg
      svg.selectAll('g').remove()


      let link = svg.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", 2)
        .attr('class', function(d) {
          return d.source.id + ' ' + d.target.id
        })
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)


      let nodeg = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        .attr('id', d => {
          return 'canvasNode' + d.id
        })

      // .call(d3.drag()
      //   .on("start", dragstarted)
      //   .on("drag", dragged)
      //   .on("end", dragended))

      nodeg.append("path")
        .attr('d', d => {
          return d.path
        })
        .attr('fill', d => {
          return d.color
        })

      nodeg.append("text")
        .text(d => d.label)
        .attr('y', -1.4 * radius)
        .attr('visibility', function() {
          return self.$store.state.nodeLabel ? 'display' : 'hidden'
        })
        .style('font-size', function() {
          return self.$store.state.labelSize + 'em'
        })

    },
    createDragView: function() {
      let self = this
      let graph = self.graph
      let radius = graph.setting.radius
      let width = graph.setting.width
      let height = graph.setting.height
      let drag_svg = d3.select('#' + graph.key).select('#dragView' + graph.key)
      drag_svg.selectAll('.dragNode').remove()
      let drag_nodeg = drag_svg.selectAll('.dragNode')
        .data(graph.nodes)
        .enter()
        .append('g')
        .attr('class', 'dragNode')
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))

      drag_nodeg.append("path")
        .attr('d', d => {
          return d.path
        })
        .attr('fill', d => {
          return 'red'
        })
        .attr('fill-opacity', 0.01)

      function dragstarted(d) {
        self.setFocusSubgraph(graph.key)
      }

      function dragged(d) {
        d.x = d3.event.x
        d.y = d3.event.y
        if (d.x < 0) d.x = radius
        if (d.x > width) d.x = width - radius
        if (d.y < 0) d.y = radius
        if (d.y > height) d.y = height - radius
        d3.select(this).attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        d3.select('#canvasView' + graph.key).select('#canvasNode' + d.id).attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        d3.select('#canvasView' + graph.key).selectAll('line')
          .attr("x1", function(line) { return line.source.x })
          .attr("y1", function(line) { return line.source.y; })
          .attr("x2", function(line) { return line.target.x; })
          .attr("y2", function(line) { return line.target.y; })
        self.createContour(self.graph)
      }

      function dragended(d) {
        self.$store.state.focusSubgraphData = self.graph
        self.$store.state.focusSubgraphUpdateFromListSignal = Math.random()
      }
    },
    updateView(layoutType) {
      let graph = this.graph
      d3.select('#dragView' + graph.key).selectAll('.dragNode').attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
      d3.select('#canvasView' + graph.key).selectAll('.node').attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })

      d3.select('#canvasView' + graph.key).selectAll('line').attr("x1", function(line) { return line.source.x })
        .attr("y1", function(line) { return line.source.y; })
        .attr("x2", function(line) { return line.target.x; })
        .attr("y2", function(line) { return line.target.y; })
    },
    createContour: function() {
      let graph = this.graph
      let radius = graph.setting.radius
      let points = calConvexHull(graph, radius * 2)
      // console.log('contour', points)

      let R = radius * 2
      let path = 'M ' + points[0][0] + ',' + points[0][1]
      for (var i = 1; i < points.length; i++) {
        if (i % 2 == 1)
          path += 'L ' + points[i][0] + ',' + points[i][1]
        if (i % 2 == 0) {
          path += 'A ' + R + ',' + R + ',' + '0,0,0,' + points[i][0] + ',' + points[i][1]
        }
      }
      let svg = d3.select('#' + graph.key).select('#contourView' + graph.key)
      this.svg = svg
      svg.select('path').remove()
      svg.append('path')
        .attr('d', path)
        .attr('fill', graph.setting.color)
        .attr('class', 'groupConvexHull')
        .style('stroke-width', '2px')
        .style('stroke', graph.setting.color)
        .style('fill-opacity', this.$store.state.fillOpacity)
        .style('stroke-opacity', this.$store.state.strokeOpacity)
        .attr('id', 'convexHull' + graph.key)
        .attr('z-index', '-10')
    },
    moveNodes: function(movedNodes) {
      var self = this
      self.nodes.forEach(function(node) {
        if (node.id == movedNodes[0].id) {
          node.x = movedNodes[0].x
          node.y = movedNodes[0].y
          self.id2pos[node['id']] = { 'x': node.x, 'y': node.y }
        }
      })
      let changeList = []
      self.links.forEach(function(link, i) {
        if (link.source.id == movedNodes[0].id) {
          let id = movedNodes[0].id
          link.source.x = self.id2pos[id].x
          link.source.y = self.id2pos[id].y
          link['path'] = self.createPath(link)
        }
        if (link.target.id == movedNodes[0].id) {
          let id = movedNodes[0].id
          link.target.x = self.id2pos[id].x
          link.target.y = self.id2pos[id].y
          link['path'] = self.createPath(link)
        }
      })
    }
  },


}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.svgDiv {
  border-width: 1px;
  border-radius: 6px;
  /*box-shadow: 0px 0px 1px 1px #ddd;*/
  margin: 5px;
}

.active {
  border-color: red;
  box-shadow: 0px 0px 1px 1px red;
  background: white;
}

.notActive {
  border-color: #ddd;
  box-shadow: 0px 0px 1px 1px #ddd;
}

.node:hover {
  cursor: pointer;
}



.dragNode:hover {
  cursor: pointer;
}





/*lasso */

.lasso path {
  stroke: rgb(80, 80, 80);
  stroke-width: 2px;
}

.lasso .drawn {
  fill-opacity: .05;
}

.lasso .loop_close {
  fill: none;
  stroke-dasharray: 4, 4;
}

.lasso .origin {
  fill: gray;
  fill-opacity: .5;
}























/*
.not_possible {
  fill: gray;
}

.possible {
  fill: gray;
}

.selected {
  fill: white;
}*/

</style>
