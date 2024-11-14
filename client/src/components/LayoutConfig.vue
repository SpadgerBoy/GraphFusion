<template>
  <div id='layoutConfig'>
    <!-- <div style='width: 200px'> -->
    <el-form label-width="5px" size='mini'>
      <!-- <el-form-item prop="name">
        <el-col :span='7' class='labelName'>
          <span style="width: 100%;">
            Refresh
          </span>
        </el-col>
        <el-col :span='12'>
          <button class="btn" v-on:click="handleEvent()">
            <i class="iconfont icon-refresh">
          </i>
          </button>
        </el-col>
      </el-form-item>
 -->
      <el-form-item prop="name">
        <el-col :span='7' class='labelName'>
          <span style="width: 100%;">
            Link Dist
          </span>
        </el-col>
        <el-col :span='12'>
          <div style="margin-top:  6px">
            <vue-slider ref="linkSlider" style="width: 95%;" :min='0' v-model='linkDistance' :max='100' :dot-size='12' :height='4' :tooltip='false' drag-end='dragEnd'></vue-slider>
          </div>
        </el-col>
        <el-col :span='4'>
          <span style="width: 100%">
              {{linkDistance}}
          </span>
        </el-col>
      </el-form-item>
   <!--    <el-form-item prop="name">
        <el-col :span='7' class='labelName'>
          <span style="width: 100%;">
            Link Force
          </span>
        </el-col>
        <el-col :span='12'>
          <div style="margin-top:  6px">
            <vue-slider ref="linkSlider" style="width: 95%;" :min='0' v-model='linkForce' :max='1' :interval='0.01' :dot-size='12' :height='4' :tooltip='false' drag-end='dragEnd'></vue-slider>
          </div>
        </el-col>
        <el-col :span='4'>
          <span style="width: 100%">
              {{ linkForce }}
          </span>
        </el-col>
      </el-form-item> -->
  <!--     <el-form-item prop="name">
        <el-col :span='7' class='labelName'>
          <span style="width: 100%">
            Node Force
          </span>
        </el-col>
        <el-col :span='12'>
          <div style="margin-top:  6px">
            <vue-slider ref="nodeSlider" style="width: 95%;" :min='0' v-model='nodeStrength' :max='30' :dot-size='12' :height='4' :tooltip='false'></vue-slider>
          </div>
        </el-col>
        <el-col :span='4'>
          <span style="width: 100%">
              {{ nodeStrength }}
          </span>
        </el-col>
      </el-form-item> -->
      <el-form-item prop="name">
        <el-col :span='7' class='labelName'>
          <span style="width: 100%">
            Node Size
          </span>
        </el-col>
        <el-col :span='12'>
          <div style="margin-top:  6px">
            <vue-slider ref="nodeSlider" style="width: 95%;" :min='0' v-model='nodeSize' :max='10' :dot-size='12' :height='4' :tooltip='false'></vue-slider>
          </div>
        </el-col>
        <el-col :span='4'>
          <span style="width: 100%">
              {{ nodeSize }}
          </span>
        </el-col>
      </el-form-item>
      <el-form-item prop="name">
        <el-col :span='7' class='labelName'>
          <span style="width: 100%">
            Label Size
          </span>
        </el-col>
        <el-col :span='12'>
          <div style="margin-top:  6px">
            <vue-slider ref="nodeSlider" style="width: 95%;" :min='0.1' v-model='labelSize' :max='2' :dot-size='12' :height='4' :interval='0.01' :tooltip='false'></vue-slider>
          </div>
        </el-col>
        <el-col :span='4'>
          <span style="width: 100%">
              {{ labelSize }}
          </span>
        </el-col>
      </el-form-item>
      <el-form-item prop="name">
        <el-col :span='7' class='labelName'>
          <span style="width: 100%">
            Link Size
          </span>
        </el-col>
        <el-col :span='12'>
          <div style="margin-top:  6px">
            <vue-slider ref="nodeSlider" style="width: 95%;" :min='0' v-model='linkSize' :max='8' :dot-size='12' :height='4' :tooltip='false'></vue-slider>
          </div>
        </el-col>
        <el-col :span='4'>
          <span style="width: 100%">
              {{ linkSize }}
          </span>
        </el-col>
      </el-form-item>
      <!-- <el-form-item prop="name">
        <el-col :span='7' class='labelName'>
          <span style="width: 100%">
            Rotate
          </span>
        </el-col>
        <el-col :span='12'>
          <div style="margin-top:  6px">
            <vue-slider ref="nodeSlider" style="width: 95%;" :min='0' v-model='rotateAngle' :max='360' :dot-size='12' :height='4' :tooltip='false' @drag-start='rotateStart'></vue-slider>
          </div>
        </el-col>
        <el-col :span='4'>
          <span style="width: 100%">
              {{ rotateAngle }}
          </span>
        </el-col>
      </el-form-item> -->

      <el-form-item prop="name">
        <el-col :span='7' class='labelName'>
          <span style="width: 100%">
            Alpha
          </span>
        </el-col>
        <el-col :span='12'>
          <div style="margin-top:  6px">
            <vue-slider ref="nodeSlider" style="width: 95%;" :min='1' v-model='alpha' :max='5000' :dot-size='12' :height='4' :tooltip='false' ></vue-slider>
          </div>
        </el-col>
        <el-col :span='4'>
          <span style="width: 100%">
              {{ alpha }}
          </span>
        </el-col>
      </el-form-item>



      <el-form-item prop="name">
        <el-col :span='7' class='labelName'>
          <span style="width: 100%">
            Label
          </span>
        </el-col>
        <el-col :span='5' style='padding-left: 10px'>
          <el-checkbox v-model='nodeLabel'></el-checkbox>
        </el-col>
 <!--        <el-col :span='3' class='labelName'>
          <span style="width: 100%">
            Color
          </span>
        </el-col> -->
  <!--       <el-col :span='3' style='padding-left: 10px'>
          <el-color-picker v-model="nodeColor" size="mini"></el-color-picker>
        </el-col> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import vueSlider from 'vue-slider-component'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'LayoutConfig',
  components: { vueSlider },
  data() {
    return {
      linkDistance: this.$store.state.linkDistance,
      nodeStrength: this.$store.state.nodeStrength,
      nodeSize: this.$store.state.nodeSize,
      labelSize: this.$store.state.labelSize,
      linkSize: this.$store.state.linkSize,
      nodeLabel: this.$store.state.nodeLabel,
      linkForce: this.$store.state.linkForce,
      rotateAngle: this.$store.state.rotateAngle,
      alpha: this.$store.state.alpha,
      nodeColor: '#ddd'

    }
  },
  mounted: function() {
    var self = this
    // Code that will run only after the
    // entire view has been rendered
    // self.addDrag()

  },
  watch: {
    linkDistance: function(newValue, oldValue) {
      // console.log('update link', newValue)
      // console.log(this.$store.state.linkDistance)
      this.$store.state.linkDistance = newValue
    },
    linkForce: function(newValue, oldValue) {
      // console.log('update link', newValue)
      // console.log(this.$store.state.linkDistance)
      this.$store.state.linkForce = newValue
    },

    nodeStrength: function(newValue, oldValue) {
      this.$store.state.nodeStrength = newValue
    },
    nodeSize: function(newValue, oldValue) {
      this.$store.state.nodeSize = newValue
    },

    labelSize: function(newValue, oldValue) {
      this.$store.state.labelSize = newValue
    },

    linkSize: function(newValue, oldValue) {
      this.$store.state.linkSize = newValue
    },

    rotateAngle: function(newValue, oldValue) {
      this.$store.state.rotateAngle = newValue
    },

    nodeLabel: function(newValue, oldValue) {
      this.$store.state.nodeLabel = newValue
    },

    alpha: function(newValue, oldValue) {
      this.$store.state.alpha = newValue
    }

  },
  computed: {
  },
  methods: {
    addDrag: function() {},
    updateView: function(nodes) {},
    dragEnd: function() {
      console.log('end')
    },
    rotateStart: function() {
      console.log('rotateStart')
      this.$store.state.rotateStart = Math.random()
    },


    handleEvent: function() {
      console.log('click label')
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#layoutConfig {
  position: absolute;
  top: 5%;
  width: 30%;
  left: 55px;

  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #ddd;
  box-shadow: 0px 0px 1px 1px #ddd;
}

.el-form-item {
  margin-bottom: 0px !important;
}

.labelName {
  text-align: right;
  padding-right: 10px;
}

span {
  font-size: 0.6em;
}

.el-color-picker__trigger {
  height: 22px !important;
  width: 22px !important;
  margin-top: 3px !important;
  border: 0px !important;
}




/*.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
*/

</style>
