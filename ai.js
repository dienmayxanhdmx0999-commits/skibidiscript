/* =========================================================
   NOXGPT // CORE
   ai.js
   ========================================================= */

"use strict";

/* =========================================================
   ELEMENTS
========================================================= */

const chat = document.getElementById("chat");
const prompt = document.getElementById("prompt");
const thinking = document.getElementById("thinking");

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");

const apiModal = document.getElementById("apiModal");
const apiInput = document.getElementById("apiKey");
const saveApi = document.getElementById("saveApi");
const apiBtn = document.getElementById("apiBtn");

const newChatBtn = document.getElementById("newChat");
const clearBtn = document.getElementById("clearBtn");
const modelBtn = document.getElementById("modelBtn");
const aboutBtn = document.getElementById("aboutBtn");

const sendBtn = document.getElementById("send");
const attachBtn = document.getElementById("attach");


/* =========================================================
   CONFIG
========================================================= */

const STORAGE = {
    API: "NOX_API",
    HISTORY: "NOX_CHAT_HISTORY",
    MODEL: "NOX_MODEL"
};

const DEFAULT_MODEL = "openai/gpt-4o-mini";

let selectedModel =
    localStorage.getItem(STORAGE.MODEL) || DEFAULT_MODEL;

let history = [];


/* =========================================================
   SAFE HELPERS
========================================================= */

function safeGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error("LocalStorage read error:", error);
        return null;
    }
}

function safeSet(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error("LocalStorage write error:", error);
        return false;
    }
}

function safeRemove(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("LocalStorage remove error:", error);
    }
}


/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {
    if (sidebar) sidebar.classList.add("show");
    if (overlay) overlay.classList.add("show");
}

function closeSidebar() {
    if (sidebar) sidebar.classList.remove("show");
    if (overlay) overlay.classList.remove("show");
}

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        if (sidebar && sidebar.classList.contains("show")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
}

if (overlay) {
    overlay.addEventListener("click", closeSidebar);
}


/* =========================================================
   API KEY
========================================================= */

function loadApiKey() {
    if (!apiInput) return;

    const saved = safeGet(STORAGE.API);

    apiInput.value = saved || "";
}

loadApiKey();


function openApiModal() {
    if (!apiModal) return;

    loadApiKey();

    apiModal.classList.remove("hidden");

    setTimeout(() => {
        if (apiInput) {
            apiInput.focus();
            apiInput.select();
        }
    }, 50);
}


function closeApiModal() {
    if (apiModal) {
        apiModal.classList.add("hidden");
    }
}


if (apiBtn) {
    apiBtn.addEventListener("click", () => {
        closeSidebar();
        openApiModal();
    });
}


if (saveApi) {
    saveApi.addEventListener("click", saveApiKey);
}


function saveApiKey() {

    if (!apiInput) return;

    const key = apiInput.value.trim();

    if (!key) {
        safeRemove(STORAGE.API);
        closeApiModal();

        addMessage(
            "API Key đã được xóa. Bạn vẫn có thể sử dụng chế độ NOXGPT Demo.",
            "ai"
        );

        return;
    }

    const success = safeSet(STORAGE.API, key);

    if (!success) {
        alert("Không thể lưu API Key trên trình duyệt này.");
        return;
    }

    const verify = safeGet(STORAGE.API);

    if (verify === key) {
        closeApiModal();

        addMessage(
            "API Key đã được lưu trên thiết bị này.",
            "ai"
        );
    } else {
        alert("Không thể xác nhận API Key.");
    }
}


if (apiModal) {
    apiModal.addEventListener("click", event => {
        if (event.target === apiModal) {
            closeApiModal();
        }
    });
}


/* =========================================================
   ESC CLOSE MODAL
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeApiModal();
        closeSidebar();

    }

});


/* =========================================================
   HISTORY
========================================================= */

function loadHistory() {

    const saved = safeGet(STORAGE.HISTORY);

    if (!saved) {
        history = [];
        return;
    }

    try {

        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
            history = parsed;
        } else {
            history = [];
        }

    } catch (error) {

        console.error("History error:", error);
        history = [];

    }
}


