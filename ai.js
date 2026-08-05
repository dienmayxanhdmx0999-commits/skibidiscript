const API_KEY = "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";
const MODEL = "openai/gpt-4o-mini";

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("prompt");

function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "message " + type;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {

    const text = input.value.trim();
    if (!text) return;

    document.querySelector(".welcome")?.remove();

    addMessage(text, "user");
    input.value = "";

    try {

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {

            method: "POST",

            headers: {
                "Authorization": `Bearer ${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}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://dienmayxanhdmx0999-commits.github.io/skibidiscript/",
                "X-Title": "NOXGPT"
            },

            body: JSON.stringify({

                model: MODEL,

                messages: [

                    {
                        role: "system",
                        content: "Bạn là NOXGPT. Luôn trả lời bằng tiếng Việt trừ khi người dùng yêu cầu ngôn ngữ khác."
                    },

                    {
                        role: "user",
                        content: text
                    }

                ]

            })

        });

        const data = await response.json();

        if (data.error) {
            addMessage("❌ " + data.error.message, "ai");
            return;
        }

        addMessage(data.choices[0].message.content, "ai");

    } catch (err) {

        console.log(err);
        addMessage("❌ Không thể kết nối đến OpenRouter.", "ai");

    }

}

input.addEventListener("keydown", function(e){

    if(e.key==="Enter" && !e.shiftKey){

        e.preventDefault();
        sendMessage();

    }

});
