from sklearn.preprocessing import MinMaxScaler,StandardScaler
from keras.layers import SimpleRNN,LSTM,Dense,Dropout
from sklearn.model_selection import train_test_split
from keras.models import Sequential
from sklearn.metrics import *
import yfinance as yf
import numpy as np 

def pred_stock(symbol):
    stocks = yf.Ticker(symbol)

    scale = MinMaxScaler(feature_range=(0,1))
    prices = np.array(stocks.history(period='5y')['Open'])
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
    split = 0.2
    # xtrain, xtest = x[:len(x)-int(split * len(x))], x[len(x)-int(split * len(x)):]
    # ytrain, ytest = y[:len(y)-int(split * len(y))], y[len(y)-int(split * len(y)):]

    #model architecture
    model = Sequential()
    model.add(SimpleRNN(50,input_shape = (x.shape[1],1)))
    model.add(Dropout(0.5))
    model.add(Dense(1))
    model.compile(optimizer='adam',loss='mean_squared_error')
    model.fit(x,y,epochs=5)

    # ypred = model.predict(xtest)

    future_pred_len = 5
    last_seq = x.reshape(-1,steps)[-1]
    future_pred = []
    for i in range(0,future_pred_len):
        pred = model.predict(last_seq.reshape(1,steps,1))
        future_pred.append((pred))
        last_seq = np.hstack((last_seq[1:], pred.reshape(-1)))
    future_pred = np.array(future_pred)

    # import matplotlib.pyplot as plt 

    # plt.plot(np.vstack((scale.inverse_transform(y.reshape(-1,1)),scale.inverse_transform(future_pred.reshape(-1,1)))), color = 'yellow', label = 'Future')
    # plt.plot(np.vstack((scale.inverse_transform(ytrain.reshape(-1,1)),scale.inverse_transform(ypred.reshape(-1,1)))), color = 'red', label = 'Predicted')
    # plt.plot(np.vstack((scale.inverse_transform(ytrain.reshape(-1,1)),scale.inverse_transform(ytest.reshape(-1,1)))), color = 'blue', label = 'Original')
    # plt.legend()
    # plt.show()

    return np.hstack((scale.inverse_transform(x.reshape(-1,steps)[-1].reshape(-1,1)).reshape(-1)[-15:],scale.inverse_transform(future_pred.reshape(-1,1)).reshape(-1)))

print(pred_stock("aapl"))