# Load libraries
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler as ss


dataset = pd.read_csv('extras/oasis_longitudinal.csv')
dataset.head()

# dataset Cleaning
dataset = dataset.loc[dataset['Visit'] == 1]  # Only look at first visit
dataset = dataset.reset_index(drop=True)  # reset index after filtering

dataset = dataset[['Group', 'M/F', 'Age', 'EDUC', 'SES',
             'MMSE', 'CDR', 'eTIV', 'nWBV', 'ASF']]

dataset.rename(columns={'M/F': 'Gender'}, inplace=True)
dataset.head()

# Check for missing values
dataset.isna().sum()
dataset['SES'].value_counts()
dataset['SES'] = dataset['SES'].fillna(2.0)
dataset.isna().sum().sum()

# Binary encode object columns
dataset['Group'] = dataset['Group'].apply(lambda x: 1 if x == 'Demented' else 0)
dataset['Gender'] = dataset['Gender'].apply(lambda x: 1 if x == 'M' else 0)

dataset.head(10)
dataset = dataset.astype('float64')

y = dataset['Group']
X = dataset.drop(['Group', 'ASF'], axis=1)

X_train, X_validation, y_train, Y_validation = train_test_split(X, y, test_size=0.2, random_state=0)

sc = ss()
X_train = sc.fit_transform(X_train)
X_validation = sc.transform(X_validation)

from keras.models import Sequential
from keras.layers import Dense
from keras.callbacks import ModelCheckpoint

model = Sequential()
model.add(Dense(10, activation='relu', input_shape=X_train[0].shape))
model.add(Dense(10, activation='relu'))
model.add(Dense(5, activation='relu'))
model.add(Dense(1, activation='sigmoid'))

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['acc'])

checkpointer = ModelCheckpoint('alzheimer.h5', monitor='val_acc', mode='max', verbose=2, save_best_only=True)
history=model.fit(X_train, y_train, batch_size=16, epochs=350, validation_data=(X_validation, Y_validation), callbacks=[checkpointer])

converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

open("extras/alzheimer_model.tflite", "wb").write(tflite_model)