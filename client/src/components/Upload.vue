<template>
  <div id="uploadView">
    <el-tabs>
      <el-tab-pane label="Public Graphs">
        <el-table :data="publicGraphInfo" @cell-click="clickCell" height="350" border style="width: 100%"
         :default-sort = "{prop: 'time', order: 'descending'}" >
          <el-table-column prop="name" sortable label="Graph Name">
            <span slot="label">Graph Name</span>
          </el-table-column>
          <el-table-column prop="tags" sortable label="Description">
          </el-table-column>
          <el-table-column prop="time" sortable label="Date">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Upload Graph">
        <el-form ref="form" label-width="120px">
          <el-form-item label="Graph Name">
            <el-input placeholder="Required" v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="Description">
            <el-input placeholder="Optional" v-model="tags"></el-input>
          </el-form-item>
          
          <!-- <el-form-item label="Upload Graph">
           <el-input placeholder="Required" v-model="input2">
                <el-button slot="append" icon="el-icon-upload"></el-button>
            </el-input>
           <el-upload class="upload-demo" drag :action="importFileUrl" :data="upLoadData" multiple>
              <i class="el-icon-upload "></i>
              <div class="el-upload__text ">Click</div>
              <div class="el-upload__tip" slot="tip">Only json/csv supported</div>
            </el-upload>
          </el-form-item> -->
           
        </el-form>
        <!-- <div style="text-align: cnter; margin-top: 30 ">
          <el-button size="medium ">Submit</el-button>
        </div> -->
        <div style="text-align: center">
          <el-upload class="upload-demo" action="test" :before-upload="beforeUpload" multiple>
            <!-- <i class="el-icon-upload "></i> -->
            <el-button size="medium ">Upload</el-button>
            <div class="el-upload__tip" slot="tip">Only <span id='iconFile' style="font-weight: bold; color: steelblue" @click="fileFormat">JSON/CSV</span> supported, file size
              < 10 MB</div>
          </el-upload>
          </div>
      </el-tab-pane>
    </el-tabs>
    </div>
</template>

<script>
import { Loading } from 'element-ui'
import { loadedGraphData } from '../api/global.js'
export default {
  data() {
    return {
      publicGraphInfo: [],
      name: '',
      tags: '',
      upLoadData: {
        file: '123456',
        occurTime: '2024-11'
      }
    }
  },
  mounted: function() {
    var self = this
    this.$nextTick(function() {
      // Code that will run only after the
      // entire view has been rendered
    })
    this.getPublicGraphInfo()
  },
  watch: {
    nodes: function(newNodes, oldNodes) {
      this.updateView(newNodes)
    }
  },
  methods: {
    getPublicGraphInfo() {
      let self = this
      let paramsObj = {
        limit: 10
      }
      let Url = 'getPublicGraphInfo'
      CommunicateWithServer('get', paramsObj, Url,  data => {
        let infoArr = data['publicGraphInfo']
        console.log('12:',data)
        for (let i in infoArr) {
          self.publicGraphInfo.push({
            'id': infoArr[i][0],
            'name': infoArr[i][1],
            'tags': infoArr[i][2],
            'time': infoArr[i][3]
          })
        }
        console.log('11:',self.publicGraphInfo)
      })
    },
    beforeUpload(file) {
      let self = this
      let formData = new URLSearchParams()
      var reader = new FileReader(); //新建一个FileReader
      reader.readAsText(file, "UTF-8"); //读取文件 
      reader.onload = function(evt) { //读取完文件之后会回来这里
        var fileString = evt.target.result; // 读取文件内容
        // console.log(fileString)
        window.myfile = file
        formData.append('file', fileString)
        formData.append('name', self.name)
        formData.append('tags', self.tags)
        self.$store.state.graphName = self.name
        self.$store.state.graphDescription = self.tags
        let message = 'uploadGraph'
        let Url = message
        self.$api.post(Url, formData, data => {
          self.$store.state.loadedGraphData = fileString
        })
      }
    },

    clickCell(row, event, column) {
      let self = this
      let graphId = row.id
      console.log('select graphId', graphId)
      this.$store.state.graphName = row.name
      this.$store.state.graphDescription = row.tags
      let Url = 'getPublicGraphData'
      let options = {} 
      options['text'] = 'Loading'
      options['spinner'] = 'el-icon-loading'
      options['background'] = 'rgba(120, 120, 120, 0.3)'
      options['customClass'] = 'loading'
      let loadingInstance = Loading.service(options)
      let paramsObj = {'graphId': graphId }

      CommunicateWithServer('get', paramsObj, Url, data => {
        self.$store.state.loadedGraphData = data['publicGraphData'][0][0]
        self.$store.state.loadedGraphDataSignal =  Math.random()
        loadingInstance.close()
      })


    },
    fileFormat() {
      let csvTable = "<table >\
        <tr>\
          <th>Source</th>\
          <th>Target</th>\
          <th>Weight</th>\
        </tr>\
        <tr>\
          <td> a </td>\
          <td> b </td>\
          <td> 1 </td>\
        </tr>\
        <tr>\
          <td>...</td>\
          <td>...</td>\
          <td>...</td>\
        </tr>\
      </table>"

      this.$alert(csvTable, 'Data Format', {
        confirmButtonText: 'OK',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          })
        }
      })
    }
  }
}

</script>
<!-- Add "scoped " attribute to limit CSS to this component only -->
<style scoped>
#uploadView {
  /*border: 1px solid #aaa;*/
  margin: auto;
  position: absolute;
  top: calc(10% + 42px);
  left: 10%;
  right: 10%;
  box-shadow: 0px 0px 1px 1px #eee;
  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #eee;
  padding: 10px;
}

#iconFile:hover {
  cursor: pointer;
}
.el-loading-spinner{
  font-size: 4em;
}
.el-loading-text {
  color: gray !important;
}
.el-icon-loading:before {
  color: gray !important;
}
text {
  font: "Helvetica Neue "!important;
}

</style>
