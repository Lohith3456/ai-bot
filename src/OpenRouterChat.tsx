import React, { useState } from "react";
import "./OpenRouterChat.css";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  choices: {
    message: ChatMessage;
  }[];
}

const OpenRouterChat: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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", // Replace with actual key
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-site.com", // Optional
          "X-Title": "My React Bot", // Optional
        },
        body: JSON.stringify({
          model: "tencent/hunyuan-a13b-instruct:free",
          messages: [{ role: "user", content: question }],
        }),
      });

      const data: ChatResponse = await response.json();
      const message = data?.choices?.[0]?.message?.content;

      setAnswer(message || "No response from the AI.");
    } catch (error: any) {
      setAnswer("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

    function formatAnswer(text: string): string {
  return text
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")                         // Convert ### headings
    .replace(/^1\. (.+)$/gm, "<li>1. $1</li>")                      // List
    .replace(/```jsx([\s\S]*?)```/gm, "<pre><code>$1</code></pre>") // Code blocks (jsx)
    .replace(/```([\s\S]*?)```/gm, "<pre><code>$1</code></pre>")    // Code blocks
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")               // Bold
    .replace(/\n/g, "<br/>");                                       // New lines
}


  return (
    <div className="chat-container">
      <h1>🤖 OpenRouter AI Chat</h1>
      <textarea
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      ></textarea>
      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>
<div className="response-box">
  <h3>Response:</h3>
  {answer && (
    <>
      <div
        className="chat-bubble"
        dangerouslySetInnerHTML={{ __html: formatAnswer(answer) }}
      ></div>
      <button className="clear-button" onClick={() => setAnswer("")}>
        Clear
      </button>
    </>
  )}
</div>
</div>
  );
};

export default OpenRouterChat;
