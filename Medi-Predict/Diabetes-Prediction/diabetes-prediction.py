# Load libraries
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import keras
from keras.models import Sequential
from keras.layers import Dense
from keras.callbacks import ModelCheckpoint


# Load dataset
dataset = pd.read_csv("extras/diabetes.csv")
dataset.head()

# Cleaning Data
dataset.duplicated().sum()
dataset.drop_duplicates(inplace=True)

names = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']

for col in names:
    dataset[col].replace(0, np.NaN, inplace=True)

dataset.dropna(inplace=True)

X = dataset.drop('Outcome', axis=1)
X = StandardScaler().fit_transform(X)
y = dataset['Outcome']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=0)

model = Sequential()
model.add(Dense(8, activation = 'relu', input_shape = X_train[0].shape))

model.add(Dense(8, activation='relu'))

model.add(Dense(4, activation='relu'))

model.add(Dense(1, activation='sigmoid'))
model.summary()

opt = keras.optimizers.Adam(learning_rate=0.0001)
model.compile(optimizer= opt ,loss='binary_crossentropy',metrics=['acc'])

checkpointer = ModelCheckpoint('diabetes.h5', monitor='val_acc', mode='max', verbose=2, save_best_only=True)
history=model.fit(X_train, y_train, batch_size=16, epochs=350, validation_data=(X_test, y_test), callbacks=[checkpointer])

present_model = keras.models.load_model('diabetes.h5')
present_model.summary()

print("Accuracy of our model on test data : ", present_model.evaluate(X_test,y_test)[1]*100 , "%")
