<template>
  <div id='zoomSldier'>
    <div>
      <div class='btnContainer'>
        <button class="btn" @click="zoomIn">
          <i class="iconfont icon-zoomin"></i>
        </button>
      </div>
      <!-- <div class = 'btnContainer' >
        <svg id='sliderBarSvg' :width="width" :height="height" style="margin-top: -1; margin-bottom: -3">
        </svg>
      </div> -->
      <div class='btnContainer'>
        <svg id='rotateBarSvg'>
        </svg>
      </div>
      <div class='btnContainer' >
        <button class="btn" @click="zoomOut">
          <i class="iconfont icon-zoomout"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: 'slider',
      width: 22,
      height: 100
    }
  },
  mounted: function() {
    this.init()
  },
  watch: {},
  computed: {},
  methods: {
    init() {

      this.createRotateBar()
    },
    createRotateBar() {
      let self = this
      let svgWidth = 70
      let svgHeight = 70
      let space = 10
      let centerX = svgWidth / 2
      let centerY = svgHeight / 2
      let padding = {'top': space, 'bottom': space, 'right': space, 'left': space}
      let svg = d3.select('#rotateBarSvg').attr('width', svgWidth).attr('height', svgHeight).append('g')
      .attr('transform', 'translate(' + centerX + ',' + centerY + ')')

      let width = svgWidth - padding.left - padding.right
      let height = svgHeight - padding.top - padding.bottom
      let radius = width / 2
      svg.append('circle')
         .attr('r', radius)
         .attr('fill', 'white')
         .attr('stroke', '#ddd')

     let dragCircle = svg.append('circle')
         .attr('cx', height / 2)
         .attr('cy', 0)
         .attr('r', radius * 0.25)
         .attr('fill', 'white')
         .attr('stroke', '#555')
         .attr('stroke-width', 1)

      dragCircle.call(d3.drag()
        .on('start', moveRectDragStart)
        .on('drag', moveRectDrag)
        .on('end', moveRectDragEnd))

      function moveRectDragStart() {

      }

      function moveRectDrag(d) {
        // console.log(d3.event.x, d3.event.y) // 
        let x = d3.event.x
        let y = d3.event.y
        let dis = Math.sqrt(x * x + y * y)

        let newAngle = Math.atan2(y, x) * 180 / Math.PI
        dragCircle.attr('cx',  x * radius / dis)
                  .attr('cy',  y * radius / dis)

        self.$store.state.rotateAngle = newAngle
      }

      function moveRectDragEnd(d) {

      }
    },
    createSlideBar() {
      let self = this
      let width = self.width
      let height = self.height
      let barWidth = 4
      let svg = d3.select('#sliderBarSvg')
      let left = 3
      svg.append('rect')
        .attr('id', 'backRect')
        .attr('x', width / 2 - barWidth / 2)
        .attr('width', barWidth)
        .attr('height', height)
        .attr('stroke', '#aaa')
        .attr('fill', 'white')

      let innerLineHeight = 3
      let innerLineWidth = barWidth * 2
      svg.append('rect')
        .attr('x', width / 2 - innerLineWidth / 2)
        .attr('y', height / 2)
        .attr('width', innerLineWidth)
        .attr('height', innerLineHeight)
        .attr('fill', '#aaa')

      let moveBarHeight = 9
      let moveBarWidth = 16
      let moveRect = svg.append('g').attr('id', 'moveRectg').attr('transform', function() {
        return 'translate(' + (width / 2 - moveBarWidth / 2) + ',' + (height / 2 - moveBarHeight / 2) + ')'
      })

      moveRect.append('rect')
        .attr('width', moveBarWidth)
        .attr('height', moveBarHeight)
        .attr('fill', 'white')
        .attr('stroke', '#aaa')

      moveRect.call(d3.drag()
        .on('start', moveRectDragStart)
        .on('drag', moveRectDrag)
        .on('end', moveRectDragEnd))

      function moveRectDragStart() {

      }

      function moveRectDrag(d) {
        let x = d3.event.x
        let y = d3.event.y
        if (y < 0) y = 0
        if (y > height - moveBarHeight) y = height - moveBarHeight
        svg.select('#moveRectg').attr('transform', function() {
          return 'translate(' + (width / 2 - moveBarWidth / 2) + ',' + y + ')'
        })
      }

      function moveRectDragEnd(d) {

      }

    },
    zoomOut() {
      this.$store.state.zoomOutSubgraph = Math.random()
    },
    zoomIn() {
      this.$store.state.zoomInSubgraph = Math.random()
    }
  }
}

</script>
<!-- Add "scoped " attribute to limit CSS to this component only -->
<style scoped>
#zoomSldier {
  position: absolute;
  right: 10px;
  top: 3px;
  text-align: center;
}

.btnContainer {
  /*padding: 0px*/
  line-height: 1 !important
}

</style>
