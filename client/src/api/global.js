/*
* @Author: wakouboy
* @Date:   2018-07-31 10:00:37
* @Last Modified by:   wakouboy
* @Last Modified time: 2018-12-21 21:55:34
*/
var alpha = 50
var contourExpansion = 10
var subgraphNameList = [
    ['A', 0], ['B', 0], ['C', 0], ['D', 0], ['E', 0], ['F',0],
    ['G', 0], ['H', 0], ['I', 0], 
    ['J', 0], ['K', 0], ['L', 0]
]

var globalGraph = {}
var loadedGraphData = ''
globalGraph['nodes'] = []
globalGraph['links'] = []
globalGraph['id2index'] = {}
export {
    alpha,
    contourExpansion,
    subgraphNameList,
    globalGraph,
    loadedGraphData
}