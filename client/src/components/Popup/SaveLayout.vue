<template>
  <el-dialog title="Save Layout" :visible.sync="dialogFormVisible2" @close="closeWindow" @open="init">
    <el-form>
      <el-form-item label="Graph Name" :label-width="formLabelWidth">
        <el-input v-model="saveName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Description" :label-width="formLabelWidth">
        <el-input v-model="saveDescription" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeWindow">Cancel</el-button>
      <el-button @click="upload">OK</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      publicGraphInfo: [],
      saveName: '',
      saveDescription: '',
      // importFileUrl: 'http://127.0.0.1:13145/uploadGraph',
      importFileUrl: 'http://10.1.114.77:13146/uploadGraph',
      upLoadData: {
        file: '123456',
        occurTime: '2017-08'
      },
      formLabelWidth: '120px',
      dialogFormVisible2: false,
    }
  },
  mounted: function() {},
  watch: {
    nodes: function(newNodes, oldNodes) {
      this.updateView(newNodes)
    },
    dialogFormVisible: function(newValue, oldValue) {
      // console.log(newValue)
      this.dialogFormVisible2 = newValue
    }
  },
  computed: {
    dialogFormVisible: {
      get: function() {
        return this.$store.state.saveFormVisible
      },
      set: function(newValue) {}
    }
  },
  methods: {
    init() {
      this.saveName = this.$store.state.graphName
      this.saveDescription = this.$store.state.graphDescription
    },
    upload() {
      this.$store.state.saveFormVisible = false
      let self = this
      var subgraphList = this.$store.state.subgraphList
      var subgraphs = []
      for (let i in subgraphList) {
        let graph = subgraphList[i]
        let ids = []
        graph.nodes.forEach(d => {
          ids.push(d.id)
        })
        subgraphs.push({ 'ids': ids, 'key': graph.key, 'nodes': graph.nodes, 'links': graph.links })
      }
      let finalGraphLayout = this.$store.state.finalGraphLayout
      finalGraphLayout['subgraphs'] = subgraphs
      let config = {}
      config.linkDistance = this.$store.state.linkDistance
      config.nodeSize = this.$store.state.nodeSize
      config.labelSize = this.$store.state.labelSize
      config.linkSize = this.$store.state.linkSize
      config.rotateAngle = this.$store.state.rotateAngle
      config.alpha = this.$store.state.alpha
      config.nodeLabel = this.$store.state.nodeLabel
      finalGraphLayout.config = config
      var fileString = JSON.stringify(finalGraphLayout)
      // formData.append('file', fileString)
      // formData.append('name', self.saveName)
      // formData.append('tags', self.saveDescription)
      // this.$store.state.graphName = self.saveName
      // this.$store.state.graphDescription = self.saveDescription
      // let message = 'uploadGraph'
      // let Url = message
      // self.$api.post(Url, formData, data => {
      //   if (data['upload'] == "success") {
      //     this.$notify({
      //       title: 'Save Succesfully',
      //     //   message: h('i', { style: 'color: teal' }, '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案')
      //     });
      //   }
      // })
      let Url = 'uploadGraph'
      let paramsObj = {
        'file': fileString,
        'name': self.saveName,
        'tags': self.saveDescription
      }
      CommunicateWithServer('post', paramsObj, Url, data => {
        if (data['upload'] == "success") {
          this.$notify({
            title: 'Save Succesfully',
            //   message: h('i', { style: 'color: teal' }, '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案')
          });
        }
      })
    },
    closeWindow() {
      this.$store.state.saveFormVisible = false
    }
  }
}

</script>
<!-- Add "scoped " attribute to limit CSS to this component only -->
<style scoped>
#saveLayout {
  /*border: 1px solid #aaa;*/
  margin: auto;
  box-shadow: 0px 0px 1px 1px #eee;
  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #eee;
  padding: 10px;
}

</style>
