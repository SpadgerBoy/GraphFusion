# VueTemplate

读取数据的路径不要加上目录切换。。。。../../

### data download


      // let key = 'Fusion'
      // let obj 
      // for(let i = 0; i < globalGraphList.length; i++) {
      //   if(globalGraphList[i].key == key) {
      //     obj = globalGraphList[i]
      //     break
      //   }
      // }
      // var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

      // var eleLink = document.createElement('a')
      // eleLink.href = "data:" + data
      // eleLink.download = key + '.json'
      // eleLink.click();
      // return


###消息

laplacian 更新时候 只改了整个大图中的节点属性

而大图中的位置改变，会影响子图中数据的变化？？
但是子图中移动位置数据变化，不会影响大图中的数据变化，已断开消息的共享变量
vuex中数组和各个子图共享对象变量

### 生物网络

1. the Gene Regulatory  Network  (GRN)
   基因调控网络, 
2. Protein  Interaction Network
    相互作用网络
3. Metabolic Network
      代谢网络

All Scale-free network

P: Protein abundance 蛋白质活性

KIN：激酶活性

tscript：transcriptional activity， 转录活性 紫色三角形

bp：biological process

edge 从publication里面得到

# Props用法

如果props传递的参数是对象，那么可以修改props，父亲也会修改；
如果想避免，可以 在data中定义一个变量，保存props，
同时watch props，保证props变化，本地也可以变化

# 创建日期new date 更新，对于高频变化会有问题，new date（）只精确到s！！！！，所以1S内不会有变化

# 有个全局变量，各个部分不断更新消息就行，避免直接传递对象


#### 算法布局

1. 看到过程中存在的问题，涉及用户交互界面，而不只是一个算法的运行结果
合理的数据说明系统的功能

2. 涉及问题
   2.1 初始布局，初始布局是否就是当前页面显示的布局？
   2.2 全局布局，什么样才是一个好的全局布局？原始算法里是力导向布局的结果，
   2.3 算法里面的idealdistance是力导向后算出来的节点之间的物理距离？ 为什么不是graph distance？ 
      如果理想距离用ideal distance，怎么和用户调整的实际距离一致？ 

   原来算法中，必须用的距离是实际距离，所以先得用力导向产生一个实际距离，当成graph布局中理想布局

3. Laplacian迭代时候，不应该用force，太慢

4. 事件在mutation里面写  无法追踪，太难调试

5. 需要修改，Laplacian 的时候，子图的ideal distance 不是右侧的实际距离，应该根据实际图（只是子图上节点的平均距离）重新调整大小

