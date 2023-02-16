import joblib
import numpy as np
import matplotlib.pyplot as plt
import gc
import os
import sys
import warnings
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers import Dropout
from sklearn.preprocessing import MinMaxScaler
import datetime
import tensorflow as tf
from tensorflow.keras.models import *
from tensorflow.keras.layers import *
from keras.layers.core import Dense, Dropout
from keras.layers.convolutional import Conv1D
import tensorflow_model_optimization as tfmot
import craw_vndirect
from craw_vndirect import craw_vndirect
warnings.filterwarnings('ignore')
tf.config.optimizer.set_jit(True)

total_train_date = 2000
len_train = 60
epoch = 1200
batch_size = 64
workers = -1

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

def convert_shape(data):
	shape_data = np.array(data).shape
	data = np.array(data).reshape(shape_data[0], shape_data[2], shape_data[1])
	return data

def convert_shape_cnn(data):
	shape_data = np.array(data).shape
	data = np.array(data).reshape(shape_data[0], shape_data[1], shape_data[2], 1)
	return data

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

def cnn_reg(input_shape=(60, 1, 1), unit_lstm=40, clustering_params=None):
	inputs = Input(input_shape)
	conv1 = Conv1D(64, 3, padding='same', kernel_initializer='he_normal')(inputs)
	conv1 = Activation("relu")(conv1)
	conv1 = LeakyReLU(alpha=0.3)(conv1)
	drop1 = Dropout(0.2)(conv1)

	conv2 = Conv1D(128, 3, padding='same', kernel_initializer='he_normal')(drop1)
	conv2 = Activation("relu")(conv2)
	conv2 = LeakyReLU(alpha=0.3)(conv2)
	drop2 = Dropout(0.2)(conv2)

	conv3 = Conv1D(256, 3, padding='same', kernel_initializer='he_normal')(drop2)
	conv3 = Activation("relu")(conv3)
	conv3 = LeakyReLU(alpha=0.3)(conv3)
	drop3 = Dropout(0.2)(conv3)


	conv4 = Conv1D(128, 3, padding='same', kernel_initializer='he_normal')(drop3)
	conv4 = Activation("relu")(conv4)
	conv4 = LeakyReLU(alpha=0.3)(conv4)
	drop4 = Dropout(0.2)(conv4)

	conv5 = Conv1D(64, 3, padding='same', kernel_initializer='he_normal')(drop4)
	conv5 = Activation("relu")(conv5)
	conv5 = LeakyReLU(alpha=0.3)(conv5)
	drop5 = Dropout(0.2)(conv5)

	conv6 = Conv1D(1, 1, activation='linear')(drop5)

	cnn_out = Reshape((input_shape[0], input_shape[1]))(conv6)
	lstm_layer = Bidirectional(LSTM(unit_lstm, return_sequences=True))(cnn_out)
	lstm_layer = LeakyReLU(alpha=0.3)(lstm_layer)
	lstm_layer = Dropout(0.2)(lstm_layer)

	lstm_out = Bidirectional(LSTM(unit_lstm, return_sequences=False))(lstm_layer)
	outputs = Dense(units=1, activation='linear')(lstm_out)
	model = Model(inputs=inputs, outputs=outputs)

	clustered_model = cluster_weights(model, **clustering_params)
	clustered_model.compile(optimizer='adam', loss='mean_absolute_error', metrics=["accuracy"])
	return clustered_model

def time_now():
	x=datetime.datetime.now()
	year=x.strftime("%Y")
	month=x.strftime("%m")
	day=x.strftime("%d")
	hour='00'
	minute='00'
	current_time=year+month+day+hour+minute
	return current_time

def check_path(path):
	check = os.path.exists(path)
	if not check:
		os.makedirs(path)


if __name__ == "__main__":
	dir_model = "model_train/"
	check_path(dir_model)
	file_code = "hex_ck.txt"
	f = open(file_code, "r+")
	hex_code = f.read().split(",")
	for i in range(len(hex_code)):
		hex_code[i] = hex_code[i].strip()

	#final_time = time_now()
	final_time = "202202280000"
	start_time = changetime(final_time, -60*24*total_train_date)

	cluster_weights = tfmot.clustering.keras.cluster_weights
	CentroidInitialization = tfmot.clustering.keras.CentroidInitialization

	clustering_params = {
		'number_of_clusters': 16,
		'cluster_centroids_init': CentroidInitialization.LINEAR
	}

	for CP_Code in hex_code:
		print ("\n\n")
		print (CP_Code)
		print ("\n\n")
		try:
			craw = craw_vndirect(CP_Code, start_time=0, end_time=final_time)
			time_utc, _, _, close, high, low, _ = craw()
			s_time = time_utc[0]
			f_time = time_utc[-1]
			print (f"Start time: {s_time}")
			print (f"Final time: {f_time}")

			close = np.array(close).reshape(len(close), 1)

			sc = MinMaxScaler(feature_range=(0, 1))
			close = sc.fit_transform(close)
			joblib.dump(sc, dir_model+f'{CP_Code}_MinMaxScaler.gz')

			X_train = []
			y_train = []
			for i in range(len_train, len(close)):
			    X_train.append(close[i-len_train:i])
			    y_train.append(close[i])

			X_train, y_train = np.array(X_train), np.array(y_train)
			X_train_cnn = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1, 1))
			X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))

			print ("CNN_LSTM model")
			model = cnn_reg(input_shape=(len_train, 1, 1), clustering_params=clustering_params)
			model.summary()
			print (model.optimizer.get_config())
			model.fit(X_train_cnn, y_train, epochs=epoch, use_multiprocessing=True, verbose=1, workers=workers, batch_size=batch_size)
			model.save(dir_model+f"{CP_Code}_cnn_lstm.h5")
			model.save_weights(dir_model+f"{CP_Code}_cnn_lstm_weights.h5")
			del model, X_train_cnn
			gc.collect()

			print ("Lstm model")
			model = lstm_reg(input_shape=(len_train, 1), clustering_params=clustering_params)
			model.summary()
			print (model.optimizer.get_config())
			model.fit(X_train, y_train, epochs=epoch, use_multiprocessing=True, verbose=1, workers=workers, batch_size=batch_size)
			model.save(dir_model+f"{CP_Code}_lstm.h5")
			model.save_weights(dir_model+f"{CP_Code}_lstm_weights.h5")
			del model
			gc.collect()

			print ("GRU model")
			model = gru_reg(input_shape=(len_train, 1), clustering_params=clustering_params)
			model.summary()
			print (model.optimizer.get_config())
			model.fit(X_train, y_train, epochs=epoch, use_multiprocessing=True, verbose=1, workers=workers, batch_size=batch_size)
			model.save(dir_model+f"{CP_Code}_gru.h5")
			model.save_weights(dir_model+f"{CP_Code}_gru_weights.h5")
			del model
			gc.collect()


			del s_time, f_time, high, low, close
			del sc
			del X_train, y_train
			del craw
			gc.collect()

		except KeyboardInterrupt:
			sys.exit()
		except:
			print ("Error code")




