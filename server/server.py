# -*- coding: utf-8 -*-
import requests
import time
import random
import json
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.options
import os
import sys
import database
from tornado.options import define, options
import tornado.websocket
import datetime

# import frq_path_stat
define("port", default=13146, type=int, help = "run on the given port")

client_file_root_path = os.path.join(os.path.split(__file__)[0],'../')
client_file_root_path = os.path.abspath(client_file_root_path)

GraphData = database.GraphData()
class publicGraphInfoHandler(tornado.web.RequestHandler):
    def post(self):
      self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
      self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
      self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
   

    def get(self):
      self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
      self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
      self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
      publicGraphInfo = GraphData.getPublicGraphInfo()
      print('publicGraphInfo', len(publicGraphInfo))
      self.write({'publicGraphInfo': publicGraphInfo})

class publicGraphDataHandler(tornado.web.RequestHandler):
    def post(self):
      self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
      self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
      self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
     

    def get(self):
      self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
      self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
      self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
      params = self.get_argument('params')
      params = json.loads(params)
      graphId = params['graphId']
      publicGraphData = GraphData.getPublicGraphData(graphId)
      print('graphId', graphId)
      self.write({'publicGraphData': publicGraphData})


class uploadGraphHandler(tornado.web.RequestHandler):
    def post(self):
      self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
      self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
      self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
      params = self.get_argument('params')
      params = json.loads(params)
      graphFile = params['file']
      name = params['name']
      tags = params['tags']
      print('upload')
      dt=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
      if(GraphData.addGraph(graphFile, name, tags, dt)):
        self.write({'upload': 'success'})
      else:
        self.write({'upload': 'fail'})

    def get(self):
      self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
      self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
      self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
      print('...............checkClassNameHandler')
      
      self.write({'suc':'post'})


if __name__ == "__main__":
    tornado.options.parse_command_line()
    print('server running at 127.0.0.1:%d ...'%(tornado.options.options.port))
    print(client_file_root_path)
    app = tornado.web.Application(
        handlers=[
                  (r'/getPublicGraphInfo', publicGraphInfoHandler),
                  (r'/uploadGraph', uploadGraphHandler),
                  (r'/getPublicGraphData', publicGraphDataHandler),
                  (r'/(.*)', tornado.web.StaticFileHandler, {'path': client_file_root_path,
                                               'default_filename': 'index.html'}) # fetch client files
                  ],
        debug=True,
    )


    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
