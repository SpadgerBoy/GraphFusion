import * as d3 from 'd3';

// client/src/components/GetSubGraph.js
// 读取 JSON 文件
const path = 'static/A.json'; 

d3.json(path, function(err, data) {
  if (err) {
    console.error('Error loading the JSON file:', err);
    return;
  }

  let graphFusion={ 'key': 'Fusion', 'type': 'normal' }
  
  if (data['graph'] !== undefined) {
    graphFusion.nodes = data['graph'].nodes;
    graphFusion.links = data['graph'].edges;
    dataType = 'biology';
  } else {
    graphFusion.nodes = data.nodes;
    graphFusion.links = data.links;
  }

  // 构建邻接表
  const adjList = buildAdjacencyList(graphFusion.nodes, graphFusion.links);

  // 查找所有长度为 k 的环
  const k = 3; // 
  const cycles = findCycles(adjList, k);
  // 输出结果
  console.log(`Found ${k}-cycles:`, cycles);
  console.log(cycles)

});

// 构建邻接表
function buildAdjacencyList(nodes, links) {
  const adjList = {};

  nodes.forEach(node => {
    adjList[node.id] = [];
  });

  links.forEach(link => {
    const source = link.source;
    const target = link.target;
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
        const cycle = [...path, start].sort();
        if (!cycles.some(c => c.every((v, i) => v === cycle[i]))) {
          cycles.push(cycle);
        }
      }
      return;
    }

    for (const neighbor of adjList[node]) {
      if (path.includes(neighbor)) continue; // 避免回溯
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
