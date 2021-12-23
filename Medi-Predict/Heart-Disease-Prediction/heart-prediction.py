# Load libraries
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler as ss


# Load dataset
dataset = pd.read_csv('extras/cleveland.csv', header=None)

dataset.columns = ['age', 'sex', 'cp', 'trestbps', 'chol',
                   'fbs', 'restecg', 'thalach', 'exang',
                   'oldpeak', 'slope', 'ca', 'thal', 'target']

dataset.isnull().sum()

dataset['target'] = dataset.target.map({0: 0, 1: 1, 2: 1, 3: 1, 4: 1})
dataset['sex'] = dataset.sex.map({0: 'female', 1: 'male'})
dataset['thal'] = dataset.thal.fillna(dataset.thal.mean())
dataset['ca'] = dataset.ca.fillna(dataset.ca.mean())


dataset['sex'] = dataset.sex.map({'female': 0, 'male': 1})

dataset.info()

# data preprocessing
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, -1].values

X_train, X_validation, y_train, Y_validation = train_test_split(X, y, test_size=0.2, random_state=0)

sc = ss()
X_train = sc.fit_transform(X_train)
X_validation = sc.transform(X_validation)

from keras.models import Sequential
from keras.layers import Dense

model = Sequential()
model.add(Dense(30, input_dim=13, activation='tanh'))
model.add(Dense(20, activation='tanh'))
model.add(Dense(1, activation='sigmoid'))

model.compile(optimizer='adam',loss='binary_crossentropy',metrics=['accuracy'])
model.fit(X_train, y_train, epochs=100, verbose=1)

model.summary()
score = model.evaluate(X_validation, Y_validation, verbose=0)
print('Model Accuracy = ',score[1])

converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

open("extras/model.tflite", "wb").write(tflite_model)
