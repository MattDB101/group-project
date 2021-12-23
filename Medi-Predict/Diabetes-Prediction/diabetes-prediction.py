# Load libraries
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler as ss


dataset = pd.read_csv('extras/diabetes.csv', header=None)

dataset.duplicated().sum()
dataset.drop_duplicates(inplace=True)

dataset.columns = ['Pregnancies','Glucose','BloodPressure','SkinThickness',
                   'Insulin','BMI','DiabetesPedigreeFunction','Age','Outcome']

for col in dataset.columns:
    dataset[col].replace(0, np.NaN, inplace=True)

dataset.dropna(inplace=True)

X = dataset.drop('Outcome', axis=1)
X = ss().fit_transform(X)
y = dataset['Outcome']

X_train, X_validation, y_train, Y_validation = train_test_split(X, y, test_size=0.2, random_state=0)

X_train.shape, X_validation.shape, y_train.shape, X_validation.shape

from keras.models import Sequential
from keras.layers import Dense
from keras.callbacks import ModelCheckpoint

model = Sequential()
model.add(Dense(8, activation='relu', input_shape=X_train[0].shape))
model.add(Dense(8, activation='relu'))
model.add(Dense(4, activation='relu'))
model.add(Dense(1, activation='sigmoid'))

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['acc'])

checkpointer = ModelCheckpoint('diabetes.h5', monitor='val_acc', mode='max', verbose=2, save_best_only=True)
history=model.fit(X_train, y_train, batch_size=16, epochs=350, validation_data=(X_validation, Y_validation), callbacks=[checkpointer])

converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

open("extras/model.tflite", "wb").write(tflite_model)
