const chatBox = document.getElementById("chatBox");

function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "message " + type;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const apiKey = document.getElementById("apiKey").value.trim();
    const input = document.getElementById("prompt");
    const text = input.value.trim();

    if (!apiKey) {
        alert("Nhập API Key");
        return;
    }

    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://dienmayxanhdmx0999-commits.github.io/skibidiscript/",
                "X-Title": "Skibidi AI"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: text
                    }
                ]
            })
        });

        const data = await res.json();

        if (data.error) {
            addMessage("Lỗi: " + data.error.message, "ai");
            return;
        }

        addMessage(data.choices[0].message.content, "ai");

    } catch (err) {
        addMessage("Không thể kết nối API", "ai");
        console.log(err);
    }
}
