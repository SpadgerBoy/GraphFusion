<template>
  <div id="graphListView" ref='graphListView'>
    <div id='buttonlist' style="width: 100%;">
      <!-- <img width='30px' height='30px' src="static/icon/line.png"/> -->
      <!-- <b-button-group> -->
      <el-tooltip v-for="icon in icons" :open-delay="800" transition="null" :content="icon.content" placement="top" effect="light" :key="icon.clas">
        <button class="btn" :id="icon.clas" :class="{'clicked': icon.active}" v-on:click="handleEvent(icon.clas, icon.active)">
          <i class="iconfont" :class="['icon-' + icon.clas]"></i>
        </button>
      </el-tooltip>
    </div>
    <div id='listView'>
      <Graph v-for="graph in graphViewList" :initGraph="graph" :key="graph.key" :clickedIcon='clickedIcon'>
      </Graph>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Graph from './Graph/Graph.vue'
import graphA from '../assets/a.data.js'
import graphB from '../assets/b.data.js'
import graphC from '../assets/c.data.js'
import graphD from '../assets/d.data.js'
import graphE from '../assets/e.data.js'
import graphF from '../assets/f.data.js'
import graphG from '../assets/g.data.js'
import { transformPosition, copy } from '../api/function.js'
import { mapActions } from 'vuex'
export default {
  name: 'GraphListView',
  components: { Graph },
  data() {
    return {
      id2pos: {},
      graphViewList2: [],
      simulation: null,
      radius: 5,
      settings: {
        width: 100,
        height: 200
      },
      icons: [
        { 'clas': 'circle', 'content': 'Circle Layout', 'active': false },
        { 'clas': 'line', 'content': 'Line Layout', 'active': false },
        { 'clas': 'grid', 'content': 'Grid Layout', 'active': false },
        // { 'clas': 'brush', 'content': 'Brush Layout', 'active': false },
        { 'clas': 'reset', 'content': 'Reset Layout', 'active': false },
        // { 'clas': 'delete', 'content': 'Delete Subgraphs', 'active': false },
      ],
      clickedIcon: null
    }
  },
  watch: {
    // updatedSubgraphId: function(newValue, oldValue) {
    //   let self = this
    //   let key = newValue.split(',')[0]
    //   for(let i in self.$store.state.subgraphViewList) {
    //     if(self.$store.state.subgraphViewList[i].key == key) {
    //       Vue.set(self.graphViewList2, i, self.$store.state.subgraphViewList[i])
    //     }
    //   }
    // },
    // graphViewList: function(newValue, oldValue) {
    //   this.graphViewList2 = newValue
    // }

  },
  mounted: function() {
    var self = this
    let height = this.$refs.graphListView.offsetHeight
    let width = this.$refs.graphListView.offsetWidth
    self.viewWidth = width - 5
    self.viewHeight = width - 5
  },
  computed: {
    graphViewList() {
      console.log('update list')
      let subgraphViewList = this.$store.state.subgraphViewList
      let len = subgraphViewList.length
      for (let i = 0; i < len; i++) {
        subgraphViewList[i].context = subgraphViewList[i].key
        subgraphViewList[i].setting.height = this.viewHeight
        subgraphViewList[i].setting.width = this.viewWidth - 8
        subgraphViewList[i].setting.radius = this.radius
      }
      console.log('subgraphViewList:', subgraphViewList)
      return subgraphViewList
    },
    // updatedSubgraphId: function() {
    //   return this.$store.state.updatedSubgraphId
    // }
  },
  methods: {
    ...mapActions([
      'addSubgraph'
    ]),
    handleEvent: function(iconId, active) {
      console.log(iconId)
      if (this.$store.state.focusSubgraph == null) {
        this.$alert('Please select a subgraph by click', 'No subgraph selected', {
          confirmButtonText: 'OK',
          // callback: action => {
          //   this.$message({
          //     type: 'info',
          //     message: `action: ${ action }`
          //   });
          // }
        });
      }
      let index = 0
      for (let i in this.icons) {
        if (this.icons[i].clas == iconId) {
          this.icons[i].active = !this.icons[i].active
          active = this.icons[i].active
          index = i
        }
      }
      if (iconId == 'circle') {
        this.clickedIcon = iconId + ',' + Math.random()
        this.icons[index].active = false
      }
      if (iconId == 'line') {
        this.clickedIcon = iconId + ',' + Math.random()
        this.icons[index].active = false
      }
      if (iconId == 'grid') {
        this.clickedIcon = iconId + ',' + Math.random()
        this.icons[index].active = false
      }
      if (iconId == 'reset') {
        this.clickedIcon = iconId + ',' + Math.random()
        this.icons[index].active = false
      }
    }
  }

}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#graphListView {
  position: absolute;
  left: 85%;
  width: calc( 15% - 5px);
  top: 42px;
  height: calc( 99% - 42px);
  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #ddd;
  box-shadow: 0px 0px 1px 1px #ddd;
}

.clicked {
  background: #ccc;
}

#buttonlist {
  height: 30px;
  vertical-align: top;
  text-align: center;
  margin: auto 0px;
  border-bottom: 1px solid #ddd;
  /*  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #ddd;
  box-shadow: 0px 0px 1px 1px #ddd;*/
}

#listView {
  overflow: auto;
  height: calc( 100% - 33px);
  width: 100%;
  overflow: auto;
  position: absolute;
  top: 33px;
  overflow-x: hidden;
  /*  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #ddd;
  box-shadow: 0px 0px 1px 1px #ddd;*/
}

</style>
