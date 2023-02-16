import json
import numpy as np
import joblib
import gc
import os
import sys
import warnings
import datetime
from datetime import datetime as dt
import craw_vndirect
from craw_vndirect import craw_vndirect
from clint.textui import colored
import matplotlib.pyplot as plt
import copy
import time
warnings.filterwarnings('ignore')

def time_now():
	x=datetime.datetime.now()
	year=x.strftime("%Y")
	month=x.strftime("%m")
	day=x.strftime("%d")
	hour='00'
	minute='00'
	current_time=year+month+day+hour+minute
	return current_time

def changetime(timedoi,sophut):
	aTupleTime = ( int(timedoi[0:4]),int(timedoi[4:6]),int(timedoi[6:8]),int(timedoi[8:10]),int(timedoi[10:12]), 0, 0, 0, 0)
	ticks = time.mktime(aTupleTime)+sophut*60
	localtime=time.localtime(ticks)
	mon=str(localtime[1])
	day=str(localtime[2])
	h=str(localtime[3])
	p=str(localtime[4])
	if localtime[1] <10:
		mon= "0"+str(localtime[1])
	if localtime[2] <10:
		day= "0"+str(localtime[2])
	if localtime[3] <10:
		h= "0"+str(localtime[3])
	if localtime[4] <10:
		p= "0"+str(localtime[4])
	timedoi=str(localtime[0])+mon+day+h+p
	return timedoi

if (__name__ == "__main__"):
	start_process = time.time()
	#print (f"Start process: {start_process}")
	current_time = time_now()
	#f_error = open("code_error.txt","w+")

	final_time = changetime(current_time, -60*24)
	start_time = changetime(final_time, -60*24*2000)

	file_code = "all_stock.txt"
	f = open(file_code, "r+")
	hex_code = f.read().split(",")
	for i in range(len(hex_code)):
		hex_code[i] = hex_code[i].strip()

	f_ok = open("check_stock.txt", "w+")

	f_error = []

	for CP_Code in hex_code:
		try:
			craw = craw_vndirect(CP_Code, start_time=start_time, end_time=final_time)
			time_utc, _, _open, _close, _high, _low, _volume = craw()
			if (len(_close)>1):
				print (colored.magenta(CP_Code))
				f_ok.write(f"{CP_Code},")
			else:
				print (colored.red(CP_Code))
				f_error.append(CP_Code)
		except KeyboardInterrupt:
			sys.exit()
		except:
			print (colored.red(CP_Code))
			pass