from langchain.schema import HumanMessage, AIMessage
from langchain_community.chat_models.huggingface import ChatHuggingFace
from langchain.prompts import PromptTemplate
from flask import Flask, jsonify, request
from langchain_community.llms import HuggingFaceHub
from flask_cors import CORS
import yfinance as yf
import os

from dotenv import load_dotenv, get_key
load_dotenv()

app = Flask(__name__)

CORS(app)

os.environ["HUGGINGFACEHUB_API_TOKEN"] = get_key(key_to_get="HUGGINGFACEHUB_API_KEY",dotenv_path=".env")

llm = HuggingFaceHub(
    repo_id="mistralai/Mixtral-8x7B-Instruct-v0.1",
    task="text-generation",
    model_kwargs={
        "max_new_tokens": 512,
        "top_k": 30,
        "temperature": 0.3,
        "repetition_penalty": 1.03,
    },
)
def get_hist_data(symbol):
    stock = yf.Ticker(symbol)
    hist = stock.history(period="1y")
    # Reset index to get the Date as a column
    hist.reset_index(inplace=True)
    # Convert Date to string format to ensure JSON serializable
    hist['Date'] = hist['Date'].dt.strftime('%Y-%m-%d')
    return hist.to_json(orient='records')

@app.route('/get_historical_data', methods=['GET'])
def get_historical_data():
    symbol = request.args.get('symbol')
    if symbol is None:
        return jsonify({"error": "Symbol parameter is missing"}), 400
    try:
        historical_data = get_hist_data(symbol)
        return historical_data
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def chatwithbot(txt:str):
    chat_model = ChatHuggingFace(llm=llm)
    user_template= PromptTemplate(template="{user_input}", input_variables=["user_input"])
    messages = [
    HumanMessage(content="..."),
    AIMessage(content="You're a helpful muli lingual financial assistant, user asks their query and you have to respond accuretly and strictly in same language."),
    HumanMessage(content=user_template.format(user_input=txt)),
    ]
    res = chat_model(messages).content
    return res


@app.route('/chat',methods=["POST"])
def chat():
    try:
        txt = request.form['text']
        res = chatwithbot(txt)
        res = str(res)
        last_inst_index = res.rfind("[/INST]")
        res = res[last_inst_index + len("[/INST]"):].strip()
        print(res)
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    
    app.run(debug=True)