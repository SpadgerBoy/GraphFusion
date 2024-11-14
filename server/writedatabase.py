# -*- coding: utf-8 -*-
# @Author: wakouboy
# @Date:   2018-08-12 20:34:25
# @Last Modified by:   wakouboy
# @Last Modified time: 2018-08-13 00:10:06
import torndb
import time
import datetime
import json
#connect to the db
# db = torndb.Connection('192.168.10.9', 'dblp', user = 'dblp', password = 'pkuvisdblp')
db = torndb.Connection('10.1.114.77', 'graphfusion', user = 'zxd', password = '123456')



def getPublicGraphInfo(self):
        # sql = "select * from authorDict where name = %s"
    sql = "select * from publicGraphInfo"
    publicGraphInfo = db.query(sql)
    return publicGraphInfo

def insertData():
    sql = "insert into publicGraph(name, tags, time) values (%s, %s, %s)"
    dt=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return db.execute(sql, 'test', 'test', dt)

def createTable():
    # db.execute("CREATE TABLE IF NOT EXISTS \
    #     publicGraph(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), tags VARCHAR(255), time VARCHAR(255))")
    db.execute("CREATE TABLE IF NOT EXISTS \
         publicGraph(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), tags VARCHAR(255), data longtext, time VARCHAR(255))")
def dropTable():
    db.execute("drop table if exists publicGraph")

# insertData()

# dropTable()
createTable()
# print(insertData())

