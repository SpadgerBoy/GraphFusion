# tmpleate

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


###Bugs
静态文件报告数据只能放在static文件夹下


### 通信
拖动全局上的子图内节点： movedNode 信号，在Contour中监听，contour修改，同时update 了
 subgraph List，在这里updatesubgraphlist 不合理


 ### 布局

 什么是一个好的global 布局？？？？
 现在默认是力导向的布局
 ·