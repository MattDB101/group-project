from pandas import read_csv, concat
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.svm import SVC


# Load dataset
data_cross = read_csv("extras/oasis_cross-sectional.csv")
data_long = read_csv("extras/oasis_longitudinal.csv")

# Removing unnecessary columns
data_cross.drop(columns=['ID', 'Delay'], inplace=True)
data_long = data_long.rename(columns={'EDUC':'Educ'})
data_long.drop(columns=['Subject ID', 'MRI ID', 'Group', 'Visit', 'MR Delay'], inplace=True)

# Merge both datasets
dataset = concat([data_cross, data_long])
dataset.head()

# Split-out validation dataset
array = dataset.values
X = array[:, 0:4]
y = array[:, 4]
X_train, X_validation, Y_train, Y_validation = train_test_split(X, y, test_size=0.3, random_state=42)

# Make predictions on validation dataset
model = SVC(gamma='auto')
model.fit(X_train, Y_train)
predictions = model.predict(X_validation)
# Evaluate predictions
print(accuracy_score(Y_validation, predictions))
print(confusion_matrix(Y_validation, predictions))
print(classification_report(Y_validation, predictions))
