# -*- coding: utf-8 -*-
# @Author: wakouboy
# @Date:   2018-08-12 20:16:26
# @Last Modified by:   wakouboy
# @Last Modified time: 2018-11-12 22:32:53
import pymysql
import time
import json
#connect to the db
# db = torndb.Connection('192.168.10.9', 'dblp', user = 'dblp', password = 'pkuvisdblp')
# conn = pymysql.connect(host='192.168.10.9', db='graphfusion', user = 'shuai.chen', password = 'q1w2e3r4')
conn = pymysql.connect(host='10.1.114.77', db='graphfusion', user = 'zxd', password = '123456')

cursor = conn.cursor()
class GraphData:
    def __init__ (self):
        self.authorHouse = {}
        self.authorDict = {}

    def getPublicGraphInfo(self):
        # sql = "select * from authorDict where name = %s"
        sql = "select id, name, tags, time from publicGraph"
        data = ''
        try:
            cursor.execute(sql)
            data = cursor.fetchall()
        except Exception as e:
            print(e)
        # print(data)
        return data
    def getPublicGraphData(self, graphId):
        # sql = "select * from authorDict where name = %s"
        sql = "select data from publicGraph where id = %s"
        cursor.execute(sql, graphId)
        data = cursor.fetchall()
        # print(data)
        return data
    def addGraph(self, data, name, tags, dt):
        sql = "insert into publicGraph(name, tags, data, time) values (%s, %s, %s, %s)"
        print(name, tags, dt)
        cursor.execute(sql, (name, tags, data, dt))
        conn.commit()
        return 1
