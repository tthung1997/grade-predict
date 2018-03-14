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

def main():
    X = read_in()
    lr = joblib.load('ml_scripts/models/' + sys.argv[1] + '/lr.pkl') 
    nb = joblib.load('ml_scripts/models/' + sys.argv[1] + '/nb.pkl')
    res = min(lr.predict(X)[0], nb.predict(X)[0])
    print(res, end='', flush=True)

if __name__ == '__main__':
    main()
