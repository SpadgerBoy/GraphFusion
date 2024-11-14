<template>
  <div v-bind:class="{ svgDiv2: graph.isList }">
    <button v-if="graph.isList" class="btn" style="float: right;">
      <i class="iconfont icon-delete1"></i>
    </button>
    <svg v-bind:width="graph.setting.width" v-bind:height="graph.setting.height" v-bind:transform="graph.setting.transform" :id="graph.key">
      <!-- <g :id="'lassoView' + graph.key"> </g> -->
      <Contour v-for="contour in contourList" :graph="contour" :key="contour.key"> </Contour>
      <g :id="'canvasView' + graph.key"> </g>
      <g :id="'dragView' + graph.key"> </g>
    </svg>
  </div>
</template>
<script>
import Vue from 'vue'
import { contourExpansion, subgraphNameList } from '../../api/global.js'
import { calConvexHull, copy, getPath } from '../../api/function.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Contour from './Contour.vue'
var cola = require('webcola')
export default {
  name: 'GraphView',
  props: ['graph'],
  components: { Contour },
  data() {
    return {
      simulation: null,
      data: null,
      layout: false,
      isList: true,
      lassoIds: [],
      contourList: [],
      iterNum: 0
    }
  },
  watch: {
    removeAllSubgraphTime: function() {
      for (let i in subgraphNameList) {
        subgraphNameList[i][1] = 0
      }
      this.contourList = []
      d3.select('#' + FusionViewId).select('#contourView' + 'Fusion').selectAll('*').remove()
    },
    removedSubgraphId: function(newValue, oldValue) {
      let index = -1
      for (let i in this.contourList) {
        if (this.contourList[i].key == newValue) {
          index = i
        }
      }
      if (index >= 0) {
        this.contourList.splice(index, 1)
      }
      this.$store.state.removedSubgraphId = null
    },

    forceLayoutSignal: function(newValue, oldValue) {
      this.iterNum = 0
      this.d3cola.start()
    },
    linkDistance: function(newValue, oldValue) {

      // console.log(this.linkDistance, newValue)
      let self = this
      d3.select('#dragView' + self.graph.key).selectAll('path').attr('stroke', null)
      d3.select('#dragView' + self.graph.key).selectAll('path').attr('stroke', null)
      self.d3cola.linkDistance(self.linkDistance * self.graph.setting.width / 1000)
      self.iterNum = 0
      self.d3cola.start()

    },
    linkForce: function(newValue, oldValue) {
      let self = this
      d3.select('#dragView' + self.graph.key).selectAll('path').attr('stroke', null)

      // console.log(this.linkDistance, newValue)
      this.simulation.force("link").strength(function(d) {
        // let force = self.linkForce / Math.min(Math.sqrt(d.source.degree + 1), Math.sqrt(d.target.degree + 1));
        // return force
        return self.linkForce
      })
      // this.simulation.force("link").strength(newValue / 300)
      d3.select('#dragView' + self.graph.key).selectAll('path').attr('stroke', null)
      this.simulation.alpha(1)
      this.simulation.restart()
      this.iterNum = 0
      d3.select('#dragView' + self.graph.key).selectAll('path').attr('stroke', null)
    },

    nodeStrength: function(newValue, oldValue) {
      let self = this
      d3.select('#dragView' + self.graph.key).selectAll('path').attr('stroke', null)

      this.simulation.force("charge").strength(function(d) {
        // let charge = self.nodeStrength / 3 * (d.degree + 1)
        // return -1 * charge
        return -1 * self.nodeStrength
      })
      this.simulation.alpha(0.5)
      this.iterNum = 0
      this.simulation.restart()
    },
    rotateAngle: function(newValue, oldValue) {
      d3.select('#dragView' + this.graph.key).selectAll('path').attr('stroke', null)

      // d3.select('svg#' + this.graph.key).attr("transform", "rotate(" + newValue + ")")
      // d3.select('svg#' + this.graph.key).selectAll('text').attr("transform", "rotate(" + (-1) * newValue + ")")
      // 
      this.rotateView(newValue - oldValue)
    },
    zoomInSubgraph: function() {
      if (this.$store.state.focusSubgraph != null) return
      this.zoomInSubgraphAction(this.graph, 1.1)

    },
    zoomOutSubgraph: function() {
      if (this.$store.state.focusSubgraph != null) return
      this.zoomOutSubgraphAction(this.graph, 1.1)
    },


    rotateStart: function() {
      this.graph.nodes.forEach(d => {
        d.rotateX = d.x
        d.rotateY = d.y
      })
    },

    linkSize: function(newValue, oldValue) {
      d3.select('#dragView' + this.graph.key).selectAll('path').attr('stroke', null)
      this.canvasSvg.selectAll('.link').style('stroke-width', newValue)
    },

    nodeSize: function(newValue, oldValue) {
      let self = this
      d3.select('#dragView' + self.graph.key).selectAll('path').attr('stroke', null)
      this.graph.setting.radius = newValue
      // this.simulation.force('collide').radius(newValue)
      // this.simulation.alpha(1)
      // this.simulation.restart()
      // this.svg.selectAll('.node').selectAll('circle').attr('r', newValue)
      this.canvasSvg.selectAll('.node').selectAll('path').attr('d', function(d) {
        return self.createNodePath(d, newValue)
      })
      this.dragSvg.selectAll('.dragNode').selectAll('path').attr('d', function(d) {
        return self.createNodePath(d, newValue)
      })
      this.canvasSvg.selectAll('.node').selectAll('text').attr('y', -1.4 * newValue)
    },

    labelSize: function(newValue, oldValue) {
      d3.select('#dragView' + this.graph.key).selectAll('path').attr('stroke', null)
      console.log('labelSize')
      this.canvasSvg.selectAll('.node').selectAll('text').style('font-size', newValue + 'em')
    },
    nodeLabel: function(newValue, oldValue) {
      d3.select('#dragView' + this.graph.key).selectAll('path').attr('stroke', null)
      console.log('toggle label')
      if (newValue) {
        d3.selectAll('.node').selectAll('text').attr('visibility', 'visible')
      } else {
        d3.selectAll('.node').selectAll('text').attr('visibility', 'hidden')
      }
    }

  },
  computed: {
    ...mapGetters([
      'zoomInSubgraph',
      'zoomOutSubgraph',
      'removedSubgraphId',
    ]),
    removeAllSubgraphTime: function() {
      return this.$store.state.removeTime
    },
    linkDistance: function() {
      return this.$store.state.linkDistance
    },
    linkForce: function() {
      return this.$store.state.linkForce
    },
    nodeStrength: function() {
      return this.$store.state.nodeStrength
    },
    linkSize: function() {
      return this.$store.state.linkSize
    },
    rotateAngle: function() {
      return this.$store.state.rotateAngle
    },
    rotateStart: function() {
      return this.$store.state.rotateStart
    },

    nodeSize: function() {
      return this.$store.state.nodeSize
    },

    labelSize: function() {
      return this.$store.state.labelSize
    },
    nodeLabel: function() {
      return this.$store.state.nodeLabel
    },
    forceLayoutSignal: function() {
      return this.$store.state.forceLayoutSignal
    }
  },
  mounted: function() {
    var self = this
    self.preprocess()
    self.init()
    self.createView()
    self.createLassoView()
    self.createDragView()
  },
  methods: {
    ...mapActions([
      'addSubgraph',
      'addSubgraphView',
      'updateSubgraphView',
      'moveNode'
    ]),
    preprocess: function() {
      let self = this
      let graph = self.graph
      graph.links.forEach(d => {
        if (typeof(d.source) == 'object') {
          d.source = d.source.id
          d.target = d.target.id
        }
      })
      graph.nodes.forEach(d => {
        if (d.label == undefined)
          d.label = d.id
      })
      if (dataType == 'biology') {
        console.log('biology graph', graph)
        // return
        graph.nodes.forEach(d => {
          d.id = mapId(d.id)
          let prefix = d.label.split('(')[0]
          if (prefix == 'p') {
            d.shape = 'rect'
            d.color = '#95F8FB'
          }
          if (prefix == 'bp') {
            d.shape = 'cross'
            d.color = '#D856EF'
          }
          if (prefix == 'kin' || prefix == 'cat' || prefix == 'tscript' || prefix == 'gtp') {
            d.shape = 'triangle'
            d.color = '#6B2678'
          }
          if (prefix == 'complex') {
            d.shape = 'rect'
            d.color = '#0027BD'
          }
          if (prefix == 'deg') {
            d.shape = 'rect'
            d.color = '#E9AA52'
          }
          if (prefix == 'path') {
            d.shape = 'cross'
            d.color = '#E9AA52'
          }
          if (prefix == 'r') {
            d.shape = 'circle'
            d.color = '#4A7A31'
          }
          if (prefix == 'a') {
            d.shape = 'circle'
            d.color = '#BBD6E2'
          }
        })
        graph.links.forEach(d => {
          if (typeof(d.source) == 'object') {
            console.log('????')
            d.source = d.source.id
            d.target = d.target.id
          } else {
            d.source = mapId(d.source)
            d.target = mapId(d.target)
          }

        })
      } else {
        graph.nodes.forEach(d => {
          d.id = d.id + ''
          d.id = mapId(d.id)
          d.shape = 'circle'
          d.color = 'gray'
        })
        graph.links.forEach(d => {
          d.source = d.source + ''
          d.source = mapId(d.source)
          d.target = d.target + ''
          d.target = mapId(d.target)
        })

      }

      function mapId(idstr) {
        let newstr = ''
        for (let i in idstr) {
          if (idstr[i] != '.' && idstr[i] != ' ' && idstr[i] != ':' && idstr[i] != ')' && idstr[i] != '(' && idstr[i] != '"' && idstr[i] != ',') {
            newstr = newstr + idstr[i]
          } else if (idstr[i] == '.') {
            newstr = newstr + '_'
          }
        }
        return newstr
      }
    },
    init: function() {
      let self = this
      let graph = self.graph
      let idDegree = {}
      graph.links.forEach(d => {
        if (typeof(d.source) == 'object') {
          d.source = d.source.id
          d.target = d.target.id
        }
        if (idDegree[d.source] == undefined) {
          idDegree[d.source] = 0
        }
        if (idDegree[d.target] == undefined) {
          idDegree[d.target] = 0
        }
        idDegree[d.source] += 1
        idDegree[d.target] += 1
      })
      graph.nodes.forEach(d => {
        d.degree = idDegree[d.id]
      })
      graph.rotateAngle = 0
      let nodes = graph.nodes
      let links = graph.links
      let id2link = {}
      let id2node = {}
      for (let i in links) {
        let s = links[i].source
        let t = links[i].target
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
    removeSubgraph(key) {
      let self = this
      let contourList = self.contourList
      let index = 0
      for (let i in contourList) {
        if (contourList[i].key == key) {
          index = i
          break
        }
      }
      contourList.splice(index, 1)
    },
    createView: function() {
      var self = this
      let graph = self.graph
      console.log('load graph:', graph)
      let radius = self.nodeSize
      let width = graph.setting.width
      let height = graph.setting.height
      let fixedLayout = false
      if ('x' in graph.nodes[0]) {
        graph.nodes.forEach(d => { d.fixed = true })
        fixedLayout = true
        let xdomain = d3.extent(graph.nodes, d => {
          return d.x
        })
        let ydomain = d3.extent(graph.nodes, d => {
          return d.y
        })
        let smallW = xdomain[1] - xdomain[0]
        let smallH = ydomain[1] - ydomain[0]

        let avr_x = d3.sum(graph.nodes, d => {
          return d.x
        }) / graph.nodes.length

        let avr_y = d3.sum(graph.nodes, d => {
          return d.y
        }) / graph.nodes.length

        graph.nodes.forEach(d => {
          d.x = d.x - avr_x + width / 2
          d.fx = d.x
        })

        graph.nodes.forEach(d => {
          d.y = d.y - avr_y + height / 2
          d.fy = d.y
        })
        // let xscale = d3.scaleLinear().domain(xdomain).range([radius, width - radius])
        // graph.nodes.forEach(d => {
        //   d.fx = xscale(d.fx)
        //   d.x = d.fx
        // })

        // let yscale = d3.scaleLinear().domain(ydomain).range([radius, height - radius])
        // graph.nodes.forEach(d => {
        //   d.fy = yscale(d.fy)
        //   d.y = d.fy
        // })
      }

      // var simulation = d3.forceSimulation()
      //   .force("link", d3.forceLink().id(function(d) { return d.id; })
      //     .distance(function(d) {
      //       // let distance = self.linkDistance * Math.min(d.source.degree + 1, d.target.degree + 1)
      //       // return distance
      //       return self.linkDistance
      //     })
      //     .strength(function(d) {
      //       // let force = self.linkForce / Math.min(Math.sqrt(d.source.degree + 1), Math.sqrt(d.target.degree + 1));
      //       // return force
      //       return self.linkForce
      //     })
      //   )
      //   .force("charge", d3.forceManyBody().strength(function(d) {
      //     // let charge = self.nodeStrength / 3 * (d.degree + 1)
      //     // return -1 * charge
      //     return -1 * self.nodeStrength
      //   }))
      //   .force("center", d3.forceCenter(width / 2, height / 2))
      //   .force('collide', d3.forceCollide(graph.setting.radius))
      // simulation.alpha(alpha)
      // self.simulation = simulation
      // simulation
      //   .nodes(graph.nodes)
      //   .on("tick", ticked)
      //   .on("end", function() {
      //     console.log('force layout end')
      //     graph.nodes.forEach(d => {
      //       if ('fx' in d) {
      //         delete d.fx
      //         delete d.fy
      //       }
      //     })
      //     self.$store.state.satisfiedGlobalLayout = copy(graph)
      //   })
      // simulation.force("link")
      //   .links(graph.links)
      let ids = []
      graph.nodes.forEach(d => {
        ids.push(d.id)
      })
      graph.links.forEach(d => {
        d.source = ids.indexOf(d.source)
        d.target = ids.indexOf(d.target)
      })

      var d3cola = cola.d3adaptor(d3)
        .linkDistance(self.linkDistance * (width / 1000))
        .size([width, height])

      self.d3cola = d3cola

      d3cola.nodes(graph.nodes)
        .links(graph.links)
      // .start()
      if (!fixedLayout) {
        self.iterNum = 0
        d3cola.start()

      } else {
        graph.links.forEach(d => {
          d.source = graph.nodes[d.source]
          d.target = graph.nodes[d.target]
        })
      }

      d3cola.on('tick', ticked)
      d3cola.on('end', function() {
        forceEndAction()
      })

      let svg = d3.select('#' + graph.key).select('#canvasView' + graph.key)

      let svg_g = svg.append('g')
      self.canvasSvg = svg_g

      let link = svg_g.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", 2)
        .attr('class', function(d) {
          return d.source.id + ' ' + d.target.id + ' link'
        })

      let nodeg = svg_g.selectAll('.node')
        .data(graph.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('id', d => {
          return 'canvasNode' + d.id
        })

      console.log('viewGraph:', graph)

      nodeg.append("path")
        .attr('d', d => {
          return self.createNodePath(d, radius)
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
      if (fixedLayout) {
        initDrawView()
        forceEndAction()
      }

      function ticked() {
        self.iterNum = self.iterNum + 1
        graphSizeRescale(graph, width, height, radius)
        self.$store.state.updateContourSignal = Math.random()
        updateView()

      }

      function forceEndAction() {
        graph.nodes.forEach(d => {
          delete d.bounds
          delete d.variable
          delete d.fixed
        })
        self.$store.state.forceGlobalLayout = copy(graph)

        if (window.loadDataFromServer) {
          let subgraphs = graph.subgraphs
          if (subgraphs != undefined && subgraphs.length > 0 && subgraphs[0]['nodes'] != undefined) {
            for (let i in subgraphs) {
              let ids = subgraphs[i]['ids']
              let key = subgraphs[i]['key']
              let subgraph = self.getSubgraph(self.graph.nodes, self.graph.links, ids)
              // let subgraph = {'nodes': subgraphs[i]['nodes'], 'links': subgraphs[i]['links']}
              subgraph.key = key
              console.log(subgraph)
              for (let i in subgraphNameList) {
                if (subgraphNameList[i][0] == key) {
                  subgraphNameList[i][1] = 1
                }
              }
              subgraph.context = FusionViewId
              subgraph.setting = {}
              subgraph.setting.radius = self.$store.state.nodeSize
              subgraph.setting.color = contourColor(subgraph.key)
              subgraph.setting.boxShadow = "0px 0px 1px 1px #ddd"
              subgraph.setting.borderColor = '#ddd'
              subgraph.zoomScale = 1
              subgraph.rotateAngle = 0

              self.contourList.push(subgraph)

              let subgraphData = copy(subgraph)
              subgraphData['nodes'] = subgraphs[i]['nodes']
              subgraphData['links'] = subgraphs[i]['links']

              self.addSubgraph(subgraphData) //
              self.addSubgraphView(copy(subgraphData))
            }
          }
          window.loadDataFromServer = false
        }

      }

      function initDrawView() {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        nodeg.attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })

        graph.nodes.forEach(d => {
          d.copyx = d.x
          d.copyy = d.y
          delete d.fixed
        })
        fixedLayout = false
      }

      function updateView() {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        nodeg.attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })

        d3.select('#dragView' + graph.key).selectAll('.dragNode').attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })

        d3.selectAll('.lassoNode').attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        graph.nodes.forEach(d => {
          d.copyx = d.x
          d.copyy = d.y
        })
      }

      function graphSizeRescale(graph, width, height, radius) {
        let nodes = graph.nodes
        let xdomain = d3.extent(nodes, d => {
          return d.x
        })
        let ydomain = d3.extent(nodes, d => {
          return d.y
        })
        if (xdomain[0] < radius || xdomain[1] > width - radius) {
          // let xscale = d3.scaleLinear().domain(xdomain).range([radius, width - radius])
          nodes.forEach(d => {
            // d.x = xscale(d.x)
            if (d.x < radius) {
              d.x = radius
            }
            if (d.x > width - radius) {
              d.x = width - radius
            }
          })

        }
        if (ydomain[0] < radius || ydomain[1] > height - radius) {
          // let yscale = d3.scaleLinear().domain(ydomain).range([radius, height - radius])
          // nodes.forEach(d => {
          //   d.y = yscale(d.y)
          // })
          nodes.forEach(d => {
            if (d.y < radius) {
              d.y = radius
            }
            if (d.y > height - radius) {
              d.y = height - radius
            }
          })
        }

      }

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
    },
    zoomInSubgraphAction(graph, factor) {
      let self = this
      let centerX = 0,
        centerY = 0

      let nodes = graph.nodes

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
        d.x = (d.x - centerX) * factor + centerX
        d.y = (d.y - centerY) * factor + centerY
      })

      self.viewUpdate()
      self.$store.state.globalGraphResize = Math.random()

      let satisfiedGraph = self.$store.state.forceGlobalLayout
      centerX = 0
      centerY = 0

      let snodes = satisfiedGraph.nodes
      for (let i in snodes) {
        centerX = centerX + snodes[i].x
        centerY = centerY + snodes[i].y
      }
      centerX = centerX / snodes.length
      centerY = centerY / snodes.length
      satisfiedGraph.centerX = centerX
      satisfiedGraph.centerY = centerY
      satisfiedGraph.zoomScale = satisfiedGraph.zoomScale * factor
      snodes.forEach(d => {
        d.x = (d.x - centerX) * factor + centerX
        d.y = (d.y - centerY) * factor + centerY
      })

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
      graph.centerX = centerX
      graph.centerY = centerY
      graph.zoomScale = graph.zoomScale / factor
      nodes.forEach(d => {
        d.x = (d.x - centerX) / factor + centerX
        d.y = (d.y - centerY) / factor + centerY
      })
      self.viewUpdate()
      self.$store.state.globalGraphResize = Math.random()


      // let satisfiedGraph = self.$store.state.satisfiedGlobalLayout
      // centerX = 0
      // centerY = 0

      // let snodes = satisfiedGraph.nodes
      // for (let i in snodes) {
      //   centerX = centerX + snodes[i].x
      //   centerY = centerY + snodes[i].y
      // }
      // centerX = centerX / snodes.length
      // centerY = centerY / snodes.length
      // satisfiedGraph.centerX = centerX
      // satisfiedGraph.centerY = centerY
      // satisfiedGraph.zoomScale = satisfiedGraph.zoomScale / factor
      // snodes.forEach(d => {
      //   d.x = (d.x - centerX) / factor + centerX
      //   d.y = (d.y - centerY) / factor + centerY
      // })
    },


    createNodePath(node, radius) {
      let type = node.shape
      let path = ''
      if (type == 'rect') {
        let p1 = [-1 * radius, -1 * radius]
        let p2 = [radius, -1 * radius]
        let p3 = [radius, radius]
        let p4 = [-1 * radius, radius]
        path = 'M' + p1.join(',') + 'L' + p2.join(',') + 'L' + p3.join(',') + 'L' + p4.join(',') + 'Z'
      }
      if (type == 'triangle') {
        let r = radius * 1.5
        let p1 = [0, -1 * r]
        let p2 = [r * Math.cos(Math.PI / 6), r * Math.sin(Math.PI / 6)]
        let p3 = [-1 * r * Math.cos(Math.PI / 6), r * Math.sin(Math.PI / 6)]
        path = 'M' + p1.join(',') + 'L' + p2.join(',') + 'L' + p3.join(',') + 'Z'
      }
      if (type == 'circle') {
        path = 'M' + '0, 0' +
          'm ' + (-1) * radius + ',0' +
          'a ' + radius + ',' + radius + ' 0 1, 0 ' + (radius * 2) + ',0' +
          'a ' + radius + ',' + radius + ' 0 1, 0 ' + (-1 * radius * 2) + ',0'
        // console.log(path)
      }
      if (type == 'cross') {
        let r = radius * 2 / 3
        let p1 = [-1 * r / 2, -1 * radius]
        let p2 = [r / 2, -1 * radius]
        let p3 = [r / 2, -1 * r / 2]
        let p4 = [radius, -1 * r / 2]
        let p5 = [radius, r / 2]
        let p6 = [r / 2, r / 2]
        let p7 = [r / 2, radius]
        let p8 = [-1 * r / 2, radius]
        let p9 = [-1 * r / 2, r / 2]
        let p10 = [-1 * radius, r / 2]
        let p11 = [-1 * radius, -1 * r / 2]
        let p12 = [-1 * r / 2, -1 * r / 2]
        path = 'M' + p1.join(',') + 'L' + p2.join(',') + 'L' + p3.join(',') +
          'L' + p4.join(',') + 'L' + p5.join(',') +
          'L' + p6.join(',') + 'L' + p7.join(',') +
          'L' + p8.join(',') + 'L' + p9.join(',') +
          'L' + p9.join(',') + 'L' + p10.join(',') +
          'L' + p11.join(',') + 'L' + p12.join(',') + 'Z'
      }
      node.path = path
      return path
    },
    nodeInContour(x, y, id, graph) {
      let points = calConvexHull(graph, graph.setting.radius * 2) // outer bondary
      y = -1 * y
      let clen = points.length
      let n = 0
      // 到处是对象
      for (let i = 0; i < clen - 1; i++) {
        let p1 = points[i]
        let p2 = points[(i + 1) % clen]
        let p1x = p1[0],
          p1y = -1 * p1[1]
        let p2x = p2[0],
          p2y = -1 * p2[1]

        if (p1y == p2y)
          continue

        if (y < Math.min(p1y, p2y)) continue
        if (y > Math.max(p1y, p2y)) continue

        let px = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
        if (px > x) n += 1

      }
      return n % 2 == 1
    },
    createLassoView: function() {
      let self = this
      let graph = self.graph
      let svg = d3.select('#' + graph.key)
      let nodes = graph.nodes
      let nodeg = svg.selectAll('.lassoNode')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'lassoNode')
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        .attr('id', d => { return 'lassoNode' + d.id })
      let radius = this.$store.state.nodeSize

      let circles = nodeg
        .append("circle")
        .attr("r", 0.2)
        .attr("fill", "gray")
        .attr('id', function(d) {
          return d.id
        })

      var lasso_start = function() {
        lasso.items()
          // .attr("r", 1) // reset size
          .classed("not_possible", true)
          .classed("selected", false);
      };

      var lasso_draw = function() {

        // Style the possible dots
        lasso.possibleItems()
          .classed("not_possible", false)
          .classed("possible", true);

        // Style the not possible dot
        lasso.notPossibleItems()
          .classed("not_possible", true)
          .classed("possible", false);
      };

      var lasso_end = function() {
        // Reset the color of all dots
        lasso.items()
          .classed("not_possible", false)
          .classed("possible", false)

        let ids = []
        lasso.selectedItems().each(function(d) {
          ids.push(d.id)
        })

        if (ids.length < 2) return

        let subgraph = self.getSubgraph(nodes, self.graph.links, ids)
        for (let i in subgraphNameList) {
          if (subgraphNameList[i][1] == 0) {
            subgraph.key = subgraphNameList[i][0]
            subgraphNameList[i][1] = 1
            break
          }
        }

        subgraph.context = FusionViewId
        subgraph.setting = {}
        subgraph.setting.radius = self.$store.state.nodeSize
        subgraph.setting.color = contourColor(subgraph.key)
        subgraph.setting.boxShadow = "0px 0px 1px 1px #ddd"
        subgraph.setting.borderColor = '#ddd'
        subgraph.zoomScale = 1
        subgraph.rotateAngle = 0
        self.contourList.push(subgraph)
        self.addSubgraph(copy(subgraph)) // 这里要用copy，不然改变subgrph子图的内容发生巨大变化
        self.addSubgraphView(copy(subgraph))
        // self.$store.state.focusSubgraph = subgraph.key
        // 不同组件通信，需要制定
      }

      var lasso = d3.lasso()
        .closePathSelect(true)
        .closePathDistance(100)
        .items(circles)
        .targetArea(svg)
        .on("start", lasso_start)
        .on("draw", lasso_draw)
        .on("end", lasso_end);

      svg.call(lasso)
    },
    createDragView: function() {
      console.log('create drag view')
      let self = this
      let graph = self.graph
      let radius = graph.setting.radius
      let width = graph.setting.width
      let height = graph.setting.height
      let drag_svg = d3.select('#' + graph.key).select('#dragView' + graph.key)
      self.dragSvg = drag_svg
      let drag_nodeg = drag_svg.selectAll('.dragNode')
        .data(graph.nodes)
        .enter()
        .append('g')
        .attr('class', 'dragNode')
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        .on('click', d => {
          d3.select('#path' + d.id).attr('stroke', 'red')
          if (self.$store.state.clickedNode1 == null) {
            self.$store.state.clickedNode1 = d.id
          } else {
            self.$store.state.clickedNode2 = d.id
            self.createNewContour()
            self.$store.state.clickedNode1 = null
            self.$store.state.clickedNode2 = null
          }
        })
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))


      drag_nodeg.append("path")
        .attr('d', d => {
          return self.createNodePath(d, radius)
        })
        .attr('fill', d => {
          return 'red'
        })
        .attr('id', d => {
          return 'path' + d.id
        })
        .attr('fill-opacity', 0.01)

      drag_nodeg.append('title').text(d => {
        return d.label
      })

      function dragstarted(d) {
        self.$store.state.dragNodeEventStop = false
        self.$store.state.updatedSubgraphIds = []
      }

      function dragged(d) {
        d.x = d3.event.x
        d.y = d3.event.y
        if (d.x < 0) d.x = radius
        if (d.x > width) d.x = width - radius
        if (d.y < 0) d.y = radius
        if (d.y > height) d.y = height - radius
        let x = d.x
        let y = d.y
        d3.select(this).attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        d3.select('#canvasView' + graph.key).select('#canvasNode' + d.id).attr('transform', function(d) {
          return 'translate(' + x + ',' + y + ')'
        })
        // console.log(d3.selectAll('.lassoNode').select('#lassoNode' + d.id))
        d3.select('#lassoNode' + d.id).attr('transform', function(d) {
          return 'translate(' + x + ',' + y + ')'
        })

        // d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y)
        d3.select('#canvasView' + graph.key).selectAll('.link').attr("x1", function(line) { return line.source.x; })
          .attr("y1", function(line) { return line.source.y; })
          .attr("x2", function(line) { return line.target.x; })
          .attr("y2", function(line) { return line.target.y; });

        self.moveNodeResponse(d.id, d.x, d.y)

        // for (let i in self.contourList) {
        //   let contour = self.contourList[i]
        //   let flag = false
        //   // self.moveNode({ 'id': d.id, 'position': [d.x, d.y] })
        //   for (let j in contour.nodes) {
        //     if (contour.nodes[j].id == d.id) {
        //       self.updateContour(contour.key)
        //     }
        //   }
        // }
      }

      function dragended(d) {
        d.x = d3.event.x
        d.y = d3.event.y
        let x = d.x
        let y = d.y
        let id = d.id
        let contourList = self.contourList
        let lastFocus = null
        self.moveNodeResponse(d.id, d.x, d.y)
        for (let i in contourList) {
          let contour = contourList[i]
          let flag = false
          for (let j in contour.nodes) {
            if (contour.nodes[j].id == d.id) {
              flag = true
              let ids = []
              contour.nodes.forEach(d => {
                ids.push(d.id)
              })
              let setting = contour.setting
              let new_contour = self.getSubgraph(self.graph.nodes, self.graph.links, ids)
              new_contour.key = contour.key
              new_contour.setting = setting
              new_contour.zoomScale = contour.zoomScale
              self.updateSubgraphView(copy(new_contour))
              self.$store.state.updatedSubgraphIds.push(contour.key)
            }
          }
          if (flag) continue

          if (self.nodeInContour(x, y, id, contour)) {
            let ids = []
            ids.push(id)
            contour.nodes.forEach(d => {
              ids.push(d.id)
            })
            let setting = contour.setting
            let new_contour = self.getSubgraph(self.graph.nodes, self.graph.links, ids)
            new_contour.key = contour.key
            new_contour.setting = setting
            new_contour.zoomScale = 1
            Vue.set(self.contourList, i, new_contour)
            self.updateSubgraphView(copy(new_contour))
            self.$store.state.updatedSubgraphIds.push(contour.key)
          }
        }
        self.$store.state.dragNodeEventStop = true
        self.$store.state.updateSubgraphSignal = Math.random()

      }
    },
    createNewContour() {
      let self = this
      let id1 = self.$store.state.clickedNode1
      let id2 = self.$store.state.clickedNode2
      let ids = getPath(id1, id2, self.graph)

      d3.select('#dragView' + self.graph.key).selectAll('path').attr('stroke', null)

      if (ids.length < 2) return

      let subgraph = self.getSubgraph(self.graph.nodes, self.graph.links, ids)
      for (let i in subgraphNameList) {
        if (subgraphNameList[i][1] == 0) {
          subgraph.key = subgraphNameList[i][0]
          subgraphNameList[i][1] = 1
          break
        }
      }

      subgraph.context = FusionViewId
      subgraph.setting = {}
      subgraph.setting.radius = self.$store.state.nodeSize
      subgraph.setting.color = contourColor(subgraph.key)
      subgraph.setting.boxShadow = "0px 0px 1px 1px #ddd"
      subgraph.setting.borderColor = '#ddd'
      subgraph.zoomScale = 1
      subgraph.contourType = 'linear'
      // subgraph.setting.background = 'red'
      console.log(subgraph)
      // self.createContour(subgraph)
      self.contourList.push(subgraph)
      self.addSubgraphView(copy(subgraph)) // 这里要用copy，不然改变subgrph子图的内容发生巨大变化
    },
    moveNodeResponse(id, x, y) {
      let self = this
      // console.log('move node', x, y)
      self.$store.state.movedNode = id + ' ' + 'null' + ' ' + 'self' + ' ' + Math.random()
      // 拖拽一下可能在1s以内... 字符串就不变了
      // 
      // self.$store.state.updateContourSignal = new Date()
      // id, key, 区分是drag 移动还是由于 右侧list引起的
      // 
    },
    rotateView: function(angle) {
      if (this.$store.state.focusSubgraph != null) return
      let self = this
      let centerX = self.graph.setting.width / 2
      let centerY = self.graph.setting.height / 2
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
      this.$store.state.updateContourSignal = Math.random()

      // let satisfiedGraph = self.$store.state.satisfiedGlobalLayout
      // centerX = satisfiedGraph.setting.width / 2
      // centerY = satisfiedGraph.setting.height / 2
      // satisfiedGraph.nodes.forEach(d => {
      //   let x = d.x
      //   let y = d.y
      //   x = x - centerX
      //   y = y - centerY
      //   d.x = x * Math.cos(angle) + y * Math.sin(angle)
      //   d.y = -1 * x * Math.sin(angle) + y * Math.cos(angle)
      //   d.x = d.x + centerX
      //   d.y = d.y + centerY
      // })

    },
    getSubgraph: function(nodes, links, ids) {
      let id2node = this.id2node
      let id2link = this.id2link
      let new_nodes = []
      for (let i in ids) {
        let id = ids[i]
        new_nodes.push(id2node[id])
      }
      // console.log(id2link)
      let new_links = []
      for (let i = 0; i < new_nodes.length; i++) {
        let s = new_nodes[i].id
        for (let j = i + 1; j < new_nodes.length; j++) {
          let t = new_nodes[j].id
          // console.log(s,t,id2link[s + ',' + t])
          if (id2link[s + ',' + t] || id2link[t + ',' + s]) {
            let link = {}
            link.source = {}
            link.source.id = s
            link.source.x = new_nodes[i].x
            link.source.y = new_nodes[i].y
            link.target = {}
            link.target.id = t
            link.target.x = new_nodes[j].x
            link.target.x = new_nodes[j].y
            new_links.push(link)
          }
        }
      }
      return { 'nodes': new_nodes, 'links': new_links }
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.svgDiv2 {
  border-width: 1px;
  border-radius: 6px;
  border-color: #ddd;
  box-shadow: 0px 0px 1px 1px #ddd;
  margin: 5px;
}

.node:hover {
  cursor: pointer;
}

.dragNode:hover {
  cursor: pointer;
}

.node text {
  font-size: 0.8em;
  text-anchor: middle;
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
