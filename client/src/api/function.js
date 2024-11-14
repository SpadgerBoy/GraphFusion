/*
* @Author: wakouboy
* @Date:   2018-08-03 14:27:13
* @Last Modified by:   wakouboy
* @Last Modified time: 2018-12-23 22:46:56
*/
var transformPosition = function(graph, width, height) {
    var minx = 10000000000000000;
    var miny = 10000000000000000;
    var maxx = 0
    var maxy = 0
    var nodes = graph.nodes
    nodes.forEach(d=>{
      d.largx = d.x
      d.largy = d.y
    })
    for (var i = 0; i <nodes.length; i++) {
      minx = minx < nodes[i].x ? minx : nodes[i].x
      miny = miny < nodes[i].y ? miny : nodes[i].y
      maxx = Math.max(maxx, nodes[i].x)
      maxy = Math.max(maxy, nodes[i].y)
    }
    var scale = Math.max((maxx - minx) / width, (maxy - miny) / height) * 1.5
    // 
    // scale 需要进一步调整
    // var scale = 1
    graph.setting.scale = scale
    // if(scale > 1) {
    //   scale = scale * 1.5
    // }
    // else {
    //   scale = scale * 1.5
    // }
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].x -= minx;
      nodes[i].y -= miny;
    }
    var center = [0, 0]
    center[0] = (maxx + minx) / 2 - minx
    center[1] = (maxy + miny) / 2 - miny
    // for (var i in nodes) {
    //   center[0] += nodes[i].x
    //   center[1] += nodes[i].y
    // }
    // center[0] /= nodes.length
    // center[1] /= nodes.length


    // var bias = [width / 2 - center[0], height / 2 - center[1]]
    // for (var i in nodes) {
    //   nodes[i].x += bias[0]
    //   nodes[i].y += bias[1]
    // }
    
    // for(var i in nodes) {
    //   nodes[i].x = (nodes[i].x - width / 2) / scale + width / 2
    //   nodes[i].y = (nodes[i].y - height / 2) / scale + height / 2
    //   nodes[i].copyx = nodes[i].x
    //   nodes[i].copyy = nodes[i].y
    // }
    var bias = [ 0 - center[0], 0 - center[1]]
    for (var i in nodes) {
      nodes[i].x += bias[0]
      nodes[i].y += bias[1]
    }

    for(var i in nodes) {
      nodes[i].x = (nodes[i].x ) / scale + width / 2
      nodes[i].y = (nodes[i].y ) / scale + height / 2
      nodes[i].copyx = nodes[i].x
      nodes[i].copyy = nodes[i].y
    }

}

var getPath = function(id1, id2, graph) {
  let nodes = graph.nodes
  let links = graph.links
  let adjlist = {}
  let id2node = {}
  let ids = []
  let vis = {}
  let previs = {}
  nodes.forEach(d=>{
      adjlist[d.id] = []
      vis[d.id] = false
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

  let que = []
  que.push(id1)
  vis[id1] = true
  while(que.length > 0) {
    let q = que[0]
    que = que.slice(1)
    if(q == id2) break
    for(let i in adjlist[q]) {
      let t = adjlist[q][i]
      if(vis[t]) continue
      vis[t] = true
      previs[t] = q
      que.push(t)
    }
  }
  let s = id2
  let repeat = 0
  while(repeat++ < 1000) {
    ids.push(s)
    s = previs[s]
    if(s==undefined) break
  }
  return ids
}
var calConvexHull = function(graph, R) {
    var nodes = graph.nodes
    var points = []
    for (let i = 0; i < nodes.length; i++) {
        points.push([+nodes[i].x, (+nodes[i].y) * (-1), nodes[i].id]) // 将坐标原点放在左下角
    }
    var convexHull = getConvexHull(points)
    // if(graph.contourType == 'linear') {
    //   convexHull = []
    //   for(let i in points) {
    //     convexHull.push(points[i])
    //   }
    //   for(let i = points.length - 1; i > 0; i--) {
    //     convexHull.push(points[i])
    //   }
    // }
    convexHull.push(convexHull[0])


    var eConvexHull = expandConvexHull(convexHull, R)
    for (var i = 0; i < eConvexHull.length; i++) {
        eConvexHull[i][1] = -1 * eConvexHull[i][1]
    }
    return eConvexHull


    function cross(a, b, o) {
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    }

    /**
     * @param points An array of [X, Y] coordinates
     * Points in the result will be listed in counter-clockwise order.
     */

    function getConvexHull(points) {
        points.sort(function(a, b) {
            return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0];
        });

        var lower = [];
        for (var i = 0; i < points.length; i++) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
                lower.pop();
            }
            lower.push(points[i]);
        }

        var upper = [];
        for (var i = points.length - 1; i >= 0; i--) {
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
                upper.pop();
            }
            upper.push(points[i]);
        }

        upper.pop();
        lower.pop();
        return lower.concat(upper);
    }

    function expandConvexHull(points, R) {
        var len = points.length
        var eConvexHull = []
        for (var i = 0; i < len - 1; i++) {
            var vector = [points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1]]
            var lenVector = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
            var rVector = [vector[1] / lenVector * R, -vector[0] / lenVector * R] // 顺时针旋转90度
            var nPoint1 = [points[i][0] + rVector[0], points[i][1] + rVector[1]] // 线段平移
            // console.log(nPoint1)
            var nPoint2 = [points[i + 1][0] + rVector[0], points[i + 1][1] + rVector[1]]
            // var cPoint = points[i + 1]
            eConvexHull.push(nPoint1)
            eConvexHull.push(nPoint2)
            // eConvexHull.push(cPoint)

        }
        var end = [eConvexHull[0][0], eConvexHull[0][1]]
        eConvexHull.push(end)
        return eConvexHull
    }
}

function copy(o) {
   // var output, v, key;
   // output = Array.isArray(o) ? [] : {};
   // for (key in o) {
   //     v = o[key];
   //     output[key] = (typeof v === "object") ? copy(v) : v;
   // }
   // 
   var output = $.extend(true, {}, o); 

   return output;
}

// function copy(object2){
//   let object1 = {}
//    $.extend(true,object1, object2)
//   return object1
// }

function graphSizeRescale(graph, width, height, radius) {
  let nodes = graph.nodes
  let xdomain = d3.extent(nodes, d => {
    return d.x
  })
  let ydomain = d3.extent(nodes, d => {
    return d.y
  })
  if (xdomain[0] < radius || xdomain[1] > width - radius) {
    let xscale = d3.scaleLinear().domain(xdomain).range([radius, width - radius])
    nodes.forEach(d => {
      d.x = xscale(d.x)
    })
  }
  if (ydomain[0] < radius || ydomain[1] > height - radius) {
    let yscale = d3.scaleLinear().domain(ydomain).range([radius, height - radius])
    nodes.forEach(d => {
      d.y = yscale(d.y)
    })
  }
}



// var contourColor = d3.scaleOrdinal(d3.schemeCategory20)


export {
    transformPosition,
    calConvexHull,
    contourColor,
    copy,
    getPath

}