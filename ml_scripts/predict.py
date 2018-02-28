import pandas as pd
import numpy as np
import sklearn
import sys, json
from sklearn import datasets, linear_model, neighbors, svm
from sklearn.externals import joblib

def read_in():
    q1 = float(sys.argv[1])
    q2 = float(sys.argv[2])
    q3 = float(sys.argv[3])
    hw1 = float(sys.argv[4])
    hw2 = float(sys.argv[5])
    hw3 = float(sys.argv[6])
    midterm = float(sys.argv[7])
    return [[q1, q2, q3, hw1, hw2, hw3, midterm]]

def main():
    X = read_in()
    lr = joblib.load('ml_scripts/models/lr.pkl') 
    nb = joblib.load('ml_scripts/models/nb.pkl')
    res = min(lr.predict(X)[0], nb.predict(X)[0])
    print(res, end='', flush=True)

if __name__ == '__main__':
    main()
