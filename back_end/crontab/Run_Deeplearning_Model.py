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
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras import models
import tensorflow_model_optimization as tfmot
from tensorflow.keras.models import *
from tensorflow.keras.layers import *
import copy
import time
import glob
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

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

def lstm_reg(input_shape=(60, 1), unit=40, clustering_params=None):
	inputs = Input(input_shape)
	lstm1f = Bidirectional(LSTM(units=unit, return_sequences=True))(inputs)
	lstm1f = LeakyReLU(alpha=0.3)(lstm1f)
	lstm1d = Dropout(0.2)(lstm1f)
	
	lstm2f = Bidirectional(LSTM(units=unit, return_sequences=True))(lstm1d)
	lstm2f = LeakyReLU(alpha=0.3)(lstm2f)
	lstm2d = Dropout(0.2)(lstm2f)

	lstm3f = Bidirectional(LSTM(units=unit, return_sequences=True))(lstm2d)
	lstm3f = LeakyReLU(alpha=0.3)(lstm3f)
	lstm3d = Dropout(0.2)(lstm3f)
	#lstm3d = BatchNormalization()(lstm3f)

	lstm4f = Bidirectional(LSTM(units=unit, return_sequences=True))(lstm3d)
	lstm4f = LeakyReLU(alpha=0.3)(lstm4f)
	lstm4d = Dropout(0.2)(lstm4f)
	#lstm4d = BatchNormalization()(lstm4f)

	lstm5f = Bidirectional(LSTM(units=unit, return_sequences=False))(lstm4d)
	lstm5f = LeakyReLU(alpha=0.3)(lstm5f)
	lstm5d = Dropout(0.2)(lstm5f)

	outputs = Dense(units=1, activation='linear')(lstm5d)
	model = Model(inputs=inputs, outputs=outputs)

	clustered_model = cluster_weights(model, **clustering_params)
	clustered_model.compile(optimizer='adam', loss='mean_absolute_error', metrics=["accuracy"])
	return clustered_model

def gru_reg(input_shape=(60, 1), unit=40, clustering_params=None):
	inputs = Input(input_shape)
	gru1f = Bidirectional(GRU(units=unit, return_sequences=True))(inputs)
	gru1f = LeakyReLU(alpha=0.3)(gru1f)
	gru1d = Dropout(0.2)(gru1f)
	
	gru2f = Bidirectional(GRU(units=unit, return_sequences=True))(gru1d)
	gru2f = LeakyReLU(alpha=0.3)(gru2f)
	gru2d = Dropout(0.2)(gru2f)

	gru3f = Bidirectional(GRU(units=unit, return_sequences=True))(gru2d)
	gru3f = LeakyReLU(alpha=0.3)(gru3f)
	gru3d = Dropout(0.2)(gru3f)
	#lstm3d = BatchNormalization()(lstm3f)

	gru4f = Bidirectional(GRU(units=unit, return_sequences=True))(gru3d)
	gru4f = LeakyReLU(alpha=0.3)(gru4f)
	gru4d = Dropout(0.2)(gru4f)
	#lstm4d = BatchNormalization()(lstm4f)

	gru5f = Bidirectional(GRU(units=unit, return_sequences=False))(gru4d)
	gru5f = LeakyReLU(alpha=0.3)(gru5f)
	gru5d = Dropout(0.2)(gru5f)

	outputs = Dense(units=1, activation='linear')(gru5d)
	model = Model(inputs=inputs, outputs=outputs)

	clustered_model = cluster_weights(model, **clustering_params)
	clustered_model.compile(optimizer='adam', loss='mean_absolute_error', metrics=["accuracy"])
	return clustered_model


