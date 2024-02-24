from sklearn.preprocessing import MinMaxScaler,StandardScaler
from keras.layers import SimpleRNN,LSTM,Dense,Dropout
from sklearn.model_selection import train_test_split
from django.http import JsonResponse,HttpResponse
from django.shortcuts import render
from bs4 import BeautifulSoup as bs
from keras.models import Sequential
from sklearn.metrics import *
import yfinance as yf
import numpy as np
import requests
import json
import re


# Create your views here.
def bankAPI(request):
    
    if(request.method == 'GET'):
        url = "https://groww.in/recurring-deposit/rd-interest-rates"
        req = requests.get(url)
        soup = bs(req.content, "html.parser")

        table_data = soup.find('table',{"dir":"ltr"})

        all_banks = []
        for row in table_data.find_all('tr')[1:]:
            data = {}
            bank_data = []
            for row_data in row.find_all('td'):
                bank_data.append(row_data)
            # print(data)
            data['bank'] = re.sub('[^A-Za-z\s+]','',bank_data[0].text)
            data['min rate'] = float(re.sub('[^0-9.\s+]','',bank_data[1].text.split()[0]))
            data['max rate'] = float(re.sub('[^0-9.\s+]','',bank_data[1].text.split()[-1]))

            all_banks.append(data)
        
        response = {"data":all_banks}
        return JsonResponse(response)
    
def stocksAPI(request):
    if(request.method == 'GET'):
        url = "https://finance.yahoo.com/trending-tickers/"
        req = requests.get(url)
        soup = bs(req.content, "html.parser")

        stocks = []
        for row in soup.find_all('tr',{"class":"simpTblRow Bgc($hoverBgColor):h BdB Bdbc($seperatorColor) Bdbc($tableBorderBlue):h H(32px) Bgc($lv2BgColor)"}):
            stock = {}
            cnt = 0
            for data in row.find_all('td'):
                stock[data.get('aria-label')] = data.text
                cnt+=1
                if(cnt == 3):
                    break
            stocks.append(stock)
        
        response = {"data":stocks}
        return JsonResponse(response)
    
    if(request.method == 'POST'):
        symbol  = request.POST.get('symbol')
        stocks = yf.Ticker(symbol)

        scale = MinMaxScaler(feature_range=(0,1))
        prices = np.array(stocks.history(period='5y')['Open'])
        if(len(prices) == 0):
            return JsonResponse({'data':"Couldn't fetch stock data"})

        prices = scale.fit_transform(prices.reshape(-1,1))

        x,y = [],[]

        #days to use for model training
        steps = 30

        for i in range(0,len(prices)-steps-1):
            x.append(prices[i:i+steps,0])
            y.append(prices[i+steps,0])
        x = np.array(x)
        x = x.reshape(x.shape[0],x.shape[1],1)
        y = np.array(y)

        #data split
        split = 0.1
        xtrain, xtest = x[:len(x)-int(split * len(x))], x[len(x)-int(split * len(x)):]
        ytrain, ytest = y[:len(y)-int(split * len(y))], y[len(y)-int(split * len(y)):]

        #model architecture
        model = Sequential()
        model.add(SimpleRNN(50,input_shape = (x.shape[1],1)))
        model.add(Dropout(0.65))
        model.add(Dense(1))
        model.compile(optimizer='adam',loss='mean_squared_error')
        model.fit(xtrain,ytrain,epochs=5)
        
        ypred = model.predict(xtest)
        mse = mean_absolute_error(scale.inverse_transform(ytest.reshape(-1,1)).reshape(-1), scale.inverse_transform(ypred.reshape(-1,1)).reshape(-1))

        future_pred_len = 5
        last_seq = x.reshape(-1,steps)[-1]
        future_pred = []
        for i in range(0,future_pred_len):
            pred = model.predict(last_seq.reshape(1,steps,1))
            future_pred.append((pred))
            last_seq = np.hstack((last_seq[1:], pred.reshape(-1)))
        future_pred = np.array(future_pred)

        response = np.hstack((scale.inverse_transform(x.reshape(-1,steps)[-1].reshape(-1,1)).reshape(-1)[-15:],scale.inverse_transform(future_pred.reshape(-1,1)).reshape(-1)+mse))

        return JsonResponse({'data':list(response)})
