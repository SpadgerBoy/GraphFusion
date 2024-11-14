<template>
  <div id="graphFusionView" ref='graphFusionView'>
    <div id='buttonlist2' style="width: 100%">
      <!-- <el-tooltip v-for="icon in icons" :open-delay="800" transition="null" :content="icon.content" placement="top" effect="light" :key="icon.clas">
        <button class="btn" :id="icon.clas" :class="{'clicked': icon.active}" v-on:click="handleEvent(icon.clas, icon.active)">
          <i class="iconfont" :class="['icon-' + icon.clas]"></i>
        </button>
      </el-tooltip> -->
      <span v-for="label in labelIcons" class='labelIcon' :class="{'labelClicked': label.active}" @click="clickLabel(label.text)">
        {{ label.text }}
      </span>
    </div>
    <div id="fusionView" ref="fusionView">
      <WholeGraph v-for="graph in fakeGraphList" :graph="graph" :key="graph.key">
      </WholeGraph>
    </div>
    <div style="position: absolute; bottom: 5px; left: 90%">
      {{ 'iteration:  ' + iterNum }}
    </div>
    <LayoutConfig v-if="showConfig"></LayoutConfig>
    <SaveLayout> </SaveLayout>
    <Slider> </Slider>
  </div>
</template>
<script>
import Vue from 'vue'
import WholeGraph from './Graph/WholeGraph.vue'
import { subgraphNameList } from '../api/global.js'
import { getSubGraphs } from '../api/GetSubGraph.js'