def cnn_reg(input_shape=(60, 1, 1), unit_lstm=40):
	inputs = Input(input_shape)
	conv1 = TimeDistributed(Conv1D(64, 3, padding='same', kernel_initializer='he_normal'))(inputs)
	conv1 = Activation("relu")(conv1)
	conv1 = LeakyReLU(alpha=0.3)(conv1)
	drop1 = Dropout(0.2)(conv1)

	conv2 = TimeDistributed(Conv1D(128, 3, padding='same', kernel_initializer='he_normal'))(drop1)
	conv2 = Activation("relu")(conv2)
	conv2 = LeakyReLU(alpha=0.3)(conv2)
	drop2 = Dropout(0.2)(conv2)

	conv3 = TimeDistributed(Conv1D(256, 3, padding='same', kernel_initializer='he_normal'))(drop2)
	conv3 = Activation("relu")(conv3)
	conv3 = LeakyReLU(alpha=0.3)(conv3)
	drop3 = Dropout(0.2)(conv3)


	conv4 = TimeDistributed(Conv1D(128, 3, padding='same', kernel_initializer='he_normal'))(drop3)
	conv4 = Activation("relu")(conv4)
	conv4 = LeakyReLU(alpha=0.3)(conv4)
	drop4 = Dropout(0.2)(conv4)

	conv5 = TimeDistributed(Conv1D(64, 3, padding='same', kernel_initializer='he_normal'))(drop4)
	conv5 = Activation("relu")(conv5)
	conv5 = LeakyReLU(alpha=0.3)(conv5)
	drop5 = Dropout(0.2)(conv5)

	conv6 = TimeDistributed(Conv1D(1, 1, activation='linear'))(drop5)

	cnn_out = Reshape((input_shape[0], input_shape[1]))(conv6)
	lstm_layer = Bidirectional(LSTM(unit_lstm, return_sequences=True))(cnn_out)
	lstm_layer = LeakyReLU(alpha=0.3)(lstm_layer)
	lstm_layer = Dropout(0.2)(lstm_layer)

	lstm_out = Bidirectional(LSTM(unit_lstm, return_sequences=False))(lstm_layer)
	outputs = Dense(units=1, activation='linear')(lstm_out)
	model = Model(inputs=inputs, outputs=outputs)
	model.compile(optimizer='adam', loss='mean_absolute_error', metrics=["accuracy"])
	return model

def create_candle_value(op, cl, hi, lo):
	all_val = np.array([op, cl, hi, lo])
	_open = op
	_close = cl
	_high = np.max(all_val)
	_low = np.min(all_val)
	return _open , _close, _high, _low

def create_predict(sc, model, model_name, _close):
	close_num = 60
	len_train = 60
	p_close = []

	__close = np.array(_close).reshape(len(_close), 1)
	__close = sc.fit_transform(__close)
	data_close = np.array(__close[len(__close)-len_train:])

	print (colored.yellow(model_name))
	if (model_name=="CNN"):
		for i in range(close_num):
			if (i==0):
				data_close_ = data_close.reshape(-1, len_train, 1, 1)
			else:
				data_close_ = np.delete(data_close_, 0)
				data_close_ = np.append(data_close_, pred_close)
				data_close_ = data_close_.reshape(-1, len_train, 1, 1)
			pred_close = model.predict(data_close_)
			pred_cl = sc.inverse_transform(pred_close)
			p_close.append(pred_cl)
		del pred_close, pred_cl
		gc.collect()
	else:
		for i in range(close_num):
			if (i==0):
				data_close_ = data_close.reshape(-1, len_train, 1)
			else:
				data_close_ = np.delete(data_close_, 0)
				data_close_ = np.append(data_close_, pred_close)
				data_close_ = data_close_.reshape(-1, len_train, 1)
			pred_close = model.predict(data_close_)
			pred_cl = sc.inverse_transform(pred_close)
			p_close.append(pred_cl)
		del pred_close, pred_cl
		gc.collect()
	return 	p_close

