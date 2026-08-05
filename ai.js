const chatBox = document.getElementById("chatBox");

function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = "message " + cls;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("prompt");
  const apiKey = document.getElementById("apiKey").value.trim();

  if (!apiKey) {
    alert("Nhập API Key trước.");
    return;
  }

  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-5",
        input: text
      })
    });

    const data = await res.json();

    const reply =
      data.output_text ||
      "Không nhận được phản hồi.";

    addMessage(reply, "ai");
  } catch (e) {
    addMessage("Lỗi kết nối hoặc API.", "ai");
  }
}
