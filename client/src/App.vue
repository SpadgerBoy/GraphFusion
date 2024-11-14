<template>
  <div id='header'>
    <div style="position: absolute;width: 100%">
      <el-tabs v-model="activeName">
        <!-- <el-tab-pane name = "first">
          <span id="mainView" slot="label" v-on:click="handleClick('GraphFusion')"><span style="visibility: hidden">d</span>GraphFusion</span>
        </el-tab-pane> -->
        
        <el-tab-pane name="first" >
          <span id="mainView" slot="label"><span style="visibility: hidden">d</span>GraphFusion</span>
        </el-tab-pane>

        <el-tab-pane name="second" >
          <span slot="label">Data</span>
        </el-tab-pane>
   <!--      <el-tab-pane name="third">
          <span slot="label">Help</span>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    
    <!-- <div>
      <el-tabs style="position: absolute; right: 15px;">
        <el-tab-pane name="forth">
          <span slot="label">Create Account</span>
        </el-tab-pane>
        <el-tab-pane name="fifth">
          <span slot="label">Log In</span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div style="margin-left: 10px; margin-top: 10px">
      <span id = 'weight'>Subgraph Weight {{ value }}</span>
      <span style="margin-left: 10px;" id='refresh'>
        <font-awesome-icon icon="sync-alt" />
      </span>
    </div>
    <div style="width:30%">
      <vue-slider ref="slider" :min="min" :max="max" v-model="value" tooltip='hover'> </vue-slider>
    </div> -->
    
    <Page v-show="pageDisplay"></Page>
    <Upload v-if="uploadDispaly"></Upload>
  </div>
</template>
<script>
import Vue from 'vue'
import vueSlider from 'vue-slider-component';
import Page from '@/components/Page'
import Upload from '@/components/Upload'
export default {
  name: 'App',
  components: {
    vueSlider,
    Page,
    Upload
  },
  data() {
    return {
      value: 50,
      min: 1,
      max: 200,
      activeName: 'first',
      uploadDispaly: false,
      pageDisplay: true
    }
  },
  watch: {
    loadedGraphDataSignal: function() {
      this.activeName = 'first'
    },
    activeName: function(val) {
      if (val == 'second') {
        this.uploadDispaly = true
        this.pageDisplay = false
      }
      if (val == 'first') {
        this.uploadDispaly = false
        this.pageDisplay = true
      }
    }
  },
  computed: {
    loadedGraphDataSignal: function() {
      return this.$store.state.loadedGraphDataSignal
    }
  },
  mounted: function() {
    let self = this
    $('#tab-first').click(function(){
      console.log('dfdffdf')
      self.handleClick('GraphFusion')
    })
    $('#tab-second').click(function(){
      self.handleClick('Data')
    })

  },
  methods: {
    handleClick(label) {
      console.log(label)
      if (label == 'Data') {
        this.uploadDispaly = true
        this.pageDisplay = false
      }
      if (label == 'GraphFusion') {
        this.uploadDispaly = false
        this.pageDisplay = true
      }
    }
  }
}

</script>
<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  position: absolute;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  width: 100%;
  height: 100%;
}

#toolbar {
  box-shadow: 0 0 3px #c8c8c8;
  background-color: #fafafa;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 5;
  padding-left: 5px;
}


.hidden {
  display: hidden;
}

/*#tab-first {
  padding: 0!important
}
#tab-second {
  padding: 0!important
}*/


/*body {
  line-height: 0.5 !important;
}*/

#header {
  /*margin-left: 10px;*/
  overflow-y: hidden;
}

#refresh:hover {
  cursor: pointer;
}

</style>