function saveHistory() {

    safeSet(
        STORAGE.HISTORY,
        JSON.stringify(history)
    );

}


loadHistory();


/* =========================================================
   MESSAGE
========================================================= */

function addMessage(text, type) {

    if (!chat) return;

    const welcome = chat.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }

    const div = document.createElement("div");

    div.className = "message " + type;

    if (type === "ai") {

        if (window.marked) {

            try {

                div.innerHTML = marked.parse(String(text));

            } catch {

                div.textContent = text;

            }

        } else {

            div.textContent = text;

        }

    } else {

        div.textContent = text;

    }

    chat.appendChild(div);

    highlightCode(div);

    scrollChat();

}


function highlightCode(container) {

    if (!container) return;

    if (
        window.hljs &&
        typeof window.hljs.highlightElement === "function"
    ) {

        container
            .querySelectorAll("pre code")
            .forEach(code => {

                try {
                    window.hljs.highlightElement(code);
                } catch (error) {
                    console.error(error);
                }

            });

    }

}


function scrollChat() {

    if (!chat) return;

    requestAnimationFrame(() => {
        chat.scrollTop = chat.scrollHeight;
    });

}


/* =========================================================
   WELCOME
========================================================= */

function showWelcome() {

    if (!chat) return;

    chat.innerHTML = `
        <div class="welcome">
            <img src="assets/logo.svg" alt="NOXGPT">
            <h2>NOXGPT</h2>
            <p>Xin chào, tôi có thể giúp gì cho bạn?</p>
        </div>
    `;

}


/* =========================================================
   THINKING
========================================================= */

function setThinking(state) {

    if (!thinking) return;

    if (state) {
        thinking.classList.remove("hidden");
    } else {
        thinking.classList.add("hidden");
    }

}


/* =========================================================
   DEMO MODE
========================================================= */

/*
   Không có API Key thì GitHub Pages không thể tự gọi
   một AI thật mà không có backend/API.

   Vì vậy NOXGPT dùng Demo Mode thay vì báo lỗi.
*/

function demoResponse(text) {

    const lower = text.toLowerCase();

    if (
        lower.includes("xin chào") ||
        lower.includes("hello") ||
        lower.includes("hi")
    ) {

        return "Xin chào. NOXGPT đang ở **Demo Mode**. Hãy nhập API Key trong ☰ → API Key để kết nối AI thật.";

    }

    if (
        lower.includes("bạn là ai") ||
        lower.includes("who are you")
    ) {

        return "Tôi là **NOXGPT**, giao diện trợ lý AI của project này.";

    }

    if (
        lower.includes("giúp") ||
        lower.includes("help")
    ) {

        return "Tôi có thể hoạt động ở Demo Mode. Để nhận câu trả lời từ AI thật, hãy thêm API Key.";

    }

    return `NOXGPT Demo Mode đã nhận:

> ${text}

Để kết nối AI thật, mở **☰ → API Key** và nhập API Key của bạn.`;
}


/* =========================================================
   SEND MESSAGE
========================================================= */

async function sendMessage() {

    if (!prompt) return;

    const text = prompt.value.trim();

    if (!text) return;

    addMessage(text, "user");

    history.push({
        role: "user",
        content: text
    });

    saveHistory();

    prompt.value = "";

    autoResize();

    setThinking(true);

    const apiKey = safeGet(STORAGE.API);

    /*
       Không có API → Demo Mode
    */

    if (!apiKey) {

        await delay(350);

        setThinking(false);

        const reply = demoResponse(text);

        addMessage(reply, "ai");

        return;
    }


    /*
       Có API → OpenRouter
    */

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": "Bearer " + apiKey,
                    "Content-Type": "application/json",
                    "HTTP-Referer": location.href,
                    "X-Title": "NOXGPT"
                },

                body: JSON.stringify({
                    model: selectedModel,
                    messages: history
                })
            }
        );


        let data;

        try {
            data = await response.json();
        } catch {
            data = {};
        }


        setThinking(false);


        if (!response.ok) {

            const message =
                data?.error?.message ||
                `API Error ${response.status}`;

            addMessage(
                `**Lỗi API:** ${message}`,
                "ai"
            );

            return;
        }


        if (
            !data ||
            !data.choices ||
            !data.choices[0] ||
            !data.choices[0].message
        ) {

            addMessage(
                "API không trả về câu trả lời hợp lệ.",
                "ai"
            );

            return;
        }


        const reply =
            data.choices[0].message.content ||
            "AI không trả về nội dung.";


        history.push({
            role: "assistant",
            content: reply
        });

        saveHistory();

        addMessage(reply, "ai");


    } catch (error) {

        console.error("AI connection error:", error);

        setThinking(false);

        addMessage(
            "Không thể kết nối tới AI. Kiểm tra Internet hoặc API Key.",
            "ai"
        );

    }

}


