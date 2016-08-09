from os import getenv
import pymssql

server = "SERVICIOS-PC\AVATTIA"
user = "sa"
password = "aitva"


def getData(db=None):
    conn = pymssql.connect(server, user, password, "AZTECA")
    cursor = conn.cursor()
    cursor.execute('SELECT * from dbo.p_clie')
    return cursor.fetchone()
