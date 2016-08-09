from django.conf.urls import url,include
from . import views

urlpatterns = [
    url(r'^$',views.index, name="index"),
    url(r'^contact/',views.contact, name="contact"),
    url(r'^consulta/',views.consulta, name="consulta"),
    url(r'^searchInfo/',views.searchInfo , name="searchInfo"),
    url(r'^searchTbl/',views.searchTbl , name="searchTbl"),
    url(r'^searchColumns',views.searchColumns, name="searchColumns")]
