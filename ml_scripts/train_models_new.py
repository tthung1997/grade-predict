import pandas as pd
import numpy as np
import sklearn
from sklearn import datasets, linear_model, neighbors, svm, naive_bayes
from sklearn.neural_network import MLPRegressor
from sklearn.utils import column_or_1d
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.externals import joblib
import re
import sys

def load_data(csv_path):
    return pd.read_csv(csv_path, index_col = 0)

def read_in():
	course = sys.argv[1];
	return course;

def get_rmse(model, X, y):
	model.fit(X, y)
	predictions = []
	for val in model.predict(X):
		if (val < 0.5):
			predictions.append(0)
		elif (val < 1.5):
			predictions.append(1)
		else:
			predictions.append(2)
	lin_mse = mean_squared_error(y, predictions) 
	lin_rmse = np.sqrt(lin_mse)
	return lin_rmse
	
#Load input
inpgrade = load_data("public/file-storage/grade.csv")
names = list(inpgrade.columns.values)
course = read_in()
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
inpgrade['Full name'] = inpgrade.index.values
chosen = inpgrade.select_dtypes(include='float64').columns.values
#fileO = open("ml_scripts/data/" + course + "/grade.json", "w")
#fileO.write(inpgrade.to_json(orient="records"))
#fileO.close() 

#Load data
grade = load_data("ml_scripts/data/" + course + "/full-grade.csv")
intersect = [val for val in chosen if val in grade.columns.values]
X = grade[intersect]
y = grade[["Grade"]].values.ravel()
y1 = []
for label in y:
	if label == "Good":
		y1.append(0)
	if label == "OK":
		y1.append(1)
	if label == "High-risk":
		y1.append(2)

#Create models
models = []
models.append(sklearn.linear_model.LogisticRegression(solver='newton-cg',multi_class='multinomial')) # Logistic Regression
models.append(sklearn.naive_bayes.GaussianNB()) # Naive Bayes
models.append(sklearn.neighbors.KNeighborsRegressor(n_neighbors=10)) # k Nearest Neighbors
models.append(svm.SVR()) # Support Vector Machine
#models.append(MLPRegressor(hidden_layer_sizes=(60,),activation='logistic',solver='lbfgs',learning_rate='adaptive',max_iter=1000,learning_rate_init=0.01,alpha=0.01)) # Neuron network
models.append(DecisionTreeRegressor()) # Decision Tree
models.append(RandomForestRegressor()) # Random Forest

chosenModels = [None]
minRMSE = float("inf")
#rmse = get_rmse(models[0], X, y1)
#rmse = get_rmse(models[1], X, y1)
#rmse = get_rmse(models[2], X, y1)
#rmse = get_rmse(models[3], X, y1)
#rmse = get_rmse(models[4], X, y1)
#rmse = get_rmse(models[5], X, y1)
#rmse = get_rmse(models[6], X, y1)
for model in models:
	rmse = get_rmse(model, X, y1)
	if rmse < minRMSE:
		minRMSE = rmse
		chosenModels[0] = model
#
lr_pred = []
nb_pred = []
for val in models[0].predict(X):
	if (val < 0.5):
		lr_pred.append(0)
	elif (val < 1.5):
		lr_pred.append(1)
	else:
		lr_pred.append(2)
for val in models[1].predict(X):
	if (val < 0.5):
		nb_pred.append(0)
	elif (val < 1.5):
		nb_pred.append(1)
	else:
		nb_pred.append(2)
lrnb_pred = []
for i in range(len(lr_pred)):
	lrnb_pred.append(max(lr_pred[i], nb_pred[i]))
mse = mean_squared_error(y1, lrnb_pred) 
rmse = np.sqrt(mse)
if (rmse <= minRMSE):
	chosenModels[0] = models[0]
	chosenModels.append(models[1])

#Export models
for i in range(len(chosenModels)):
	joblib.dump(chosenModels[i], 'ml_scripts/models/' + course + '/model' + str(i) + '.pkl')

#print(chosenModels[0].predict([[100,100,100,100,10,10,10,10,30,10]]))

res = str(len(chosenModels)) + ";"
#res = ""
for feature in intersect:
	res += feature + ","
res = res[:-1] + ";"
res += inpgrade.to_json(orient="records")
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
