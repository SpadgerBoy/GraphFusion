/*
* @Author: wakouboy
* @Date:   2018-08-08 23:31:53
* @Last Modified by:   wakouboy
* @Last Modified time: 2019-01-01 00:00:44
*/
import * as types from './mutation-type.js';
import Vue from 'vue'
export default {
    [types.ADD_SUBGRAPH_VIEW](state, subgraph) {
        state.subgraphViewList.push(subgraph)
    },
    [types.UPDATE_SUBGRAPH_VIEW](state, subgraphView) {
        for(let i in state.subgraphViewList) {
            if(state.subgraphViewList[i].key == subgraphView.key) {
                state.subgraphViewList[i] = subgraphView
            }
        }
        
    },
    [types.ADD_SUBGRAPH](state, subgraph) {
        state.subgraphList.push(subgraph)
    },
    [types.UPDATE_SUBGRAPH](state, subgraph) {
        for(let i in state.subgraphList) {
            if(state.subgraphList[i].key == subgraph.key) {
                state.subgraphList[i] = subgraph
            }
        }
    },
    [types.UPDATE_SUBGRAPH_VIEW](state, subgraph) {
        for(let i in state.subgraphViewList) {
            if(state.subgraphViewList[i].key == subgraph.key) {
                state.subgraphViewList[i] = subgraph
                console.log('mutations', subgraph.key)
                // Vue.set(state.subgraphViewList, i, subgraph)
            }
        }
    },


    [types.REMOVE_ALL_SUBGRAPH](state, removeTime) {
        state.removeTime = removeTime
        state.subgraphList = []
        state.subgraphViewList = []
    },

    [types.REMOVE_SUBGRAPH](state, subgraphId) {
        let index = 0
        for(let i in state.subgraphList) {
            if(state.subgraphList[i].key == subgraphId) {
                index = i
            }
        }
        state.subgraphList.splice(index, 1)
        state.subgraphViewList.splice(index, 1)
        state.removedSubgraphId = subgraphId
    },
    [types.REMOVE_SUBGRAPH](state, subgraphId) {
        let index = 0
        for(let i in state.subgraphList) {
            if(state.subgraphList[i].key == subgraphId) {
                index = i
            }
        }
        state.subgraphList.splice(index, 1)
        state.subgraphViewList.splice(index, 1)
        state.removedSubgraphId = subgraphId
    },

    [types.SET_FOCUS_SUBGRAPH](state, subgraphId) {
        state.focusSubgraph = subgraphId    
    },
    [types.MOVE_NODE](state, movedNodeInfo) {
        state.movedNodeInfo = movedNodeInfo  
    },

    [types.MOVE_NODE_IN_CONTOUR](state, movedNode) {
        state.movedNodeInContour.id = movedNode.id
        state.movedNodeInContour.contourId = movedNode.contourId
    },

    // [types.SET_MOVED_NODE](state, movedNode) {
    //     state.movedNode = movedNode
    // }



};