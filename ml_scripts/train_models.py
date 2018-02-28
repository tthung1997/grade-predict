import pandas as pd
import numpy as np
import sklearn
from sklearn import datasets, linear_model, neighbors, svm, naive_bayes
from sklearn.utils import column_or_1d
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
import re

def load_data(csv_path):
    return pd.read_csv(csv_path, index_col = 0)

#Load input
inpgrade = load_data("public/file-storage/grade.csv")
names = list(inpgrade.columns.values)
#Rename columns
for name in names:
    newName = re.sub(r"\(.*\)", "", name).strip()
    inpgrade.rename(columns = {name: newName}, inplace = True)
inpgrade = inpgrade.drop(inpgrade.index[0])
inpgrade = inpgrade.drop(inpgrade.index[0])
if ('ID' in inpgrade.columns.values):
    inpgrade = inpgrade.drop('ID', axis = 1)
if ('Section' in inpgrade.columns.values):
    inpgrade = inpgrade.drop('Section', axis = 1)
inpgrade.dropna(axis = 1, how = 'all', inplace = True)
inpgrade.fillna(0, inplace = True)
chosen = inpgrade.select_dtypes(include='float64').columns.values

#Load data
grade = load_data("ml_scripts/data/full-grade-235.csv")
intersect = [val for val in chosen if val in grade.columns.values]
X = grade[intersect]
y = grade[["Grade"]].values.ravel()

#Create models
lr_model = sklearn.linear_model.LogisticRegression(solver='newton-cg',multi_class='multinomial') # Train the model
nb_model  = sklearn.naive_bayes.GaussianNB()
lr_model.fit(X, y)
nb_model.fit(X, y)

#Export models
from sklearn.externals import joblib
joblib.dump(lr_model, 'ml_scripts/models/lr.pkl')
joblib.dump(nb_model, 'ml_scripts/models/nb.pkl')

res = ""
for feature in intersect:
	res += feature + ","
res = res[:-1]
print(res, end='', flush=True)

#Testing
#some_rows = inpgrade
#some_data = some_rows[intersect]
#lr_predict = lr_model.predict(some_data)
#nb_predict = nb_model.predict(some_data)
#predict = [""] * len(lr_predict)
#for i in range(len(lr_predict)):
#    if (lr_predict[i] == "High-risk" or nb_predict[i] == "High-risk"):
#        predict[i] = "High-risk"
#    elif (lr_predict[i] == "OK" or nb_predict[i] == "OK"):
#        predict[i] = "OK"
#    else:
#        predict[i] = "Good"
#print("Data:", some_data)
#nuid = list(map(int, inpgrade['SIS User ID'].values))
#print("Predictions:", np.column_stack((nuid, predict)))
