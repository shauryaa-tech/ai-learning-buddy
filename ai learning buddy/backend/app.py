from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    topics: str
    scores: str

class TopicInput(BaseModel):
    topic: str

os.environ["GOOGLE_API_KEY"] = "AIzaSyAfx_0oAt75LCRVzyF3hAPiJjIDfuZ_n3Y"

llm = ChatGoogleGenerativeAI(model="models/gemini-1.5-flash-latest", temperature=0.2)

def get_input(state): return state

def analyze(state):
    prompt = (
        "You are a smart AI tutor. Based on the topics and quiz scores, recommend personalized learning suggestions.\n"
        f"Topics: {state['topics']}\n"
        f"Scores: {state['scores']}\n"
        "Give revision suggestions and 2 practice questions per weak topic."
        "Format your response with clear headings and bullet points."
        "Don't use markdown symbols like ** or *, just provide clean text."
    )
    response = llm.invoke([HumanMessage(content=prompt)])
    state["recommendation"] = response.content
    return state

builder = StateGraph(dict)
builder.set_entry_point("get_input")
builder.add_node("get_input", get_input)
builder.add_node("analyze", analyze)
builder.add_edge("get_input", "analyze")
builder.add_edge("analyze", END)
graph = builder.compile()

@app.post("/recommend")
async def recommend(data: UserInput):
    final = graph.invoke({
        "topics": data.topics.split(","),
        "scores": [int(s.strip()) for s in data.scores.split(",") if s.strip().isdigit()]
    })
    return {"recommendation": final["recommendation"]}

@app.post("/answer")
async def get_answer(data: TopicInput):
    prompt = (
        f"You are a smart AI tutor. Provide a detailed explanation and answer for the topic: {data.topic}\n"
        "Include key concepts, examples, and common mistakes to avoid.\n"
        "Format your response with clear headings and bullet points.\n"
        "Don't use markdown symbols like ** or *, just provide clean text."
    )
    response = llm.invoke([HumanMessage(content=prompt)])
    return {"answer": response.content}