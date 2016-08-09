#!/usr/bin/env python
import os
import sys
import threading
from django.shortcuts import render
from django.http import HttpResponseRedirect , HttpResponse ,JsonResponse
from django.core import serializers
from os import getenv
import pymssql
import time
import json
import re
from django.conf.urls import url,include

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pagina.settings")

    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