/* =========================================================
   DELAY
========================================================= */

function delay(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });

}


/* =========================================================
   SEND BUTTON
========================================================= */

if (sendBtn) {

    sendBtn.addEventListener("click", event => {

        event.preventDefault();

        sendMessage();

    });

}


/* =========================================================
   ENTER
========================================================= */

if (prompt) {

    prompt.addEventListener("keydown", event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    });

}


/* =========================================================
   AUTO RESIZE
========================================================= */

function autoResize() {

    if (!prompt) return;

    prompt.style.height = "auto";

    const height =
        Math.min(prompt.scrollHeight, 150);

    prompt.style.height = height + "px";

}


if (prompt) {

    prompt.addEventListener(
        "input",
        autoResize
    );

}


/* =========================================================
   NEW CHAT
========================================================= */

if (newChatBtn) {

    newChatBtn.addEventListener("click", () => {

        history = [];

        safeRemove(STORAGE.HISTORY);

        showWelcome();

        setThinking(false);

        closeSidebar();

        if (prompt) {
            prompt.value = "";
            autoResize();
        }

    });

}


/* =========================================================
   CLEAR CHAT
========================================================= */

if (clearBtn) {

    clearBtn.addEventListener("click", () => {

        history = [];

        safeRemove(STORAGE.HISTORY);

        if (chat) {
            chat.innerHTML = "";
        }

        closeSidebar();

    });

}


/* =========================================================
   MODEL
========================================================= */

if (modelBtn) {

    modelBtn.addEventListener("click", () => {

        const model = promptForModel();

        if (!model) return;

        selectedModel = model;

        safeSet(
            STORAGE.MODEL,
            selectedModel
        );

        closeSidebar();

        addMessage(
            `Model hiện tại: **${selectedModel}**`,
            "ai"
        );

    });

}


function promptForModel() {

    const value = window.prompt(
        "Nhập Model OpenRouter:",
        selectedModel
    );

    if (!value) return null;

    return value.trim();

}


/* =========================================================
   ABOUT
========================================================= */

if (aboutBtn) {

    aboutBtn.addEventListener("click", () => {

        closeSidebar();

        addMessage(
            "**NOXGPT**\n\nAI Assistant interface.\n\nPhiên bản Core.",
            "ai"
        );

    });

}


/* =========================================================
   ATTACH
========================================================= */

if (attachBtn) {

    attachBtn.addEventListener("click", () => {

        addMessage(
            "Tính năng đính kèm file đang được chuẩn bị.",
            "ai"
        );

    });

}


/* =========================================================
   LOAD SAVED CHAT
========================================================= */

function restoreChat() {

    if (!chat) return;

    if (!history.length) {
        showWelcome();
        return;
    }

    chat.innerHTML = "";

    history.forEach(message => {

        if (
            message &&
            (message.role === "user" ||
             message.role === "assistant")
        ) {

            addMessage(
                message.content,
                message.role === "assistant"
                    ? "ai"
                    : "user"
            );

        }

    });

}


/* =========================================================
   SERVICE WORKER
========================================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {
                console.log("NOXGPT Service Worker ready.");
            })
            .catch(error => {
                console.warn(
                    "Service Worker error:",
                    error
                );
            });

    });

}


/* =========================================================
   START
========================================================= */

restoreChat();

autoResize();

console.log(
    "%cNOXGPT // CORE",
    "color:#ff3333;font-size:18px;font-weight:bold"
);
