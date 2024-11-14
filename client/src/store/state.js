/*
* @Author: wakouboy
* @Date:   2018-08-08 23:30:38
* @Last Modified by:   wakouboy
* @Last Modified time: 2019-01-01 00:46:22
*/
// 信号的加上signal
// 
const state = {
    forceGlobalLayout: null,
    finalGraphLayout: null,
    subgraphViewList: [], // 保存subgraph list view 数据, 和全局graph 布局不耦合, 只是为了视图的渲染, 大小size不一样
    subgraphList: [], // 保存subgraph 数据, 用户想要子图的结构
    updatedSubgraphIds: [],
    removedSubgraphId: null,
    dragNodeEventStop: false,
    updateSubgraphSignal: null, // 全局内拖拽节点，需要更新子图list中的东西
    //
    focusSubgraph: null,
    focusSubgraphUpdateFromListSignal: null,
    focusSubgraphData: null,

    // contourUpdateMethods
    updateContourSignal: null,

    // 
    // 
    // 
    // color
    strokeOpacity: 1,
    fillOpacity: 0.5,
    // 
    // 

    removeTime: null,
    movedNodeInfo: null,
    loadedGraphDataSignal:null,
    loadedGraphData:null,

    linkDistance: 30,
    nodeStrength: 10,
    nodeSize: 5,
    linkSize: 2,
    nodeLabel: false,
    linkForce: 0.5,
    rotateAngle: 0,
    labelSize: 0.7,

    // diagrma
    saveFormVisible: false,

    movedNodeInContour: {'id': -1, 'contourId': -1},

    //
    graphName: 'example',
    graphDescription: 'example',

    //zoom
    zoomInSubgraph: null,
    zoomOutSubgraph: null,

    //
    movedNode: null,

    //
    //
    clickedNode1: null,
    clickedNode2: null,

    forceLayoutSignal: null,

    rotateStart: null,

    alpha: 1000,

    newGraphSignal: null

};

export default state;