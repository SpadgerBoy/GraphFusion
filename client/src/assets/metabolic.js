/*
* @Author: wakouboy
* @Date:   2018-08-23 12:10:32
* @Last Modified by:   wakouboy
* @Last Modified time: 2018-08-23 14:32:53
*/
var nodes = [
{'id':1, 'label': '乙醛酸'},
{'id':2, 'label': '丝氨酸'},
{'id':3, 'label': '酮戊二酸'},
{'id':1.5, 'label': ''},
{'id':1.6, 'label': 'NADH+H'},
{'id':1.7, 'label': 'NAD'},
{'id':4, 'label': '草酰丁二酸'},
{'id':4.5, 'label': ''},
{'id':4.6, 'label': 'NAD+'},
{'id':4.7, 'label': 'NADH+H+'},
{'id': 5, 'label': '异柠檬酸'},
{'id':6, 'label': '异乌头酸'},
{'id':7, 'label': '柠檬酸'},
{'id':8, 'label': '草酰乙酸'},
{'id':9, 'label': '苹果酸'},
{'id':10, 'label': '反丁烯二酸'},
{'id': 10.5, 'label': ''},
{'id': 10.6, 'label': 'FAD-FP3'},
{'id': 10.7, 'label': 'FADH3-FP3'},
{'id':11, 'label': '琥珀酸'},
{'id':12, 'label': '琥珀酰CoA'},
{'id':13, 'label': '乙酰CoA'},
{'id': 13.5, 'label': ''},
{'id': 13.6, 'label': '+NAD'},
{'id': 13.7, 'label': 'NADH+H+'},
{'id':14, 'label': '丙酮酸'},
{'id':14.1, 'label': '丙氨酸'},
{'id':14.2, 'label': '发酵过程'},
{'id':15, 'label': '磷酸烯 醇式 酮酸'},
{'id':16, 'label': '磷酸甘油酸'},
{'id':17, 'label': '甘油 醛-3-磷酸'},
{'id':18, 'label': '二羟基丙酮磷酸'},

{'id':19, 'label': '果糖-6-磷酸'},
{'id':20, 'label': '葡萄糖-6-磷酸'},
{'id':21, 'label': '葡萄糖-1-磷酸'},
{'id':22, 'label': '淀粉'},

{'id':23, 'label': '尿苷二磷酸 葡萄糖'},
{'id':24, 'label': '尿苷二磷酸 葡萄糖醛酸'},
{'id':25, 'label': '果胶质'},
{'id':26, 'label': '纤维素'},
{'id':27, 'label': '半纤维素'},
{'id':28, 'label': '葡萄糖'},
{'id':29, 'label': '糖醛酸'},
{'id':30, 'label': 'L-抗坏血酸'},

{'id':31, 'label': '二氧化碳'},
{'id':32, 'label': '磷酸戊糖'},
{'id':33, 'label': '磷酸赤藓糖'},
{'id':34, 'label': '核酸'},
{'id':35, 'label': '莽草酸'},
{'id':36, 'label': '芳香族氨基酸'},
{'id':37, 'label': '芳香族化合物'},


{'id':38, 'label': '丙二酰CoA'},
{'id':39, 'label': '脂肪酸'},
{'id':40, 'label': '脂肪'},
{'id':41, 'label': '黄酮类'},

{'id': 42, 'label': ''},
{'id': 43, 'label': 'CO2'},
{'id': 44, 'label': '核酮糖二磷酸'},
{'id': 45, 'label': ''},
{'id': 46, 'label': ''},
{'id': 47, 'label': 'ADP+Pi'},
{'id': 48, 'label': 'ATP'},
{'id': 49, 'label': 'NADP+'},
{'id': 50, 'label': 'NADPH'},
{'id': 51, 'label': ''},
{'id': 52, 'label': 'O2'},
{'id': 53, 'label': 'H2O'},
{'id': 54, 'label': '光1'},
{'id': 55, 'label': '光2'}




]

var links = [
  {'source': 16, 'target': 42},
  {'source': 42, 'target': 43},
  {'source': 42, 'target': 44},
  {'source': 44, 'target': 45},
  {'source': 45, 'target': 46},
  {'source': 46, 'target': 19},
  {'source': 45, 'target': 47},
  {'source': 45, 'target': 48},
  {'source': 46, 'target': 49},
  {'source': 46, 'target': 50},

  {'source': 51, 'target': 52},
  {'source': 51, 'target': 53},
  {'source': 51, 'target': 54},
  {'source': 51, 'target': 55},

  {'source': 51, 'target': 47},
  {'source': 51, 'target': 48},
  {'source': 51, 'target': 49},
  {'source': 51, 'target': 50},


  {'source': 1 , 'target': 2},
  // {'source': 1 , 'target': 3},
  {'source': 1 , 'target': 1.5},
  {'source': 3 , 'target': 1.5},
  {'source': 1.5, 'target': 1.6},
  {'source': 1.5, 'target': 1.7},

  {'source': 3, 'target': 4},
  // {'source': 4, 'target': 5},
  {'source': 4, 'target': 4.5},
  {'source': 5, 'target': 4.5},
  {'source': 4.5, 'target': 4.6},
  {'source': 4.5, 'target': 4.7},


  {'source': 5, 'target': 6},
  {'source': 6, 'target': 7},
  {'source': 7, 'target': 8},
  {'source': 8, 'target': 9},
  {'source': 9, 'target': 10},
  // {'source': 10, 'target': 11},
  {'source': 10, 'target': 10.5},
  {'source': 10.5, 'target': 10.6},
  {'source': 10.5, 'target': 10.7},
  {'source': 10.5, 'target': 11},
  {'source': 11, 'target': 12},
  {'source': 12, 'target': 3},
  {'source': 7, 'target': 13},

  // {'source':13 , 'target': 14},
  {'source':13 , 'target': 13.5},
  {'source':14 , 'target': 13.5},
  {'source':13.5 , 'target': 13.6},
  {'source':13.5 , 'target': 13.7},

  {'source':14 , 'target':15 },
  {'source':14 , 'target':14.1 },
  {'source':14 , 'target':14.2 },

  {'source': 15, 'target': 16},
  {'source': 16, 'target': 17},
  {'source': 17, 'target': 18},
  {'source': 18, 'target': 19},
  {'source': 19, 'target': 20},
  {'source': 21, 'target': 22},
  {'source': 21, 'target': 20},


  {'source': 21, 'target': 23},
  {'source': 23, 'target': 24},
  {'source': 24, 'target': 25},
  {'source': 23, 'target': 26},
  {'source': 23, 'target': 27},
  {'source': 21, 'target': 28},
  {'source': 28, 'target': 29},
  {'source': 29, 'target': 30},

  {'source': 31, 'target': 20},
  {'source': 32, 'target': 20},
  {'source': 32, 'target': 33},
  {'source': 32, 'target': 34},
  {'source': 33, 'target': 35},
  {'source': 35, 'target': 36},
  {'source': 35, 'target': 37},
  {'source': 35, 'target': 36},


  {'source': 38, 'target': 13},
  {'source': 38, 'target': 39},
  {'source': 39, 'target': 40},
  {'source': 38, 'target': 41},



]

var metabolicGraph = {}
metabolicGraph['nodes'] = nodes
metabolicGraph['links'] = links

module.exports = metabolicGraph