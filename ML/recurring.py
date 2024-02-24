from bs4 import BeautifulSoup as bs
import matplotlib.pyplot as plt
import pandas as pd
import requests
import json
import re

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
 
print(json.dumps(all_banks))