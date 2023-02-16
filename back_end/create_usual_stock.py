import os
import datetime
import numpy as np
import sys
import gc
import matplotlib
import matplotlib.pyplot as plt
import craw_vndirect
from craw_vndirect import craw_vndirect
matplotlib.use('Agg')
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
	import time
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

def extract_value(s_time, f_time, CP_Code="VCB"):
	f_time = changetime(f_time, 60*24)
	f_time = f_time[0:4] + "-" + f_time[4:6] + "-" + f_time[6:8]
	s_time = s_time[0:4] + "-" + s_time[4:6] + "-" + s_time[6:8]

	loader = yf.Ticker(CP_Code)
	data = loader.history(start=s_time, end=f_time)
	c_names = data.columns.values
	_open = np.array(data[c_names[0]])
	_high = np.array(data[c_names[1]])
	_low = np.array(data[c_names[2]])
	_close = np.array(data[c_names[3]])
	_volume = np.array(data[c_names[4]])

	if (_close[-1]>5000):
		_open = _open/1000.
		_high = _high/1000.
		_low = _low/1000.
		_close = _close/1000.
	return s_time, f_time, _open, _high, _low, _close, _volume

def extract_value_(s_time, f_time, CP_Code="VCB"):
	f_time = f_time[0:4] + "-" + f_time[4:6] + "-" + f_time[6:8]
	s_time = s_time[0:4] + "-" + s_time[4:6] + "-" + s_time[6:8]
	loader = web.DataLoader(symbols=[f"{CP_Code}"], start=s_time, end=f_time, minimal=True, data_source="cafe")
	data = loader.download()
	c_names = data.columns.values
	high = np.array(data[c_names[0]])
	low = np.array(data[c_names[1]])
	close = np.array(data[c_names[3]])
	return close

final_time = "202202260000"
start_time = changetime(final_time, -60*24*800)
start_check = changetime(final_time, -60*24*30)

save_folder = "pics/"
f = open("all_code.txt", "r+")
f_new = open("new_hex_rm.txt", "w+")
for line in f:
	CP_Code = line.strip()
	try:
		print (CP_Code)
		craw = craw_vndirect(CP_Code)
		time_utc, craw_time, craw_open, close, craw_high, craw_low, craw_volume = craw()
		idx = np.arange(0,len(close),1)
		fig, ax = plt.subplots(figsize=(16,12))
		ax.grid(True)
		plt.title(f"{CP_Code}")
		plt.plot(idx, close, color="green")
		plt.savefig(f"{save_folder}{CP_Code}_{final_time}.png",dpi=400)
		plt.close()
		plt.cla()
		plt.clf()

		f_new.write(f"{CP_Code}, ")

		del craw, time_utc, craw_time, craw_open, close, craw_high, craw_low, craw_volume, ax, fig
		gc.collect()
	except KeyboardInterrupt:
		sys.exit()
	except:
		print (f"Error {CP_Code}")

