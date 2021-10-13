# Load libraries
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler as ss
from sklearn.svm import SVC
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report

df = pd.read_csv('extras/cleveland.csv', header=None)

df.columns = ['age', 'sex', 'cp', 'trestbps', 'chol',
              'fbs', 'restecg', 'thalach', 'exang',
              'oldpeak', 'slope', 'ca', 'thal', 'target']

df.isnull().sum()

df['target'] = df.target.map({0: 0, 1: 1, 2: 1, 3: 1, 4: 1})
df['sex'] = df.sex.map({0: 'female', 1: 'male'})
df['thal'] = df.thal.fillna(df.thal.mean())
df['ca'] = df.ca.fillna(df.ca.mean())

# distribution of target vs age
# sns.set_context("paper", font_scale=2, rc={"font.size": 20, "axes.titlesize": 25, "axes.labelsize": 20})
# sns.catplot(kind='count', data=df, x='age', hue='target', order=df['age'].sort_values().unique())
# plt.title('Variation of Age for each target class')
# plt.show()

# barplot of age vs sex with hue = target
# sns.catplot(kind='bar', data=df, y='age', x='sex', hue='target')
# plt.title('Distribution of age vs sex with the target class')
# plt.show()

df['sex'] = df.sex.map({'female': 0, 'male': 1})

# data preprocessing
X = df.iloc[:, :-1].values
y = df.iloc[:, -1].values

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
print('\n' + classification_report(Y_validation, predictions))
