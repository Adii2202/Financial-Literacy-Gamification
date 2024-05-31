# Financial Literacy Gamification
## Problem Statement
"The sooner we start, the better it is for our financial future."
Financial literacy is crucial for individuals of all ages, yet traditional financial education often fails to engage young learners and those from non-financial backgrounds. This lack of engagement results in poor knowledge retention and limited practical application of financial concepts.
Despite the critical importance of financial literacy, many individuals find traditional financial education tools unengaging and difficult to understand, leading to low user engagement and limited practical application of financial concepts. There is a need for an interactive, user-friendly platform that not only educates users on financial topics but also keeps them engaged through gamification and thematic design. Additionally, users require real-time support and resources to enhance their learning experience and facilitate the practical application of financial knowledge.

## Description
Financial Literacy Gamification is an innovative financial web application with a unique Minecraft-themed interface(Game Interface), featuring expert sessions, blogs, and financial to-do lists, Stock price analysis games, and 2 players parties for Pair programming. Rewards System to boost confidence and increase engagement. Interactive gaming experience where users can form 2-player parties to battle monsters and earn rewards for task completion. The application includes a real-time profile dashboard with charts and a rewards shop offering skins and potions with a competitive Leaderboard.
Users can get to know the expert sessions and can follow the same where interactive sessions with polls and live Q&A will be conducted. Daily todo will be provided with daily quizzes and daily tasks which which will contain quizzes 50 % from the articles that will be provided and 50 % random.
Integrated a personal assistant chatbot and a Financial document chat support where users can upload the docs and chat or get to know the insights of the docs with stored chat history. Used Mistral for seamless user support, RAG, Qdrant vector DB, and created a stock market analysis game designed to enhance investment skills for users with no prior finance knowledge.

# Block-Diagram
![image](https://github.com/gamechanger2580/Tech-A-Thon/assets/101705932/16a2f684-cb09-49ed-911c-9c99a17a9717)

## Tech Stack
- **React Js**: Frontend Development Framework
- **Node Js, Express Js, Flask, FastApi**: Backend Development Framework
- **Web-Rtc TypeScript**: Video Streaming and chatting with live Q&A
- **yfinance**: Latest Stock shares information.
- **NLP and RAG for making daily Q&A**: Daily Q&A for financial knowledge.
- **Mistral 8x7B LLM**: Language model used for natural language processing tasks.
- **RAG with QDrant Vector DB**: Integrates RAG model and QDrant Vector DB for real-time query resolution.
  
## Installation Steps

### Frontend
1. Rename all `.env.sample` files to `.env` and fill in the required data.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
 
### Backend
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

### Flask Server
1. Set up a conda environment with Python 3.10.
2. Navigate to the chatbot directory: `cd botserver`
3. Install dependencies: `pip install -r requirements.txt`
4. Run the Flask app: `python app.py`

## Libraries and Dependencies
### Frontend
- `Material UI`
- `Framer motion`
- `Tailwind`
- `mui-one-time-password-input`
- `TypeScript`
- `mui-one-time-password-input`
- `Redux`

### Backend
- `cors`
- `twillio`
  
### Flask
- `Langchain_community`
- `langchain`
- `Huggingface - Mistral 8x7B`
- `flask_cors`
- `yfinance`
- `Retrieval Augmented Reality(RAG)`
- `qDrant` 

### Database
- `MongoDb Atlas`

## Overview Video
[[Video Demo]]([youtu.be/Is73RUKZmo0](https://youtu.be/Is73RUKZmo0?si=4Z6QeeL22J69dxZs))

## Features
1. **Minecraft-Themed Interface**: A visually appealing, game-like interface that makes financial learning enjoyable and engaging.
2. **Expert Sessions**: Live interactive sessions with financial experts, including polls and Q&A segments, to enhance learning and provide real-time support.
3. **Blogs and Articles**: A library of articles and blog posts covering various financial topics to provide users with a wealth of information.
4. **Financial To-Do Lists**: Daily and weekly to-do lists that guide users through practical financial tasks and learning activities.
5. **Stock Market Analysis Game**: A game designed for users with no prior finance knowledge to enhance their investment skills through simulated stock market activities.
6. **2-Player Gaming Parties**: Users can form pairs to complete tasks and battle monsters, encouraging collaborative learning and engagement.
7. **Reward System**: Earn rewards for completing tasks and participating in activities, boosting user confidence and engagement.
8. **Profile Dashboard**: A real-time dashboard displaying user progress, achievements, and personalized charts.
9. **Rewards Shop**: Users can redeem earned rewards for skins, potions, and other items, enhancing the gaming experience.
10. **Competitive Leaderboard**: A leaderboard that fosters healthy competition among users by displaying top performers.
11. **Daily Quizzes and Tasks**: Daily quizzes and tasks, with questions derived 50% from provided articles and 50% randomly, to reinforce learning and encourage regular participation.
12. **Personal Assistant Chatbot**: A chatbot powered by Mistral for seamless user support, providing assistance and answering queries in real time.
13. **Financial Document Chat Support**: Users can upload financial documents and chat with the assistant to gain insights and receive explanations, with stored chat history for future reference.
14. **Interactive Gaming Experience**: Engaging game mechanics where users can battle monsters and complete tasks for rewards, enhancing the learning process through gamification.
15. **Real-Time User Support**: Integrated real-time support to assist users with any issues or questions they may have, ensuring a smooth learning experience.
16. **Resource Library**: A collection of resources, including videos, articles, and interactive tools, to support users in their financial education journey.
