import * as d3 from 'd3';

// 读取 JSON 文件
const path = 'static/A.json';
import { circleLayout, lineLayout, rectLayout } from './layout_1.js'


// 深拷贝函数
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
// 重构后的函数
var getSubGraphs = function (GF, k) {

  let graphFusion = JSON.parse(JSON.stringify(GF))
  // 构建邻接表
  const adjList = buildAdjacencyList(graphFusion.nodes, graphFusion.links);
  
  // 查找所有长度为 k 的环
  const cycles = findCycles(adjList, k);

  // 将环转换为子图
  const subGraphs = cycles.map(cycle => {
    const subGraph = {
      nodes: [],
      links: [],
      key: 'A',
      context:'A',
      setting: {
        radius: 5,
        scale : 1,
      },
      centerX: 0,
      centerY: 0, 
      rotateAngle:0,
      zoomScale: 1,
    };

    // 收集环中的节点
    cycle.forEach(nodeId => {
      const node = graphFusion.nodes.find(node => node.id === nodeId);
      if (node) {
        // 创建一个新的节点对象，并添加 index 属性
        subGraph.nodes.push(deepCopy(node));
      }
    });

    // 收集环中的边
    for (let i = 0; i < cycle.length; i++) {
      const sourceId = cycle[i];
      const targetId = cycle[(i + 1) % cycle.length];
      const link = graphFusion.links.find(link => (
        (link.source.id === sourceId && link.target.id === targetId) ||
        (link.source.id === targetId && link.target.id === sourceId)
      ));
      if (link) {
        subGraph.links.push(link);
      }
    }

    
    let [cx, cy] = circleLayout(subGraph)
    subGraph.centerX = cx;
    subGraph.centerY = cy;

    return subGraph;
  });
  // console.log(JSON.parse(JSON.stringify(subGraphs[0])))
  return subGraphs;
}

// 构建邻接表
function buildAdjacencyList(nodes, links) {
  const adjList = {};

  nodes.forEach(node => {
    adjList[node.id] = [];
  });

  links.forEach(link => {
    const source = link.source.id;
    const target = link.target.id;
    if (!adjList[source]) adjList[source] = [];
    if (!adjList[target]) adjList[target] = [];
    adjList[source].push(target);
    adjList[target].push(source);
  });

  return adjList;
}

// 查找所有长度为 k 的环
function findCycles(adjList, k) {
  const cycles = [];
  const visited = new Set();

  function dfs(node, start, path, depth) {
    if (depth === k) {
      if (adjList[path[path.length - 1]].includes(start)) {
        // 找到一个长度为 k 的环
        // const cycle = [...path, start].sort();
        const cycle = [...path].sort();
        if (!cycles.some(c => c.every((v, i) => v === cycle[i]))) {
          // console.log('cirle:', cycle)
          cycles.push(cycle);
        }
      }
      return;
    }

    for (const neighbor of adjList[node]) {
      if (path.includes(neighbor)) continue; // 避免回溯
      if (neighbor === start && depth < k - 1) continue; // 避免过早回到起点
      dfs(neighbor, start, [...path, neighbor], depth + 1);
    }
  }

  for (const node in adjList) {
    if (visited.has(node)) continue;
    visited.add(node);
    dfs(node, node, [node], 1);
  }

  return cycles;
}


export {
  getSubGraphs,
}
// 读取 JSON 文件并调用 getSubGraphs 函数
// d3.json(path).then(data => {
//   let graphFusion = { 'key': 'Fusion', 'type': 'normal' };

//   if (data['graph'] !== undefined) {
//     graphFusion.nodes = data['graph'].nodes;
//     graphFusion.links = data['graph'].edges;
//   } else {
//     graphFusion.nodes = data.nodes;
//     graphFusion.links = data.links;
//   }

//   const k = 3; // 设置 k 为 3
//   const subGraphs = getSubGraphs(graphFusion, k);

//   // 输出结果
//   console.log(`Found ${k}-cycles:`, subGraphs);
//   console.log(subGraphs);
// }).catch(err => {
//   console.error('Error loading the JSON file:', err);
// });