import { transformPosition, copy } from '../api/function.js'
import LayoutConfig from '@/components/LayoutConfig'
import SaveLayout from '@/components/Popup/SaveLayout'
import Slider from '@/components/Popup/Slider'
import { mapActions } from 'vuex'
import * as saveSvgAsPng from 'save-svg-as-png'
import metabolicGraph from '../assets/metabolic.js'
import '../api/numeric.js'
// import graphA from '../assets/a.data.js'
// import graphB from '../assets/b.data.js'
// import graphC from '../assets/c.data.js'
// import graphD from '../assets/d.data.js'
// import graphE from '../assets/e.data.js'
// import graphF from '../assets/f.data.js'
// import graphG from '../assets/g.data.js'
// import graphOther from '../assets/other.data.js'
import { biologyA, biologyB } from '../assets/biological.js'
// 从创建到挂载，是从外到内，再从内到外
export default {
  name: 'GraphFusionView',
  components: { WholeGraph, LayoutConfig, SaveLayout, Slider },
  data() {
    return {
      graphFusion: { 'key': 'Fusion', 'type': 'normal' },
      fakeGraphList: [],
      viewWidth: 0,
      viewHeight: 0,
      alphaMax: 500,
      iterNum: 0,
      icons: [
        // { 'clas': 'lasso', 'content': 'Lasso Layout', 'active': false },
        // { 'clas': 'pan', 'content': 'Pan Layout', 'active': false },
        { 'clas': 'refresh', 'content': 'Update Layout', 'active': false },
        { 'clas': 'save', 'content': 'Save Layout', 'active': false },
        { 'clas': 'label', 'content': 'Node Label', 'active': true },
        { 'clas': 'reset', 'content': 'Reset Layout', 'active': false },
        { 'clas': 'setting', 'content': 'Layout Method', 'active': false },
      ],
      value: 30,
      min: 1,
      max: 100,
      labelIcons: [
        { 'text': 'FD Layout', 'active': false },
        { 'text': 'Laplacian Layout', 'active': false },
        { 'text': 'Config', 'active': false },
        { 'text': 'Save', 'active': false },
        { 'text': 'Export', 'active': false }

      ],
      showConfig: false,
      iterationThreshold: 0.00005,
      iterationLowNumber: 100,
      iterationUpNumber: 999,
    }
  },
  mounted: function() {
    var self = this
    let height = self.$el.offsetHeight
    let width = self.$el.offsetWidth
    // let height = this.$refs.fusionView.offsetHeight
    // let width = this.$refs.fusionView.offsetWidth
    let graphFusion = self.graphFusion
    self.viewHeight = height
    self.viewWidth = width
    console.log(self.viewWidth, self.viewHeight)
    graphFusion.key = 'Fusion'
    window.FusionViewId = 'Fusion'
    let setting = { 'width': self.viewWidth, 'height': self.viewHeight - 30 }
    setting.radius = this.$store.state.nodeSize
    graphFusion.setting = setting
    window.dataType = 'normal'
    if (self.$store.state.loadedGraphData == null) {
      // {
      //   let graphs = [biologyA, biologyB]
      //   let data = self.constructGraph(graphs)
      //   console.log(data)
      //   graphFusion.nodes = data.nodes
      //   graphFusion.links = data.links
      //   self.fakeGraphList.push(graphFusion)
      //   self.$store.state.finalGraphLayout = graphFusion
      // }
      // let Url = 'getPublicGraphData'
      // let options = {} 
      // let paramsObj = {'graphId': 95 }
      // CommunicateWithServer('get', paramsObj, Url, data => {
      //   self.$store.state.loadedGraphData = data['publicGraphData'][0][0]
      //   self.$store.state.loadedGraphDataSignal = Math.random()
      // })
      // var path = 'static/Fusion.json'
      var path = 'static/A.json'
      d3.json(path, function(err, data) {
        if (data['graph'] != undefined) {
          graphFusion.nodes = data['graph'].nodes
          graphFusion.links = data['graph'].edges
          dataType = 'biology'
          self.fakeGraphList.push(graphFusion)
          self.$store.state.finalGraphLayout = graphFusion
        } else {
          graphFusion.nodes = data.nodes
          graphFusion.links = data.links
          self.fakeGraphList.push(graphFusion)
          self.$store.state.finalGraphLayout = graphFusion
        }
      })
    }
  },
  watch: {
    loadedGraphDataSignal: function(newData, oldData) {
      console.log('update view')
      let self = this
      // self.$store.state.removeTime = Math.random()
      self.$store.state.subgraphViewList = []
      self.$store.state.subgraphList = []
      for (let i in subgraphNameList) {
        subgraphNameList[i][1] = 0
      }
      newData = self.$store.state.loadedGraphData
      let graph = JSON.parse(newData)
      let graphFusion = self.graphFusion
      graphFusion.nodes = graph.nodes
      graphFusion.links = graph.links
      graphFusion.subgraphs = graph.subgraphs
      dataType = 'normal'
      window.FusionViewId = 'Fusion' + (Math.random() + '').split('.')[1]
      graphFusion.key = window.FusionViewId
      window.loadDataFromServer = true
      self.setConfig(graph.config)
      self.fakeGraphList = []
      self.fakeGraphList.push(graphFusion)
      self.graphFusion = graphFusion
      self.$store.state.finalGraphLayout = graphFusion
      self.showConfig = false
    }
  },
  computed: {
    subgraphList: function() {
      return this.$store.state.subgraphList
    },
    loadedGraphDataSignal: function() {
      return this.$store.state.loadedGraphDataSignal
    },
    loadedGraphData: function() {
      return this.$store.state.loadedGraphData
    }
  },
  methods: {
    ...mapActions([
      'removeAllSubgraph',
    ]),
    constructGraph: function(graphs) {
      let nodes = []
      let links = []
      let ids = []
      for (let i in graphs) {
        let gnodes = graphs[i]['nodes']
        let glinks = graphs[i]['links']
        for (let j in gnodes) {
          if (ids.indexOf(gnodes[j]) < 0) {
            ids.push(gnodes[j])
            nodes.push({ 'id': gnodes[j], 'label': gnodes[j] })
          }
        }
        for (let j in glinks) {
          links.push({ 'source': glinks[j][0], 'target': glinks[j][1] })
        }
      }
      return { 'nodes': nodes, 'links': links }
    },
    setConfig: function(config) {
      if (config == undefined) return
      this.$store.state.nodeSize = config.nodeSize
      this.$store.state.labelSize = config.labelSize
      this.$store.state.linkSize = config.linkSize
      this.$store.state.rotateAngle = config.rotateAngle
      this.$store.state.alpha = config.alpha
      this.$store.state.nodeLabel = config.nodeLabel
    },
    clickLabel: function(label) {
      if (label == 'Laplacian Layout') {
        this.showConfig = false
        this.labelIcons.forEach(d => {
          if (d.text == 'Config') {
            d.active = false
          }
        })
        this.refresh()
      }
      if (label == 'Config') {
        this.showConfig = !this.showConfig
        this.labelIcons.forEach(d => {
          if (d.text == 'Config') {
            d.active = !d.active
          }
        })
      }
      if (label == 'Save') {
        this.$store.state.saveFormVisible = true
      }
      if (label == 'FD Layout') {
        this.$store.state.forceLayoutSignal = Math.random()
      }
      // if (label == 'Exprot') {
      //   let svgXml = d3.select('#' + this.graphFusion.key).html()
      //   // console.log(svgXml)
      //   let canvas = document.createElement('canvas')
      //   canvas.width = this.graphFusion.setting.width
      //   canvas.height = this.graphFusion.setting.height
      //   canvg(canvas, svgXml)
      //   var a = document.createElement('a')
      //   a.href = canvas.toDataURL('image/png'); //将画布内的信息导出为png图片数据
      //   a.download = this.$store.state.graphName.split(' ').join('_') //设定下载名称
      //   a.click(); //点击触发下载
      //   d3.select('canvas').remove()
      //   d3.select('a').remove()
      // }
      // 
      if (label == 'Export') {
        // let key = 'Fusion'
        // let obj = this.graphFusion
        // var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

        // var eleLink = document.createElement('a')
        // eleLink.href = "data:" + data
        // eleLink.download = key + '.json'
        // eleLink.click();
        // return
        let name = this.$store.state.graphName.split(' ').join('_')
        saveSvgAsPng.saveSvgAsPng(document.getElementById(this.graphFusion.key), name + ".png", { scale: 0.5 });
      }
    },
    mergeGraph: function(graphFusion, graph) {
      console.log('mergeGraph:', graphFusion)
      let nodesFusion = graphFusion.nodes
      let linksFusion = graphFusion.links
      let indexLinks = []
      for (let i in linksFusion) {
        indexLinks.push(linksFusion[i][0] + ',' + linksFusion[i][1])
        indexLinks.push(linksFusion[i][1] + ',' + linksFusion[i][0])
      }
      for (let i in graph.nodes) {
        if (nodesFusion.indexOf(graph.nodes[i]) < 0) {
          nodesFusion.push(graph.nodes[i])
        }
      }
      let existLinks = []
      for (let i in graph.links) {
        let s = graph.links[i][0]
        let t = graph.links[i][1]
        existLinks.push(s + ',' + t)
        existLinks.push(t + ',' + s)
      }
      if (graph.key != 'Plus') {
        for (let i = 0; i < graph.nodes.length; i++) {
          for (let j = i + 1; j < graph.nodes.length; j++) {
            let s = graph.nodes[i]
            let t = graph.nodes[j]
            let st = s + ',' + t
            let ts = t + ',' + s
            if (indexLinks.indexOf(s + ',' + t) < 0 && indexLinks.indexOf(t + ',' + s) < 0) {
              if (existLinks.indexOf(st) < 0 && existLinks.indexOf(ts) < 0)
                linksFusion.push([s, t, 'virtual'])
              else linksFusion.push([s, t, 'real'])
            }
          }

        }
      } else {
        for (let i in graph.links) {
          let s = graph.links[i][0]
          let t = graph.links[i][1]
          if (indexLinks.indexOf(s + ',' + t) < 0 && indexLinks.indexOf(t + ',' + s) < 0) {
            linksFusion.push([graph.links[i][0], graph.links[i][1], 'real']) // 0 real edge, 1 virtual edge
          }
        }
      }
      graphFusion['nodes'] = nodesFusion
      graphFusion['links'] = linksFusion
      return graphFusion
    },
    // 将graph中的信息格式化为新的json数据，摒弃掉一部分信息
    extract: function(graph) {
      let new_nodes = []
      let new_links = []
      for (let i in graph.nodes) {
        let node = {}
        node['name'] = graph.nodes[i].id
        node['position'] = [graph.nodes[i].x, graph.nodes[i].y]
        new_nodes.push(node)
      }
      for (let i in graph.links) {
        let link = {}
        link.source = graph.links[i].source.id
        link.target = graph.links[i].target.id
        new_links.push(link)
      }
      return { 'nodes': new_nodes, 'links': new_links, 'scale': graph.setting.scale }
    },

    handleEvent: function(iconId, active) {
      let index = 0
      for (let i in this.icons) {
        if (this.icons[i].clas == iconId) {
          this.icons[i].active = !this.icons[i].active
          active = this.icons[i].active
          index = i
        }
      }
      if (iconId == 'label') {
        if (active) {
          d3.selectAll('.node').select('text').attr('visibility', 'visible')
        } else {
          d3.selectAll('.node').select('text').attr('visibility', 'hidden')
        }
      }
      if (iconId == 'refresh') {
        this.icons[index].active = false
        this.refresh()
      }
      if (iconId == 'reset') {
        this.icons[index].active = false
        this.resetView()
      }
    },
    refresh: function() {
      console.log('update layout')
      let self = this
      let graph
      let subgraphs = []
      let initNodes = []
      let subgraphList = self.subgraphList
      
      // console.log('subgraphList:',JSON.parse(JSON.stringify(subgraphList)))
      
      {
        var subgraphs11 = getSubGraphs(self.$store.state.forceGlobalLayout, 5)
        subgraphList = [JSON.parse(JSON.stringify(subgraphs11[0]))]
        console.log('subgraphs:', subgraphList)
        // subgraphList = subgraphs11
      }
      
      // 将子图的节点坐标加入主图
       { 
          subgraphList[0].nodes.forEach(node => {
            // console.log(node.x , node.y)
             const mainNode = self.graphFusion.nodes.find(n => n.id === node.id);
             if (mainNode) {
               mainNode.x = node.x;
               mainNode.y = node.y;
               
             }
          });
       }
      
      if (subgraphList.length == 0) return
      for (let i = 0; i < subgraphList.length; i++) {
        subgraphs.push(self.extract(subgraphList[i]))
      }

      {
        let new_nodes = self.extract(self.$store.state.forceGlobalLayout).nodes //将全局graph变成面板，应该放入函数中
        // 这样效率太低
        // 不这样 group 可能会overlap
        let new_links = []
        for (let i = 0; i < new_nodes.length; i++) {
          for (let j = i + 1; j < new_nodes.length; j++) {
            new_links.push({ 'source': new_nodes[i].name, 'target': new_nodes[j].name })
          }
        }
        graph = { 'nodes': new_nodes, 'links': new_links }
        // initNodes = new_nodes
      }




      console.log('self.graphFusion:',  JSON.parse(JSON.stringify(self.graphFusion)))
      initNodes = self.extract(self.graphFusion).nodes
      // 初始布局应该为调整后节点位置, 并不一定是全局最优
      // 调整后节点位置应该合理~~
      let alphaMax = self.$store.state.alpha
      let alphaArr = []
      for (let i = 0; i < subgraphs.length; i++) {
        alphaArr.push(alphaMax)
      }
      d3.select('#dragView' + graph.key).selectAll('path').attr('stroke', null)

      self.LaplacianForceLayout(graph, subgraphs, alphaArr, alphaMax, initNodes)
    },

    resetView: function() {
      let graph = this.graphFusion
      let nodes = graph.nodes
      let links = graph.links
      nodes.forEach(d => {
        d.x = d.copyx
        d.y = d.copyy
      })
      links.forEach(d => {
        d.source.x = d.source.copyx
        d.source.y = d.source.copyy
        d.target.x = d.target.copyx
        d.target.y = d.target.copyy
      })

      d3.selectAll('.lassoNode').attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
      d3.selectAll('.node').attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })

      d3.selectAll('.link').attr("x1", function(line) { return line.source.x; })
        .attr("y1", function(line) { return line.source.y; })
        .attr("x2", function(line) { return line.target.x; })
        .attr("y2", function(line) { return line.target.y; });

      this.removeAllSubgraph(Math.random())
    },

    LaplacianForceLayout: function(graph, mentalMaps, alphaArr, alphaMax, initNodes) {
      // graph 主图、每个点都和其他点相连 边数：n*(n-1)/2
      // mentalMaps（子图集合，每个子图都是约束后的位置
      // alphaArr（子图约束点的权重为1000，权重数组）、
      // alphaMax（最大权重）
      // initNodes 初始化节点，加入约束后的，未迭代的节点
      
      console.log('graph:', JSON.parse(JSON.stringify(graph)))
      console.log('mentalMaps:', JSON.parse(JSON.stringify(mentalMaps)))
      console.log('alphaArr:', alphaArr)
      console.log('alphaMax:', alphaMax)
      console.log('initNodes:', JSON.parse(JSON.stringify(initNodes)))
      
      var self = this
      console.log('update')
      var nodeLen = graph.nodes.length
      var edgeLen = graph.links.length
      var nodeIdMap = [];
      var mentalNodeIdMaps = [];
      var row = [];
      var mentalGraphs = [];

      // nodeIdMap 用来存储主图中节点名称到索引的映射。
      for (var i = 0; i < nodeLen; i++) {
        row.push(0);
        nodeIdMap[graph.nodes[i].name] = i;
      }
      // 每一个子图，创建了 mentalNodeIdMap 来存储该子图中节点名称到索引的映射，
      for (var i in mentalMaps) {
        var mentalMap = mentalMaps[i]
        var mentalNodeIdMap = []
        for (var i = 0, mn = mentalMap.nodes.length; i < mn; i++) {
          mentalNodeIdMap[mentalMap.nodes[i].name] = i
        }
        mentalNodeIdMaps.push(mentalNodeIdMap)
        mentalMap = calIdealDistance(mentalMap, mentalNodeIdMap)
        mentalGraphs.push(mentalMap)
      }

      var visit = [];
      var adjGraph = [];
      // 定义了 calDistance2 和 calDistance 函数来分别计算两点间距离的平方和实际距离。
      function calDistance2(a, b) {
        let small = 0.00000000000001
        let v = (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1])
        if (Math.abs(v - small) < small) return small
        else return v
      }

      function calDistance(a, b) {
        let small = 0.00000000000001
        let v = Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]))
        if (Math.abs(v - small) < small) return small
        else return v
      }
      // calIdealDistance 函数来计算并存储每一对节点之间的理想距离。
      function calIdealDistance(subgraph, subgraphNodeIdMap) {
        let snum = subgraph.nodes.length
        let distanceIdMap = {}
        for(let i = 0; i < snum; i++) {
          for(let j = i+1; j< snum; j++) {
            let d = calDistance(subgraph.nodes[i].position, subgraph.nodes[j].position)
            distanceIdMap[i + ',' + j] = d
            distanceIdMap[j + ',' + i] = d
          }
        }
        subgraph['distanceIdMap'] = distanceIdMap
        return subgraph
      }
      // return

      //创建全部元素都为0的空矩阵
      // row = [0, 0, 0, 0, 0 ,0, 0, 0, ]
      var Lw = numeric.diag(row);
      var Lwd = numeric.diag(row);
      // console.log('row:', row)
      // console.log('Lw:', JSON.parse(JSON.stringify(Lw)))
      // console.log('Lwd:', JSON.parse(JSON.stringify(Lwd)))
      // 子图任意两点间的边长参数
      var byEdges = false;
      if (byEdges) {
        for (var k = 0, mgn = mentalGraphs.length; k < mgn; k++) {
          for (var i = 0, en = mentalGraphs[k].links.length; i < en; i++) {
            var s = mentalNodeIdMaps[k][mentalGraphs[k].links[i].source];
            var t = mentalNodeIdMaps[k][mentalGraphs[k].links[i].target];
            var sr = nodeIdMap[mentalGraphs[k].links[i].source];
            var tr = nodeIdMap[mentalGraphs[k].links[i].target];
            if (s != undefined && t != undefined && sr != undefined && tr != undefined) {
              //  console.log(mentalMap.links[i].source + ', ' + mentalMap.links[i].target);
              // 理想边长
              //  直接计算出来
              var posS = mentalGraphs[k].nodes[s].position;
              var posT = mentalGraphs[k].nodes[t].position;
              // 实际边长
              var posSreal = graph.nodes[sr].position;
              var posTreal = graph.nodes[tr].position;

              Lw[sr][tr] = Lw[tr][sr] += -1.0 / calDistance2(posS, posT) * alphaArr[k];
              Lwd[sr][tr] = Lwd[tr][sr] += -1.0 / (calDistance(posS, posT) * calDistance(posSreal, posTreal)) * alphaArr[k];
            }
          }
        }

      } else { // 任意两点之间 graph 的 Lw, Lw,dfl
        for (var k = 0, mgn = mentalGraphs.length; k < mgn; k++) {
          var mentalMapLen = mentalGraphs[k].nodes.length;
          let distanceIdMap = mentalGraphs[k].distanceIdMap
          for (var i = 0; i < mentalMapLen - 1; i++) {
            for (var j = i + 1; j < mentalMapLen; j++) {
              var s = nodeIdMap[mentalGraphs[k].nodes[i].name];
              var t = nodeIdMap[mentalGraphs[k].nodes[j].name];
              if (s != undefined && t != undefined) {
                //  console.log(mentalMap.nodes[i].name + ', ' + mentalMap.nodes[j].name);
                // 理想边长
                // 直接计算出来，预先算好
                // var posS = mentalGraphs[k].nodes[i].position;
                // var posT = mentalGraphs[k].nodes[j].position;
                let idealDistance = distanceIdMap[i + ',' + j]
                // 实际边长
                var posSreal = graph.nodes[s].position;
                var posTreal = graph.nodes[t].position;

                // Lw[s][t] = Lw[t][s] += -1.0 / calDistance2(posS, posT) * alphaArr[k];
                // Lw始终保持不变
                Lw[s][t] = Lw[t][s] += -1.0 / (idealDistance * idealDistance) * alphaArr[k];
                Lwd[s][t] = Lwd[t][s] += -1.0 / (idealDistance * calDistance(posSreal, posTreal)) * alphaArr[k];
              }
            }
          }
        }
      }


      // 不包含子图中边的边参数
      for (var i = 0; i < edgeLen; i++) {
        var s = nodeIdMap[graph.links[i].source];
        var t = nodeIdMap[graph.links[i].target];
        if (s != undefined && t != undefined) {
          var d = -1.0 / calDistance2(graph.nodes[s].position, graph.nodes[t].position);
          Lw[s][t] += d;
          Lw[t][s] += d;
          Lwd[s][t] += d;
          Lwd[t][s] += d;
        }
      }

      // 计算对角线元素
      for (var i = 0; i < nodeLen; i++) {
        for (var j = 0; j < nodeLen; j++) {
          if (i != j) {
            Lw[i][i] += -1.0 * Lw[i][j];
            Lwd[i][i] += -1.0 * Lwd[i][j];
          }
        }
      }

      var curPositionX = [];
      var curPositionY = [];

      //mentalMap
      //
      // 初始解, 不同的赋值方式
      // 从 initNodes 中提取每个节点的初始x和y坐标，存储在 curPositionX 和 curPositionY 数组中。
      for (var i = 0, n = initNodes.length; i < n; i++) {
        curPositionX.push(initNodes[i].position[0]);
        curPositionY.push(initNodes[i].position[1]);
      }

      // console.log('curPosition', curPositionX, curPositionY)
      var times = nodeLen * 2,
        time0 = -1;
      var E = 0,
        E0 = 0;
        
      // 使用 D3.js 的 forceSimulation 来设置迭代过程。
      var force = d3.forceSimulation()
      var a = 0
      var isBreak = false

      function sleep(numberMillis) {
        var now = new Date()
        var exitTime = now.getTime() + numberMillis;
        while (true) {
          now = new Date()
          if (now.getTime() > exitTime)
            return;
        }
      }

      force.alphaDecay(0.001)
      self.iterNum = 0
      
      force.on('tick', function() {
        // while(1) {
        // 初始值 和子图中的值决定了两个矩阵，curPosition 是当前的初始解，会对矩阵有影响
        // sleep(3000)
        self.iterNum++

        var solveX = Math.random()
        // 在每次迭代（tick事件）中，使用共轭梯度法（ConjugateGradientMethod）来计算新的节点位置。
        var newPositionX = self.ConjugateGradientMethod(Lw, numeric.dot(Lwd, curPositionX), curPositionX);
        var newPositionY = self.ConjugateGradientMethod(Lw, numeric.dot(Lwd, curPositionY), curPositionY);
        // var newPositionX = curPositionX
        // var newPositionY = curPositionY
        // 更新能量函数 E，它反映了当前布局与理想布局之间的差距。
        E0 = E;
        E = 0;
        if (byEdges) {
          for (var k = 0, mgn = mentalGraphs.length; k < mgn; k++) {
            for (var i = 0, men = mentalGraphs[k].links.length; i < men; i++) {
              var source = mentalGraphs[k].links[i].source;
              var target = mentalGraphs[k].links[i].target;
              var s = mentalNodeIdMaps[k][source];
              var t = mentalNodeIdMaps[k][target];
              var sr = nodeIdMap[source];
              var tr = nodeIdMap[target];
              if (s != undefined && t != undefined && sr != undefined && tr != undefined) {
                // 理想边长
                // var posS = mentalGraphs[k].nodes[s].position;
                // var posT = mentalGraphs[k].nodes[t].position;
                // var ideal = distance(posS, posT);
                // 
                // 实际边长
                var posSreal = [newPositionX[sr], newPositionY[sr]];
                var posTreal = [newPositionX[tr], newPositionY[tr]];
                var real = distance(posSreal, posTreal);

                E += alphaMax * (1.0 / (ideal * ideal)) * (real - ideal) * (real - ideal);
              }
            }
          }

        } else {
          for (var k = 0, mgn = mentalGraphs.length; k < mgn; k++) {
            var mentalMapLen = mentalGraphs[k].nodes.length;
            let distanceIdMap = mentalGraphs[k].distanceIdMap
            for (var i = 0; i < mentalMapLen - 1; i++) {
              for (var j = i + 1; j < mentalMapLen; j++) {
                var s = nodeIdMap[mentalGraphs[k].nodes[i].name];
                var t = nodeIdMap[mentalGraphs[k].nodes[j].name];
                if (s != undefined && t != undefined) {
                  // 理想边长
                  // var posS = mentalGraphs[k].nodes[i].position;
                  // var posT = mentalGraphs[k].nodes[j].position;
                  // var ideal = distance(posS, posT);
                  let idealDistance = distanceIdMap[i + ',' + j]
                  // 实际边长
                  var posSreal = [newPositionX[s], newPositionY[s]];
                  var posTreal = [newPositionX[t], newPositionY[t]];
                  var real = calDistance(posSreal, posTreal);
                  E += alphaMax * Math.abs(real - idealDistance)
                }
              }
            }
          }
        }

        // if (1==1) {
        // 不包含子图中边的边参数
        for (var i = 0; i < edgeLen; i++) {
          var s = nodeIdMap[graph.links[i].source];
          var t = nodeIdMap[graph.links[i].target];
          if (s != undefined && t != undefined) {
            // 理想边长
            var posS = graph.nodes[s].position;
            var posT = graph.nodes[t].position;
            var ideal = calDistance(posS, posT);

            // 实际边长
            var posSreal = [newPositionX[s], newPositionY[s]];
            var posTreal = [newPositionX[t], newPositionY[t]];
            var real = calDistance(posSreal, posTreal);
            E += Math.abs(real - ideal)
          }
        }

        // console.log(E, E0)

        if ((Math.abs(E - E0) / E < self.iterationThreshold && self.iterNum > self.iterationLowNumber || self.iterNum > self.iterationUpNumber)) {
          force.stop()
          console.log('laplacian stop')

          // self.$store.state.satisfiedGlobalLayout = copy(self.graphFusion)
          self.$store.state.finalGraphLayout = self.graphFusion
          // 力导向布局默认最优
          return
        }

        // console.log(time0, E, E0)

        curPositionX = newPositionX;
        curPositionY = newPositionY;

        var updateT = Math.random()
        // newPositionX = []
        // newPositionY = []
        // for (var i = 0, n = initNodes.length; i < n; i++) {
        //   newPositionX.push(initNodes[i].position[0]);
        //   newPositionY.push(initNodes[i].position[1]);
        // }
        // console.log('position', newPositionX, newPositionY)
        var newPosition = []
        var minx = 10000000000000000;
        var miny = 10000000000000000;
        for (var i = 0; i < newPositionX.length; i++) {
          newPosition.push([newPositionX[i], newPositionY[i]]);
          minx = minx < curPositionX[i] ? minx : newPositionX[i];
          miny = miny < curPositionY[i] ? miny : newPositionY[i];
        }
        for (var i = 0; i < newPositionX.length; i++) {
          newPosition[i][0] -= minx;
          newPosition[i][1] -= miny;
        }
        var new_position = newPosition
        var center = [0, 0]
        for (var i in new_position) {
          center[0] += new_position[i][0]
          center[1] += new_position[i][1]
        }
        center[0] /= new_position.length
        center[1] /= new_position.length
        var bias = [self.viewWidth / 2 - center[0], self.viewHeight / 2 - center[1]]
        for (var i in new_position) {
          new_position[i][0] += bias[0]
          new_position[i][1] += bias[1]
        }

        for (var i = 0, ni = Lwd.length; i < ni; i++) {
          for (var j = 0, nj = Lwd[i].length; j < nj; j++) {
            Lwd[i][j] = 0;
          }
        }

        if (byEdges) {
          for (var k = 0, mgn = mentalGraphs.length; k < mgn; k++) {
            for (var i = 0, en = mentalGraphs[k].links.length; i < en; i++) {
              var s = mentalNodeIdMaps[k][mentalGraphs[k].links[i].source];
              var t = mentalNodeIdMaps[k][mentalGraphs[k].links[i].target];
              var sr = nodeIdMap[mentalGraphs[k].links[i].source];
              var tr = nodeIdMap[mentalGraphs[k].links[i].target];
              if (s != undefined && t != undefined && sr != undefined && tr != undefined) {
                // 理想边长
                var posS = mentalGraphs[k].nodes[s].position;
                var posT = mentalGraphs[k].nodes[t].position;
                // 实际边长
                var posSreal = [curPositionX[sr], curPositionY[sr]];
                var posTreal = [curPositionX[tr], curPositionY[tr]];

                Lw[sr][tr] = Lw[tr][sr] += -1.0 / calDistance2(posS, posT) * alphaArr[k];
                Lwd[sr][tr] = Lwd[tr][sr] += -1.0 / (distance(posS, posT) * distance(posSreal, posTreal)) * alphaArr[k];
              }
            }
          }

        } else {
          for (var k = 0, mgn = mentalGraphs.length; k < mgn; k++) {
            var mentalMapLen = mentalGraphs[k].nodes.length;
            let distanceIdMap = mentalGraphs[k].distanceIdMap
            for (var i = 0; i < mentalMapLen - 1; i++) {
              for (var j = i + 1; j < mentalMapLen; j++) {
                var s = nodeIdMap[mentalGraphs[k].nodes[i].name];
                var t = nodeIdMap[mentalGraphs[k].nodes[j].name];
                if (s != undefined && t != undefined) {
                  // 理想边长
                  // var posS = mentalGraphs[k].nodes[i].position;
                  // var posT = mentalGraphs[k].nodes[j].position;
                  let idealDistance = distanceIdMap[i + ',' + j]
                  // 实际边长
                  var posSreal = [curPositionX[s], curPositionY[s]]; //graph.nodes[s].position;
                  var posTreal = [curPositionX[t], curPositionY[t]]; //graph.nodes[t].position;

                  Lwd[s][t] = Lwd[t][s] += -1.0 / ( idealDistance * calDistance(posSreal, posTreal)) * alphaArr[k];
                }
              }
            }
          }
        }

        // 不包含子图中边的边参数
        for (var i = 0; i < edgeLen; i++) {
          var s = nodeIdMap[graph.links[i].source];
          var t = nodeIdMap[graph.links[i].target];
          if (s != undefined && t != undefined) {
            var posS = graph.nodes[s].position;
            var posT = graph.nodes[t].position;

            var posSreal = [curPositionX[s], curPositionY[s]];
            var posTreal = [curPositionX[t], curPositionY[t]];
            var d = -1.0 / (calDistance(posS, posT) * calDistance(posSreal, posTreal));
            Lwd[s][t] += d;
            Lwd[t][s] += d;

          }
        }
        // 计算对角线元素
        for (var i = 0; i < nodeLen; i++) {
          for (var j = 0; j < nodeLen; j++) {
            if (i != j) {
              Lwd[i][i] += -1.0 * Lwd[i][j];
            }
          }
        }
        // self.graphFusion.nodes.forEach(d => {
        //   let x = new_position[nodeIdMap[d.id]][0]
        //   let y = new_position[nodeIdMap[d.id]][1]
        //   d.x = x
        //   d.y = y
        // })
        d3.select('#fusionView').select('svg').selectAll('.node')
          // .transition()
          // .duration(30)
          .attr('transform', function(d) {
            let x = new_position[nodeIdMap[d.id]][0]
            let y = new_position[nodeIdMap[d.id]][1]
            d.x = x
            d.y = y
            return 'translate(' + x + ',' + y + ')'
          })

        d3.select('#fusionView').select('svg').selectAll('.lassoNode')
          // .transition()
          // .duration(30)
          .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')'
          })

        d3.select('#fusionView').select('svg').selectAll('.dragNode')
          .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')'
          })

        d3.select('#fusionView').select('svg').selectAll("line")
          // .transition()
          // .duration(30)
          .attr('x1', function(d) {
            return new_position[nodeIdMap[d.source.id]][0]
          })
          .attr('y1', function(d) {
            return new_position[nodeIdMap[d.source.id]][1]
          })
          .attr('x2', function(d) {
            return new_position[nodeIdMap[d.target.id]][0]
          })
          .attr('y2', function(d) {
            return new_position[nodeIdMap[d.target.id]][1]
          })

        self.$store.state.updateContourSignal = Math.random()

        // console.log('update time', new Date() - updateT)
      })
      // }

      force.tick()

    },
    // 共轭梯度 Ax= b
    ConjugateGradientMethod: function(A, b, x) {
      //https://en.wikipedia.org/wiki/Conjugate_gradient_method
      var n = b.length;
      var r = numeric.sub(b, numeric.dot(A, x)) // 初始残差
      var p = []  // 初始搜索方向
      for (let i = 0; i < n; i++) {
        p.push(r[i])
      }
      var rsold = numeric.dot(r, r)  // 初始残差平方
      // var iterations = n * 5;
      var iterations = n;
      var Ap;
      var alpha;
      var rsnew;

      while (iterations--) {
        Ap = numeric.dot(A, p)  // A * p
        alpha = rsold / (numeric.dot(p, Ap))  // 计算步长
        x = numeric.add(x, numeric.mul(alpha, p))  // 更新解
        r = numeric.sub(r, numeric.mul(alpha, Ap))  // 更新残差
        rsnew = numeric.dot(r, r) // 新的残差平方

        // 检查收敛条件
        if (Math.sqrt(rsnew) < 1e-10) break
        // 更新搜索方向
        p = numeric.add(r, numeric.mul(rsnew / rsold, p))
        // 更新旧的残差平方
        rsold = rsnew
      }
      return x;
    }

  }

}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#graphFusionView {
  /*border: 1px solid #aaa;*/
  position: absolute;
  top: 42px;
  width: 84.5%;
  left: 2px;
  /*box-shadow:0px 0px 1px 1px #ddd;*/
  height: calc(99% - 42px);
  margin: auto 0px;
  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #ddd;
  box-shadow: 0px 0px 1px 1px #ddd;
  overflow: hidden;

  /* border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #ddd;*/
}

#buttonlist2 {
  position: absolute;
  height: 30px;
  /*bottom: 0px;*/
  width: 100%;
  vertical-align: top;
  margin-left: 10px;
  /*  margin: auto 0px;
  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #ddd;
  box-shadow: 0px 0px 1px 1px #ddd;*/
}

.clicked {
  background: #ccc;
}

.labelIcon {
  margin-left: 10px;
  font-size: 0.8em;
  padding: 2px;
  /*text-decoration: underline;*/
  border-bottom: 2px solid #ddd;
}

.labelClicked {
  border-bottom: 2px solid steelblue !important;
}


.labelIcon:hover {
  cursor: pointer;
}

#fusionView {
  position: absolute;
  top: 33px;
  width: 100%;
  height: calc(100% - 33px);
  /*  box-shadow: 0px 0px 1px 1px #ddd;
  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #ddd;*/
}

#panel {
  margin-left: 10px;
}

</style>
