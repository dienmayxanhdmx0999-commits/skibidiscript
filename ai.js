const chat = document.getElementById("chat");
const prompt = document.getElementById("prompt");
const thinking = document.getElementById("thinking");

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");

const apiModal = document.getElementById("apiModal");
const apiInput = document.getElementById("apiKey");
const saveApi = document.getElementById("saveApi");

let history = [];

/* ===========================
   SIDEBAR
=========================== */

menuBtn.onclick = () => {
    sidebar.classList.add("show");
    overlay.classList.add("show");
};

overlay.onclick = () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
};

/* ===========================
   API KEY
=========================== */

apiInput.value = localStorage.getItem("NOX_API") || "";

document.getElementById("apiBtn").onclick = () => {
    apiModal.classList.remove("hidden");
};

saveApi.onclick = () => {
    localStorage.setItem("NOX_API", apiInput.value.trim());
    apiModal.classList.add("hidden");
};

apiModal.onclick = e => {
    if (e.target === apiModal)
        apiModal.classList.add("hidden");
};

/* ===========================
   CHAT
=========================== */

function addMessage(text, type) {

    document.querySelector(".welcome")?.remove();

    const div = document.createElement("div");

    div.className = "message " + type;

    if (type === "ai") {

        div.innerHTML = marked.parse(text);

        document.querySelectorAll("pre code")
            .forEach(el => hljs.highlightElement(el));

    } else {

        div.textContent = text;

    }

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;

}

async function sendMessage() {

    const text = prompt.value.trim();

    if (!text) return;

    addMessage(text, "user");

    history.push({
        role: "user",
        content: text
    });

    prompt.value = "";

    thinking.classList.remove("hidden");

    const apiKey = localStorage.getItem("NOX_API");

    if (!apiKey) {

        thinking.classList.add("hidden");

        addMessage(
            "Chưa có API Key. Mở ☰ → API Key để nhập.",
            "ai"
        );

        return;

    }

    try {

        const res = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {

                method: "POST",

                headers: {

                    Authorization: "Bearer " + apiKey,

                    "Content-Type": "application/json",

                    "HTTP-Referer": location.origin,

                    "X-Title": "NOXGPT"

                },

                body: JSON.stringify({

                    model: "openai/gpt-4o-mini",

                    messages: history

                })

            });

        const data = await res.json();

        thinking.classList.add("hidden");

        if (data.error) {

            addMessage(data.error.message, "ai");

            return;

        }

        const reply = data.choices[0].message.content;

        history.push({

            role: "assistant",

            content: reply

        });

        addMessage(reply, "ai");

    }

    catch {

        thinking.classList.add("hidden");

        addMessage("Không thể kết nối tới AI.", "ai");

    }

}

/* ===========================
   NEW CHAT
=========================== */

document.getElementById("newChat").onclick = () => {

    history = [];

    chat.innerHTML = `
    <div class="welcome">
        <img src="assets/logo.svg">
        <h2>NOXGPT</h2>
        <p>Xin chào, tôi có thể giúp gì cho bạn?</p>
    </div>
    `;

};

/* ===========================
   CLEAR CHAT
=========================== */

document.getElementById("clearBtn").onclick = () => {

    history = [];

    chat.innerHTML = "";

};

/* ===========================
   ENTER
=========================== */

prompt.addEventListener("keydown", e => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendMessage();

    }

});

/* ===========================
   AUTO HEIGHT
=========================== */

prompt.addEventListener("input", () => {

    prompt.style.height = "54px";

    prompt.style.height = prompt.scrollHeight + "px";

});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}