def dump_json_pred(data, current_time, close_pre, _close, name_json):
	check_date = False
	check_mili = True
	data__ = []
	_close = np.array(_close).ravel()
	for i in range(len(_close)):
		if not check_date:
			new_time_i = changetime(current_time, 7*60)
		else:
			new_time_i = changetime(new_time_i, 24*60)
		yyyy = int(new_time_i[0:4])
		mm = int(new_time_i[4:6])
		dd = int(new_time_i[6:8])
		hh = int(new_time_i[8:10])

		dat = dt(yyyy, mm, dd, hh)
		milliseconds = int(round(dat.timestamp() * 1000))
		if (check_mili):
			current_mili = milliseconds
			check_mili = False
		if not check_date:
			data__.append([milliseconds, close_pre])
			check_date = True
		else:
			data__.append([milliseconds, _close[i]])

	data_out = {'current_time': current_mili, 'data': data__}
	with open(f"{name_json}", "w") as fp:
	    json.dump(data_out , fp, cls=NpEncoder)

def check_path(fpath):
	if not os.path.isdir(fpath):
		os.makedirs(fpath)

if (__name__ == "__main__"):
	start_process = time.time()
	#print (f"Start process: {start_process}")
	current_time = time_now()
	f_error = open("code_error.txt","w+")

	final_time = changetime(current_time, -60*24)
	start_time = changetime(final_time, -60*24*2000)
	data_web = "D://W_Linh_Tinh/chungkhoan/final_vndirect/AI/crontab_stock_predict/cluster_data/"
	link_predict = "D://W_Linh_Tinh/chungkhoan/final_vndirect/AI/crontab_stock_predict/current_cluster/"
	link_model = "D://W_Linh_Tinh/chungkhoan/final_vndirect/AI/cluster_model/"

	old_predict = "D://W_Linh_Tinh/chungkhoan/final_vndirect/AI/crontab_stock_predict/old_predict/"
	check_path(data_web)
	check_path(link_predict)
	check_path(old_predict)

	for file_del in glob.glob(f"{data_web}*.json"):
		os.remove(file_del)

	for file_pred in os.listdir(link_predict):
		os.replace(link_predict+file_pred, old_predict+file_pred)

	img_json = []

	cluster_weights = tfmot.clustering.keras.cluster_weights
	CentroidInitialization = tfmot.clustering.keras.CentroidInitialization

	clustering_params = {
		'number_of_clusters': 16,
		'cluster_centroids_init': CentroidInitialization.LINEAR
	}

	file_code = "all_stock.txt"
	f = open(file_code, "r+")
	hex_code = f.read().split(",")
	for i in range(len(hex_code)):
		hex_code[i] = hex_code[i].strip()

	for CP_Code in hex_code:
		try:
		#print (CP_Code)
			print (colored.magenta(CP_Code))
			craw = craw_vndirect(CP_Code, start_time=start_time, end_time=final_time)
			time_utc, _, _open, _close, _high, _low, _volume = craw()

			s_time = time_utc[0]
			f_time = time_utc[-1]

			data = []
			for i in range(len(_close)):
				new_time_i = changetime(time_utc[i], 7*60)
				yyyy = int(new_time_i[0:4])
				mm = int(new_time_i[4:6])
				dd = int(new_time_i[6:8])
				hh = int(new_time_i[8:10])

				dat = dt(yyyy, mm, dd, hh)
				milliseconds = int(round(dat.timestamp() * 1000))
				data.append([milliseconds, _open[i], _high[i], _low[i], _close[i], _volume[i]])

			data_out = {'data': data}
			with open(f"{data_web}{CP_Code}_current.json", "w") as fp:
			    json.dump(data_out , fp, cls=NpEncoder)
			
			len_train = 60
			close_num = 60
			idx = np.arange(0,len(_close),1)
			
			idx_check = np.arange(len(_close),len(_close)+close_num,1)
			#close_value = np.copy(_close)

			sc = joblib.load(f"{link_model}{CP_Code}_MinMaxScaler.gz")
			# model = lstm_reg(input_shape=(len_train, 1), clustering_params=clustering_params)
			# model_lstm = models.load_model(os.path.join("./model/",f"{CP_Code}_lstm.h5"))
			# model_gru = models.load_model(os.path.join("./model/",f"{CP_Code}_gru.h5"))

			model_lstm = lstm_reg(input_shape=(len_train, 1), clustering_params=clustering_params)
			model_lstm.load_weights(f"{link_model}{CP_Code}_lstm_weights.h5")

			model_gru = gru_reg(input_shape=(len_train, 1), clustering_params=clustering_params)
			model_gru.load_weights(f"{link_model}{CP_Code}_gru_weights.h5")

			model_cnn = models.load_model(os.path.join(f"{link_model}",f"{CP_Code}_cnn_lstm.h5"))

			lstm_close = create_predict(sc, model_lstm, "LSTM", _close)
			gru_close = create_predict(sc, model_gru, "GRU", _close)
			cnn_close = create_predict(sc, model_cnn, "CNN", _close)

			dump_json_pred(data, f_time, _close[-1], lstm_close, f"{data_web}{CP_Code}_lstm.json")
			dump_json_pred(data, f_time, _close[-1], gru_close, f"{data_web}{CP_Code}_gru.json")
			dump_json_pred(data, f_time, _close[-1], cnn_close, f"{data_web}{CP_Code}_cnn.json")

			predict_lstm = np.array(lstm_close).ravel()
			predict_gru = np.array(gru_close).ravel()
			predict_cnn = np.array(cnn_close).ravel()

			del model_lstm, model_gru, model_cnn
			gc.collect()

			predict_lstm = np.append(np.array([_close[-1]]), predict_lstm)
			predict_gru = np.append(np.array([_close[-1]]), predict_gru)
			predict_cnn = np.append(np.array([_close[-1]]), predict_cnn)

			time_utc_predict = copy.deepcopy(time_utc[-300:]).tolist()
			#close_value = copy.deepcopy(_close[-300:])
			for i in range(len(time_utc_predict)):
				time_utc_predict[i] = time_utc_predict[i][:-4]
			utc_t = []
			for i in range(len(predict_lstm)):
				utc_t.append(f"t+{i+1}")
				time_utc_predict.append(f"t+{i}")
			utc_t = np.array(utc_t)
			time_utc_predict = np.array(time_utc_predict)
			#close_value = np.array(close_value)
			#print (len(time_utc_predict), len(close_value))

			fig, ax = plt.subplots(figsize=(24,12))
			ax.grid(True)
			plt.title(f"{CP_Code} predict {f_time}")
			plt.plot(time_utc[-300:], _close[-300:], color="green")
			plt.plot(utc_t, predict_lstm, color="red", label='LSTM')
			plt.plot(utc_t, predict_gru, color="blue", label='GRU')
			plt.plot(utc_t, predict_cnn, color="brown", label='CNN')

			space_tick=4
			ticks = range(0, len(time_utc_predict), space_tick)
			tick_index = np.arange(0, len(time_utc_predict), space_tick)
			labels = np.array(time_utc_predict)[tick_index]
			plt.xticks(ticks, labels)
			fig.autofmt_xdate()
			fig.tight_layout()

			plt.legend(loc='lower left')
			#plt.show()
			plt.savefig(f"{link_predict}{CP_Code}_{final_time}.png",dpi=400)
			plt.close()
			plt.clf()
			img_json.append(f"{CP_Code}_{final_time}.png")

			del data_out, data, time_utc, _open, _close, _high, _low, _volume
			del lstm_close
			del gru_close
			del cnn_close
			del predict_lstm, predict_gru, predict_cnn
			gc.collect()

			print (colored.green('ok'))
			print ("\n\n")


		except KeyboardInterrupt:
			sys.exit()
		except:
			f_error.write(f"{CP_Code}, ")
			print (colored.red(f"Error {CP_Code}"))

	img_json = np.array(img_json)
	data_out = {'url_pics': img_json}
	with open("create_url_pics.json", "w") as fp:
	    json.dump(data_out , fp, cls=NpEncoder)
	f_error.close()
	print ("Total process time {}".format(time.time()-start_process))


