from django.shortcuts import render , redirect
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
base = "EjerciciosJonathan"

#Helper Functions
def is_number(s):
    try:
        float(s)
        return True
    except:
        return False

data_handler = lambda obj :(
    obj.isoformat()
    if isinstance(obj, datetime.datetime)
    or isinstance(obj, datetime.date)
    else None
)
#End of helper functions


def getData():
    conn = pymssql.connect(server,user,password, base)
    cursor = conn.cursor()
    cursor.execute('SELECT top 10000 * from dbo.p_vede ')
    result = cursor.fetchall()
    conn.close()
    return result

def doQuery(tabla,*args):
    """ db: Database to query
    tabla: En la cual Buscar
    args: Columnas en las que se quiere buscar
    """
    conn = pymssql.connect(server,user,password, base)
    cursor = conn.cursor()
    cols = ",".join(args)
    query = "select " + cols + " from dbo." +  tabla
    print(query)
    cursor.execute(query)
    result = cursor.fetchall()
    conn.close()
    jsonResult = []
    #[jsonResult['headers'].append(arg) for arg in args]
    #[jsonResult['data'].append({x:y for x,y in zip(args,z) })  for z in result]
    for row in result:
        dictx = {}
        for x,y in zip(args,row):
            print(x,y)
            print(type(y))
            if is_number(y):
                dictx[x] = float(y)
            elif type(y).__name__ == 'datetime':
                dictx[x] = json.dumps(y,default=data_handler)
            else:
                dictx[x] = y
        jsonResult.append(dictx)
    print(jsonResult)
    return jsonResult



def getVen(dsd,hst):
    conn = pymssql.connect(server,user,password,base)
    cursor = conn.cursor()
    cursor.execute('select distinct f.producto , s.VentaTotal, s.CantidadVendida, p.desc1 from dbo.p_vede as f inner join( \
        select producto, sum(importe) as VentaTotal, sum(cantidad) as CantidadVendida from dbo.p_vede where fecha >= \''+dsd+'\' and fecha <= \''+hst+'\' group by producto \
        ) as s on f.producto = s.producto  inner join p_prod as p on p.producto = f.producto')
    result = cursor.fetchall()
    conn.close()
    return result

def getUser(usuario,passw):
    conn = pymssql.connect(server,user,password, base)
    cursor = conn.cursor()
    cursor.execute('SELECT usuario , estatus, tipo ,  identifica FROM p_usua WHERE usuario = \''+ usuario+ "' AND password = '"+ passw + "'"  )
    result = cursor.fetchone()
    conn.close()
    return result

# Create your views here.

def index(request):
    if request.session.get('user'):
        request.session['date'] = time.time()
        return render(request, 'main/home.html',{'user':request.session.get('user')})
    else:
        return render(request, 'main/auth.html',{'Error':False} )

def contact(request):
    start = time.time()
    info = getData()
    result = time.time() - start
    return render(request,'main/basic.html',{'content':info,'time':result})

def consulta(request):
    request.session['date'] = time.time()
    if request.method == 'GET':
        return render(request, 'main/consulta.html')
    elif request.method == 'POST':
        dsd = request.POST['desde']
        hst = request.POST['hasta']
        start = time.time()
        resulta  = getVen(dsd,hst)
        start = time.time()-start
        return render(request,'main/consulta.html',{'fch': [dsd ,hst],'result':resulta,'tiempo':start})

def searchInfo(request):
    request.session['date'] = time.time()
    if request.is_ajax() and request.method == "POST":
        dsd = request.POST['desde']
        hst = request.POST['hasta']
        resultado = getVen(dsd,hst)
        tab = [{'producto': x[0], 'venta': float(x[1]),'cantidad': int(x[2]) , 'desc': x[3] } for x in resultado]
    return HttpResponse(json.dumps(tab))

def consultaBase(tabla,*args):
    pass

def getTables():
    conn = pymssql.connect(server,user,password, base)
    cursor = conn.cursor()
    cursor.execute('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES order by TABLE_NAME asc')
    result = cursor.fetchall()
    result = [re.findall(r'[a-zA-Z0-9_]+',e[0]) for e in result]
    result = [x[0] for x in result]
    print(result)
    return result

def searchTbl(request):
    request.session['date'] = time.time()
    message = []
    if request.is_ajax() and request.method == "POST":
        message = getTables()
    return HttpResponse(json.dumps(message))

def getColumns(table):
    conn = pymssql.connect(server,user,password, base)
    cursor = conn.cursor()
    print(table)
    table = re.findall(r'[a-zA-Z0-9_]+',table)
    cursor.execute('SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N\''+ table[0] + "\'")
    result = cursor.fetchall()
    return result


def  searchColumns(request):
    message = []
    request.session['date'] = time.time()
    if request.is_ajax() and request.method == "POST":
            message = getColumns(request.POST['tabla'])
            print(message)
            message = [re.findall(r'[a-zA-Z0-9_]+',e[0]) for e in message]
            message = [x[0] for x in message]
            print("!!!Something ",message," in here!!!!!")
    return HttpResponse(json.dumps(message))

def login(request):
    if request.method == "POST":
            user = request.POST['usuario']
            passw = request.POST['pass']
            result = getUser(user,passw)
            if result:
                request.session['user'] = user
                request.session['date'] = time.time()
                request.session.set_expiry(1800)
                return redirect("/")
            else:
                return render(request, 'main/auth.html',{'Error':True})

def logout(request):
    if request.session.get('user'):
        del request.session['user']
    else:
        print("No se encontro la sesion")
    return redirect("/")

def formatQuerytoJson(cosulta,*agrs):
    pass

def doGet(request):
    response = HttpResponse("Queso",content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename="foo.xls"'
    return response
    #return HttpResponse("Is working!!!")

def drawColumns(request):
    result = {};
    if request.method == 'POST' and request.is_ajax():
        columns = request.POST.getlist('columns[]')
        tabla = request.POST.get('tabla')
        print(columns)
        result = doQuery(tabla,*columns)
        print("Taht workd")
    #return JsonResponse(result,safe=False)
    return HttpResponse(json.dumps(result))
