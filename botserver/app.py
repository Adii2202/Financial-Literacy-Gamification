from langchain.schema import HumanMessage, AIMessage
from langchain_community.chat_models.huggingface import ChatHuggingFace
from langchain.prompts import PromptTemplate
from flask import Flask, jsonify, request
from langchain_community.llms import HuggingFaceHub
import os

from dotenv import load_dotenv, get_key
load_dotenv()


app = Flask(__name__)


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

def chatwithbot(txt:str):
    chat_model = ChatHuggingFace(llm=llm)
    user_template= PromptTemplate(template="{user_input}", input_variables=["user_input"])
    messages = [
    HumanMessage(content="..."),
    AIMessage(content="You're a helpful muli lingual financial assistant which answers questions asked by user in language in which user is talking."),
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
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    
    app.run(debug=True)