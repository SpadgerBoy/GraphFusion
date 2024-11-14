/*
* @Author: wakouboy
* @Date:   2018-08-10 10:18:51
* @Last Modified by:   wakouboy
* @Last Modified time: 2018-08-27 21:44:42
*/
var traverseNodes = function(graph) {
    let nodes = graph.nodes
    let links = graph.links
    let adjlist = {}
    let id2node = {}
    let ids = []
    nodes.sort(function(a, b) {
        return a.id < b.id
    })
    nodes.forEach(d=>{
        id2node[d.id] = d
        ids.push(d.id)
        adjlist[d.id] = []
    })
    for(let i in links) {
        let s = links[i].source.id
        let t = links[i].target.id
        if(adjlist[s] == undefined) {
            adjlist[s] = []
        }
        if(adjlist[t] == undefined) {
            adjlist[t] = []
        }
        adjlist[s].push(t)
        adjlist[t].push(s)
    }
    let start = ids[0]
    ids.sort(function (a, b) {
        return adjlist[a].length - adjlist[b].length
    })
    let vis = {}
    let sequence = []
    for(let i in ids) {
        let id = ids[i]
        if(vis[id] == undefined) {
            vis[id] = true
            sequence.push(id)
            dfs(id)
        } 
    }
    let new_nodes = []
    for(let i in sequence) {
        new_nodes.push(id2node[sequence[i]])
    }
    graph.nodes = new_nodes

    function dfs(s) {
        for(let i in adjlist[s]) {
            let t = adjlist[s][i]
            if(vis[t]) continue
            vis[t] = true
            sequence.push(t)
            dfs(t)
        }
    }
}

var circleLayout = function(graph) {
    // console.log('circle layout:', JSON.parse(JSON.stringify(graph)))
    traverseNodes(graph)
    let nodes = graph.nodes
    let links = graph.links

    // console.log('circle layout2:', JSON.parse(JSON.stringify(graph)))
    
    
    // 初始化最小值和最大值
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    var sumx=0, sumy=0;
    nodes.forEach(function(node) {
        // 更新最小值和最大值
        if (node.x < minX) minX = node.x;
        if (node.x > maxX) maxX = node.x;
        if (node.y < minY) minY = node.y;
        if (node.y > maxY) maxY = node.y;
        node.largx = node.x;
        node.largy = node.y;
        sumx += node.x
        sumy += node.y
    })

    let centerX = sumx /nodes.length
    let centerY = sumy /nodes.length
    
    

    let width = Math.abs(maxX- minX) *2.0
    let height = Math.abs(maxY - minY)*2.0
    // let width = 114
    // let height = 122
    
    
    let layoutR = Math.min(width, height) * 0.4

    // let centerX = width / 2
    // let centerY = height / 2

    // console.log(width, height, layoutR, centerX, centerY, )
    let scale = function(i) {
        return i * Math.PI * 2 / nodes.length
    }
    let cx=0 ,cy=0;
    var sumx=0, sumy=0;
    nodes.forEach(function(node, index){
        let theta = scale(index)
        let x = layoutR * Math.sin(theta) + centerX
        let y = layoutR * Math.cos(theta) + centerY
        node.px = node.x
        node.py = node.y
        node.x = x
        node.y = y
        // sumx += x
        // sumy += y
        // console.log(x, y)
    })
    
    // cx = sumx /nodes.length
    // cy = sumy /nodes.length
    // console.log('cx,cy:', cx, cy)
    // return [cx, cy]
    return [centerX, centerY]
}

var lineLayout = function(graph, width, height) {
    traverseNodes(graph)
    let nodes = graph.nodes 
    let links = graph.links
    let slope = 1
    // nodes.sort(function (a, b) {
    //     return a.id > b.id
    // })
    graph.nodes.forEach(d=>{
        console.log(d.id)
    })
    let mostleftindex = -1
    let mostrightindex = -1
    let left = 100000
    let right = -0
    nodes.forEach((d, i) =>{
        if(d.x < left) {
            mostleftindex = i
            left = d.x
        }
        if(d.x > right) {
            mostrightindex = i
            right = d.x
        }
    })

    if(nodes[mostleftindex].y > nodes[mostrightindex].y) {
        slope = -1
    }

    let lineLength = Math.min(width, height) * 0.8 * 1
    let segmentLength = lineLength / (nodes.length - 1)
    let centerX = width / 2
    let centerY = height / 2
    // console.log(centerX, centerY)
    centerX += slope * segmentLength * Math.sqrt(2) / 4
    centerY += segmentLength * Math.sqrt(2) / 4
    let mid = nodes.length / 2
    for(let i in nodes) {
        nodes[i].x = centerX + slope * (i - mid) * segmentLength * Math.sqrt(2) / 2
        nodes[i].y = centerY + (i - mid) * segmentLength * Math.sqrt(2) / 2
    }
}

var rectLayout = function(graph, width, height) {
    traverseNodes(graph)
    let nodes = graph.nodes
    let links = graph.links
    let layoutR = Math.min(width, height) * 0.8
    // nodes.sort(function (a, b) {
    //     return a.id > b.id
    // })

    let nodeArrLen = nodes.length

    var matrixWidth = Math.floor(Math.sqrt(nodeArrLen))
    if (Math.abs(matrixWidth * matrixWidth - nodeArrLen) > 0.01)
        matrixWidth += 1

    var matrixHeight = Math.floor(nodeArrLen / matrixWidth)
    if (nodeArrLen / matrixWidth - matrixHeight > 0.01) {
        matrixHeight += 1
    }

    var ci = Math.floor(matrixHeight / 2),
        cj = Math.floor(matrixWidth / 2);
    var potentialLocs = []

    var sx = width * 0.8/ (matrixWidth)
    var sy = height * 0.8 / (matrixHeight)
    let centerX = width / 2
    if(matrixWidth%2 ==0) {
        centerX += sx / 2
    }
    let centerY = height / 2
    if(matrixHeight%2 ==0) {
        centerY += sy / 2
    }
    for (var i = 0; i < matrixHeight; i++) {
        for (var j = 0; j < matrixWidth; j++) {
            potentialLocs.push([(j - cj) * sx + centerX, (i - ci) * sy + centerY])
        }
    }


    for (var i = 0; i < nodeArrLen; i++) {
        let hang = Math.floor(i / matrixWidth)
        let index = 0
        if(hang % 2 ==0 ) {
            index = i
        }
        else {
            index = hang * matrixWidth + (matrixWidth - i % matrixWidth - 1)
        }
        // console.log(i, index)
        nodes[i].x = potentialLocs[index][0]
        nodes[i].y = potentialLocs[index][1]
    }
}



export {
    circleLayout,
    lineLayout,
    rectLayout
}