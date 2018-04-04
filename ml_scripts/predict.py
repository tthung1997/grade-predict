import pandas as pd
import numpy as np
import sklearn
import sys, json
from sklearn import datasets, linear_model, neighbors, svm
from sklearn.externals import joblib

def read_in():
	rFile = open('ml_scripts/models/' + sys.argv[1] + '/params.txt', 'r')
	params = rFile.read().split(",")
	rFile.close()
	result = []
	for param in params:
		for i in range(1, len(sys.argv)):
			if (sys.argv[i] == param):
				result += [float(sys.argv[i + 1])]
				break
	return [result]

def get_prediction(model, X):
	pred = []
	for val in model.predict(X):
		if (val < 0.5):
			pred.append(0)
		elif (val < 1.5):
			pred.append(1)
		else:
			pred.append(2)
	return pred[0]

def main():
	X = read_in()
	rFile = open('ml_scripts/models/' + sys.argv[1] + '/noOfModels.txt', 'r')
	noOfModels = int(rFile.read())
	rFile.close()
	resnum = 0
	for i in range(noOfModels):
		model = joblib.load('ml_scripts/models/' + sys.argv[1] + '/model' + str(i) + '.pkl')
		resnum = max(resnum, get_prediction(model, X))
	if (resnum == 0): 
		res = "Good"
	elif (resnum == 1): 
		res = "OK"
	else: 
		res = "High-risk"
	print(res, end='', flush=True)

if __name__ == '__main__':
	main()
