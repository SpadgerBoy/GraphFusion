/*
* @Author: wakouboy
* @Date:   2018-08-08 23:32:06
* @Last Modified by:   wakouboy
* @Last Modified time: 2018-08-26 12:42:50
*/
import * as types from './mutation-type.js';

export default {
    nameAsyn({commit}, {age, name}) {
        commit(types.SET_NAME, name);
        commit(types.SET_AGE, age);
    },

    addSubgraphView({commit}, subgraphView) {
        commit(types.ADD_SUBGRAPH_VIEW, subgraphView);
    },
    updateSubgraphView({commit}, subgraphView) {
        commit(types.UPDATE_SUBGRAPH_VIEW, subgraphView);
    },

    addSubgraph({commit}, subgraph) {
        commit(types.ADD_SUBGRAPH, subgraph);
    },
    updateSubgraph({commit}, subgraph) {
        commit(types.UPDATE_SUBGRAPH, subgraph);
    },

    removeSubgraph({commit}, subgraphId) {
        commit(types.REMOVE_SUBGRAPH, subgraphId);
    },

    removeAllSubgraph({commit}, subgraphTime) {
        commit(types.REMOVE_ALL_SUBGRAPH, subgraphTime);
    },
     

    setFocusSubgraph({commit}, subgraphId) {
        commit(types.SET_FOCUS_SUBGRAPH, subgraphId);
    },

    moveNode({commit}, movedNodeInfo) {
        commit(types.MOVE_NODE, movedNodeInfo);
    },
    
    moveNodeInContour({commit}, movedNode) {  // move node in contour, change node in other contour
        commit(types.MOVE_NODE_IN_CONTOUR, movedNode);
    },

    // setMovedNode({commit}, movedNode) {
    //     commit(types.SET_MOVED_NODE, movedNode);
    // }



};
