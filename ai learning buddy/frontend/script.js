async function generate() {
  const topicsInput = document.getElementById("topics").value;
  const scoresInput = document.getElementById("scores").value;

  if (!topicsInput || !scoresInput) {
    alert("Please enter both topics and scores");
    return;
  }

  document.getElementById("loader").style.display = "block";
  document.getElementById("output").style.display = "none";

  try {
    const res = await fetch("http://localhost:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topics: topicsInput, scores: scoresInput }),
    });

    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    document.getElementById("loader").style.display = "none";
    document.getElementById("output").style.display = "block";

    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
      <h2>Recommendation:</h2>
      <div class="recommendation">${formatText(data.recommendation)}</div>
      <div class="topic-buttons"></div>
    `;

    const topicsArray = topicsInput.split(',').map(t => t.trim()).filter(t => t);
    const buttonsDiv = outputDiv.querySelector(".topic-buttons");
    topicsArray.forEach(topic => {
      const btn = document.createElement("button");
      btn.innerText = `Get Answer for "${topic}"`;
      btn.onclick = () => getAnswer(topic);
      buttonsDiv.appendChild(btn);
    });

    document.getElementById("topics").style.display = "none";
    document.getElementById("scores").style.display = "none";
    document.getElementById("generate-btn").style.display = "none";
    document.getElementById("back").style.display = "block";
  } catch (error) {
    document.getElementById("loader").style.display = "none";
    alert("Error generating recommendations: " + error.message);
  }
}

async function getAnswer(topic) {
  const answerDivId = `answer-${topic.replace(/\s+/g, '-')}`;
  let answerDiv = document.getElementById(answerDivId);
  
  if (!answerDiv) {
    answerDiv = document.createElement("div");
    answerDiv.id = answerDivId;
    answerDiv.className = "answer";
    document.getElementById("output").appendChild(answerDiv);
  }

  answerDiv.innerHTML = '<div class="small-loader"></div>';

  try {
    const res = await fetch("http://localhost:8000/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    answerDiv.innerHTML = `
      <h3>Detailed Answer for "${topic}"</h3>
      <div class="answer-content">${formatText(data.answer)}</div>
    `;
  } catch (error) {
    answerDiv.innerHTML = `<p class="error">Error loading answer: ${error.message}</p>`;
  }
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<li>$1</li>')
    .replace(/\n/g, '<br>')
    .replace(/^\s*-\s*(.*?)$/gm, '<li>$1</li>');
}

function goBack() {
  document.getElementById("topics").style.display = "block";
  document.getElementById("scores").style.display = "block";
  document.getElementById("generate-btn").style.display = "block";
  document.getElementById("back").style.display = "none";
  document.getElementById("output").style.display = "none";
  document.getElementById("output").innerHTML = "";
}