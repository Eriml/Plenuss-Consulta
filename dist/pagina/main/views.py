from django.shortcuts import render
from django.http import HttpResponseRedirect , HttpResponse ,JsonResponse
from django.core import serializers
from os import getenv
import pymssql
import time
import json
import re

server = "SERVERAVATTIA\AVATTIA"
user = "sa"
password = "aitva"



def getData(db=None):
    #conn = pymssql.connect(server, user, password, "AZTECA")
    #cursor = conn.cursor()
    #cursor.execute('SELECT * from dbo.p_clie')
    conn = pymssql.connect(server,user,password, "FERBISBRASIL")
    cursor = conn.cursor()
    cursor.execute('SELECT top 10000 * from dbo.p_vede ')
    result = cursor.fetchall()
    conn.close()
    return result

def getVen(dsd,hst):
    conn = pymssql.connect(server,user,password, "EjerciciosJonathan")
    cursor = conn.cursor()
    #cursor.execute('SELECT sum(dbo.p_vede.Importe) as Total,sum(dbo.p_vede.Cantidad) as Cantidad, dbo.p_vede.Producto, dbo.p_prod.desc from dbo.p_vede where fecha between '+dsd+' AND ' + hst +  )
    cursor.execute('select distinct f.producto , s.VentaTotal, s.CantidadVendida, p.desc1 from dbo.p_vede as f inner join( \
        select producto, sum(importe) as VentaTotal, sum(cantidad) as CantidadVendida from dbo.p_vede where fecha >= \''+dsd+'\' and fecha <= \''+hst+'\' group by producto \
        ) as s on f.producto = s.producto  inner join p_prod as p on p.producto = f.producto')
    result = cursor.fetchall()
    conn.close()
    return result

# Create your views here.

def index(request):
    return render(request, 'main/home.html')

def contact(request):
    start = time.time()
    info = getData()
    result = time.time() - start
    return render(request,'main/basic.html',{'content':info,'time':result})

def consulta(request):
    if request.method == 'GET':
        return render(request, 'main/consulta.html')
    elif request.method == 'POST':
        dsd = request.POST['desde']
        hst = request.POST['hasta']
        start = time.time()
        resulta  = getVen(dsd,hst)
        start = time.time()-start
        return render(request,'main/consulta.html',{'fch': [dsd ,hst],'result':resulta,'tiempo':start})
        #return render_to_response('main/home.html',{},RequestContext(request))

def searchInfo(request):
    if request.is_ajax() and request.method == "POST":
        dsd = request.POST['desde']
        hst = request.POST['hasta']
        resultado = getVen(dsd,hst)
        tab = [{'producto': x[0], 'venta': float(x[1]),'cantidad': int(x[2]) , 'desc': x[3] } for x in resultado]
        message = "Yes, AJAX!"
        consultaTablas('EjerciciosJonathan')
    else:
        message = "Not Ajax"
    return HttpResponse(json.dumps(tab))

def consultaBase(tabla,*args):

    pass

def getTables(base):
    conn = pymssql.connect(server,user,password, base)
    cursor = conn.cursor()
    cursor.execute('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES')
    result = cursor.fetchall()
    return result

def searchTbl(request):
    message = []
    if request.is_ajax() and request.method == "POST":
        message = getTables('EjerciciosJonathan')
    return HttpResponse(json.dumps(message))

def getColumns(table,base):
    conn = pymssql.connect(server,user,password, base)
    cursor = conn.cursor()
    print(table)
    table = re.findall(r'[a-zA-Z0-9_]+',table)
    print("!!!!!!!!!!!!!!!!!!!!!!!!",table)
    cursor.execute('SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N\''+ table[0] + "\'")
    result = cursor.fetchall()
    return result


def  searchColumns(request):
    message = []
    if request.is_ajax() and request.method == "POST":
        message = getColumns(request.POST['tabla'],'EjerciciosJonathan')
        print("!!!Something ",message," in here!!!!!")
    return HttpResponse(json.dumps(message))



def formatQuerytoJson(cosulta,*agrs):
    pass
