/*
* @Author: wakouboy
* @Date:   2018-08-08 23:30:56
* @Last Modified by:   wakouboy
* @Last Modified time: 2019-01-01 00:46:44
*/
export const name = (state) => {
    return state.name;
}

export const dragNodeEventStop = (state) => {
    return state.dragNodeEventStop
}

export const subgraphViewList = (state) => {
    return state.subgraphViewList
}


export const subgraphList = (state) => {
    return state.subgraphList
}


export const removedSubgraphId = (state) => {
    return state.removedSubgraphId
}

export const updatedSubgraphIds = (state) => {
    return state.updatedSubgraphIds
}

export const removeAllSubgraph = (state) => {
    return state.removeAllSubgraph
}
export const updateContourSignal = (state) => {
    return state.updateContourSignal
}

//focus subgraph
export const focusSubgraph = (state) => {
    return state.focusSubgraph
}
export const focusSubgraphUpdateFromListSignal = (state) => {
    return state.focusSubgraphUpdateFromListSignal
}
export const focusSubgraphData = (state) => {
    return state.focusSubgraphData
}

//

export const movedNodeInfo = (state) => {
    return state.movedNodeInfo
}

export const loadedGraphDataSignal = (state) => {
    return state.loadedGraphDataSignal
}

export const loadedGraphData = (state) => {
    return state.loadedGraphData
}


export const linkDistance = (state) => {
    return state.linkDistance
}
export const nodeStrength = (state) => {
    return state.nodeStrength
}
export const nodeSize = (state) => {
    return state.nodeSize
}

export const labelSize = (state) => {
    return state.labelSize
}

export const linkSize = (state) => {
    return state.linkSize
}
export const nodeLabel = (state) => {
    return state.nodeLabel
}

export const rotateAngle = (state) => {
    return state.rotateAngle
}


export const rotateStart = (state) => {
    return state.rotateStart
}



// diagrm 
export const saveFormVisible = (state) => {
    return state.saveFormVisible
}

//
//
export const graphName = (state) => {
    return state.graphName
}
export const graphDescription = (state) => {
    return state.graphDescription
}

//
export const finalGraphLayout = (state) => {
    return state.finalGraphLayout
}


export const movedNodeInContour = (state) => {
    return state.moveNodeInContour
}

//zoom
//
export const zoomOutSubgraph = (state) => {
    return state.zoomOutSubgraph
}

export const zoomInSubgraph = (state) => {
    return state.zoomInSubgraph
}

//
//

export const movedNode = (state) => {
    return state.movedNode
}



export const forceLayoutSignal = (state) => {
    return state.forceLayoutSignal
}

export const alpha = (state) => {
    return state.alpha
}

export const newGraphSignal = (state) => {
    return state.newGraphSignal
}

export const strokeOpacity = (state) => {
    return state.strokeOpacity
}


export const fillOpacity = (state) => {
    return state.fillOpacity
}





//
//
export const clickedNode1 = (state) => {
    return state.clickedNode1
}
export const clickedNode2 = (state) => {
    return state.clickedNode2
}

export const other = (state) => {
    return `My name is ${state.name}, I am ${state.age}.`;
}