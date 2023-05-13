import json
import pyodbc

from typing import List
from model.models import Todo
from pydantic import parse_obj_as

database = 'basic-workshop'
driver = '{ODBC Driver 17 for SQL Server}'

def get_config():
    filename = './static/db_connection.config'
    
    configJson = {}
    readLines = ''
    
    f = open(filename, 'r')
    lines = f.readlines()
    for line in lines:
        line = line.strip()  # 줄 끝의 줄 바꿈 문자를 제거한다.
        readLines = readLines + line
    configJson = json.loads(readLines)
    f.close()

    return configJson

def get_db_connection():
    configJson = get_config()
    
    cnxn_string = 'DRIVER=' + driver + ';SERVER=' + configJson['serverName'] + ';DATABASE=' + database + ';UID=' + configJson['admin'] + ';PWD=' + configJson['password']

    conn = pyodbc.connect(cnxn_string)
    
    return conn

def make_table():
    conn = get_db_connection()
    c = conn.cursor()

    c.execute('''CREATE TABLE todo
             (todo TEXT , is_done BIT, created DATETIME)''')

    conn.commit()
    conn.close()

def add_todo(todo: Todo):
    conn = get_db_connection()

    query = 'INSERT INTO todo (todo, is_done, created) VALUES (?, ?, ?)'

    params = (todo.todo, todo.is_done, todo.created)
    
    cursor = conn.cursor()
    result = cursor.execute(query, params)
    conn.commit()

    cursor.close()
    conn.close()

    return result

def update_todo(todo: Todo):
    conn = get_db_connection()

    query = "UPDATE todo SET is_done = ?, created = ? WHERE todo LIKE '"+todo.todo+"'"

    params = (todo.is_done, todo.created)
    
    cursor = conn.cursor()
    result = cursor.execute(query, params)
    conn.commit()

    cursor.close()
    conn.close()

    return result

def read_todo():
    conn = get_db_connection()

    query = 'SELECT * FROM todo order by created desc'
    
    cursor = conn.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    
    todos = []
    for row in results:
        row_dict = dict(zip([column[0] for column in cursor.description], row))
        todos.append(Todo.parse_obj(row_dict))

    cursor.close()
    conn.close()
    return todos

