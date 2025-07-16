![Preview of AI Learning Buddy](ai learning buddy/frontend/image.png)




## 🌐 Live Architecture

ai-learning-buddy/
├── backend/
│   ├── app.py               # LangGraph backend using Gemini
|   └── requirements.txt     # Python dependencies          
├── frontend/
│   ├── index.html           # Web UI
│   ├── style.css            # Styling
│   └── script.js            # Frontend logic


# 🧠 AI Learning Buddy

AI Learning Buddy is a web-based AI tutor built with *FastAPI (Python backend)* and *Vanilla JavaScript (frontend)*. It helps students improve by providing:

-> Personalized learning suggestions based on quiz scores
-> Follow-up topic explanations
-> Practice questions for weak areas


## ⚙ How to Run the Project

## 🔧 1. Install Backend Dependencies

Make sure you have Python 3.10+. Then run:

```bash
pip install fastapi uvicorn langgraph langchain-core langchain-google-genai pydantic

# 🔧 2. Set Google Gemini API Key

## You must set the environment variable:

- export GOOGLE_API_KEY=your_key_here

Or replace it directly in app.py for testing:--

- os.environ["GOOGLE_API_KEY"] = "your_key_here"


## 🚀 3. Run the Backend Server

uvicorn app:app --reload --port 8000


🌍 4. Open the Frontend

-> Open frontend/index.html in your browser (just double-click or serve using Live Server in VS Code).



🧠 What Happens Behind the Scenes

Backend (app.py)
	•	FastAPI handles API endpoints.
	•	Gemini model generates responses using langchain_google_genai.
	•	LangGraph defines a flow:
	•	get_input → analyze → END
	•	/recommend returns study suggestions.
	•	/answer returns detailed topic explanations.


Frontend (script.js)
	•	Takes user input
	•	Sends POST requests to /recommend and /answer
	•	Dynamically updates DOM to show output and answer buttons



## Coding Description 

✅ Python (app.py)
	•	FastAPI and CORSMiddleware allow communication with frontend
	•	UserInput and TopicInput define input structure
	•	Gemini LLM is initialized using API key
	•	AI flow:
	•	Takes input
	•	Constructs prompt for Gemini
	•	Returns clean, bullet-pointed study advice

✅ JavaScript (script.js)
	•	generate(): Sends input to /recommend and shows suggestions
	•	Creates a button for each topic: clicking it calls /answer
	•	formatText(): cleans Gemini response for HTML
	•	goBack(): resets the UI


## Setup
1. Clone repository
2. Install backend dependencies: `pip install -r backend/requirements.txt`
3. Run backend: `uvicorn backend.app:app --reload`
4. Open `frontend/index.html` in browser


👨‍💻 Author

Created by Shaurya Pratap Singh
Powered by FastAPI, LangGraph, and Gemini AI
