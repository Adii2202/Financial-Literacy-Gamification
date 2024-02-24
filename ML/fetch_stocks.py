from bs4 import BeautifulSoup as bs
import matplotlib.pyplot as plt
import requests
import re
import pandas as pd

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
        if(cnt == 2):
            break
    stocks.append(stock)

print(stocks)