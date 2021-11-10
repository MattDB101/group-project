# Load libraries
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler as ss
from sklearn.svm import SVC
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

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

# distribution of target vs age
# sns.set_context("paper", font_scale=2, rc={"font.size": 20, "axes.titlesize": 25, "axes.labelsize": 20})
# sns.catplot(kind='count', data=dataset, x='age', hue='target', order=dataset['age'].sort_values().unique())
# plt.title('Variation of Age for each target class')
# plt.show()

# barplot of age vs sex with hue = target
# sns.catplot(kind='bar', data=dataset, y='age', x='sex', hue='target')
# plt.title('Distribution of age vs sex with the target class')
# plt.show()

dataset['sex'] = dataset.sex.map({'female': 0, 'male': 1})

# data preprocessing
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, -1].values

X_train, X_validation, y_train, Y_validation = train_test_split(X, y, test_size=0.2, random_state=0)

sc = ss()
X_train = sc.fit_transform(X_train)
X_validation = sc.transform(X_validation)

# SVM
model = SVC(kernel='rbf')
model.fit(X_train, y_train)

# Predicting the Test set results
y_pred = model.predict(X_validation)

cm_test = confusion_matrix(y_pred, Y_validation)

y_pred_train = model.predict(X_train)
cm_train = confusion_matrix(y_pred_train, y_train)
predictions = model.predict(X_validation)

print('Accuracy for training set for svm = {}'.format((cm_train[0][0] + cm_train[1][1]) / len(y_train)))
print('Accuracy for test set for svm = {}'.format((cm_test[0][0] + cm_test[1][1]) / len(Y_validation)))

# Naive Bayes
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, -1].values

X_train, X_validation, y_train, Y_validation = train_test_split(X, y, test_size=0.2, random_state=0)

classifier = GaussianNB()
classifier.fit(X_train, y_train)


# Predicting the Test set results
y_pred = classifier.predict(X_validation)

from sklearn.metrics import confusion_matrix
cm_test = confusion_matrix(y_pred, Y_validation)

y_pred_train = classifier.predict(X_train)
cm_train = confusion_matrix(y_pred_train, y_train)

print()
print('Accuracy for training set for Naive Bayes = {}'.format((cm_train[0][0] + cm_train[1][1])/len(y_train)))
print('Accuracy for test set for Naive Bayes = {}'.format((cm_test[0][0] + cm_test[1][1])/len(Y_validation)))

# Logistic Regression
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, -1].values

X_train, X_validation, y_train, Y_validation = train_test_split(X, y, test_size = 0.2, random_state=0)

classifier = LogisticRegression()
classifier.fit(X_train, y_train)

# Predicting the Test set results
y_pred = classifier.predict(X_validation)

cm_test = confusion_matrix(y_pred, Y_validation)

y_pred_train = classifier.predict(X_train)
cm_train = confusion_matrix(y_pred_train, y_train)

print()
print('Accuracy for training set for Logistic Regression = {}'.format((cm_train[0][0] + cm_train[1][1])/len(y_train)))
print('Accuracy for test set for Logistic Regression = {}'.format((cm_test[0][0] + cm_test[1][1])/len(Y_validation)))

X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, -1].values

X_train, X_validation, y_train, Y_validation = train_test_split(X, y, test_size=0.2, random_state=0)

classifier = DecisionTreeClassifier()
classifier.fit(X_train, y_train)

# Predicting the Test set results
y_pred = classifier.predict(X_validation)

cm_test = confusion_matrix(y_pred, Y_validation)

y_pred_train = classifier.predict(X_train)
cm_train = confusion_matrix(y_pred_train, y_train)

print()
print('Accuracy for training set for Decision Tree = {}'.format((cm_train[0][0] + cm_train[1][1])/len(y_train)))
print('Accuracy for test set for Decision Tree = {}'.format((cm_test[0][0] + cm_test[1][1])/len(Y_validation)))

# Random Forest
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, -1].values

X_train, X_validation, y_train, Y_validation = train_test_split(X, y, test_size=0.2, random_state=0)

classifier = RandomForestClassifier(n_estimators=10)
classifier.fit(X_train, y_train)

# Predicting the Test set results
y_pred = classifier.predict(X_validation)

cm_test = confusion_matrix(y_pred, Y_validation)

y_pred_train = classifier.predict(X_train)
cm_train = confusion_matrix(y_pred_train, y_train)

print()
print('Accuracy for training set for Random Forest = {}'.format((cm_train[0][0] + cm_train[1][1]) / len(y_train)))
print('Accuracy for test set for Random Forest = {}'.format((cm_test[0][0] + cm_test[1][1]) / len(Y_validation)))

# lightGBM

d_train = lgb.Dataset(X_train, label=y_train)
params = {}

clf = lgb.train(params, d_train, 100)
# Prediction
y_pred = clf.predict(X_validation)
# convert into binary values
for i in range(0, len(y_pred)):
    if y_pred[i] >= 0.5:  # setting threshold to .5
        y_pred[i] = 1
    else:
        y_pred[i] = 0

cm_test = confusion_matrix(y_pred, Y_validation)
y_pred_train = clf.predict(X_train)

for i in range(0, len(y_pred_train)):
    if y_pred_train[i] >= 0.5:  # setting threshold to .5
        y_pred_train[i] = 1
    else:
        y_pred_train[i] = 0

cm_train = confusion_matrix(y_pred_train, y_train)
print()
print('Accuracy for training set for LightGBM = {}'.format((cm_train[0][0] + cm_train[1][1]) / len(y_train)))
print('Accuracy for test set for LightGBM = {}'.format((cm_test[0][0] + cm_test[1][1]) / len(Y_validation)))

# applying XGBoost

# from sklearn.model_selection import train_test_split
# X_train, X_validation, y_train, Y_validation = train_test_split(X, target, test_size = 0.20, random_state = 0)

xg = XGBClassifier()
xg.fit(X_train, y_train)
y_pred = xg.predict(X_validation)

cm_test = confusion_matrix(y_pred, Y_validation)

y_pred_train = xg.predict(X_train)

for i in range(0, len(y_pred_train)):
    if y_pred_train[i] >= 0.5:  # setting threshold to .5
        y_pred_train[i] = 1
    else:
        y_pred_train[i] = 0

cm_train = confusion_matrix(y_pred_train, y_train)
print()
print('Accuracy for training set for XGBoost = {}'.format((cm_train[0][0] + cm_train[1][1]) / len(y_train)))
print('Accuracy for test set for XGBoost = {}'.format((cm_test[0][0] + cm_test[1][1]) / len(Y_validation)))

print('\n' + classification_report(Y_validation, predictions))
