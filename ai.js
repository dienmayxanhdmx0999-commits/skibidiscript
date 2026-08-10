/* =========================================================
   NOXGPT // ai.js
   Gemini client
   ========================================================= */

"use strict";

/* =========================================================
   CONFIG
========================================================= */

const NOX_CONFIG = {
    API_KEY: "YOUR_GEMINI_API_KEY",

    MODEL: "gemini-2.5-flash",

    API_URL:
        "https://generativelanguage.googleapis.com/v1beta/models/",

    MAX_HISTORY: 40,

    TEMPERATURE: 0.7,

    MAX_OUTPUT_TOKENS: 4096
};

/* =========================================================
   DOM
========================================================= */

const chat =
    document.getElementById("chat");

const prompt =
    document.getElementById("prompt");

const thinking =
    document.getElementById("thinking");

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("overlay");

const menuBtn =
    document.getElementById("menuBtn");

const newChat =
    document.getElementById("newChat");

const clearBtn =
    document.getElementById("clearBtn");

const sendBtn =
    document.getElementById("send");

const attachBtn =
    document.getElementById("attach");

/* =========================================================
   STATE
========================================================= */

let history = [];

let controller = null;

let generating = false;

let currentConversation = [];

let uploadedFiles = [];

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY =
    "NOXGPT_HISTORY";

const SETTINGS_KEY =
    "NOXGPT_SETTINGS";

/* =========================================================
   LOAD
========================================================= */

function loadHistory() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) return;

        const parsed =
            JSON.parse(saved);

        if (Array.isArray(parsed)) {

            history = parsed;

        }

    } catch (error) {

        console.warn(
            "Không thể tải lịch sử:",
            error
        );

        history = [];

    }

}

/* =========================================================
   SAVE
========================================================= */

function saveHistory() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(history)
        );

    } catch (error) {

        console.warn(
            "Không thể lưu lịch sử:",
            error
        );

    }

}

/* =========================================================
   LIMIT HISTORY
========================================================= */

function limitHistory() {

    if (
        history.length >
        NOX_CONFIG.MAX_HISTORY
    ) {

        history =
            history.slice(
                -NOX_CONFIG.MAX_HISTORY
            );

    }

}

/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text);

    return div.innerHTML;

}

/* =========================================================
   MARKDOWN
========================================================= */

function renderMarkdown(text) {

    if (
        typeof marked !== "undefined"
    ) {

        try {

            return marked.parse(
                String(text)
            );

        } catch {

            return escapeHTML(text);

        }

    }

    return escapeHTML(text)
        .replace(/\n/g, "<br>");

}

/* =========================================================
   HIGHLIGHT
========================================================= */

function highlightCode(container) {

    if (
        typeof hljs === "undefined"
    ) {

        return;

    }

    container
        .querySelectorAll(
            "pre code"
        )
        .forEach(code => {

            try {

                hljs.highlightElement(
                    code
                );

            } catch {}

        });

}

/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(
    text,
    type,
    options = {}
) {

    if (!chat) return null;

    document
        .querySelector(".welcome")
        ?.remove();

    const wrapper =
        document.createElement("div");

    wrapper.className =
        `message ${type}`;

    wrapper.dataset.type =
        type;

    const content =
        document.createElement("div");

    content.className =
        "message-content";

    if (type === "ai") {

        content.innerHTML =
            renderMarkdown(text);

        highlightCode(
            content
        );

    } else {

        content.textContent =
            text;

    }

    wrapper.appendChild(
        content
    );

    if (
        options.actions !== false
    ) {

        const actions =
            createMessageActions(
                text,
                type
            );

        wrapper.appendChild(
            actions
        );

    }

    chat.appendChild(
        wrapper
    );

    scrollToBottom();

    return wrapper;

}

/* =========================================================
   MESSAGE ACTIONS
========================================================= */

function createMessageActions(
    text,
    type
) {

    const actions =
        document.createElement("div");

    actions.className =
        "message-actions";

    const copy =
        createActionButton(
            "Copy"
        );

    copy.onclick =
        () => copyText(text);

    actions.appendChild(
        copy
    );

    if (type === "ai") {

        const regenerate =
            createActionButton(
                "Regenerate"
            );

        regenerate.onclick =
            regenerateLastResponse;

        actions.appendChild(
            regenerate
        );

    }

    return actions;

}

/* =========================================================
   ACTION BUTTON
========================================================= */

function createActionButton(
    label
) {

    const button =
        document.createElement(
            "button"
        );

    button.className =
        "message-action";

    button.type =
        "button";

    button.textContent =
        label;

    return button;

}

/* =========================================================
   COPY
========================================================= */

async function copyText(text) {

    try {

        await navigator
            .clipboard
            .writeText(text);

        showToast(
            "Đã sao chép."
        );

    } catch {

        const area =
            document.createElement(
                "textarea"
            );

        area.value =
            text;

        document.body.appendChild(
            area
        );

        area.select();

        document.execCommand(
            "copy"
        );

        area.remove();

        showToast(
            "Đã sao chép."
        );

    }

}

/* =========================================================
   SCROLL
========================================================= */

function scrollToBottom() {

    if (!chat) return;

    requestAnimationFrame(
        () => {

            chat.scrollTop =
                chat.scrollHeight;

        }
    );

}

/* =========================================================
   THINKING
========================================================= */

function setThinking(
    value
) {

    generating =
        Boolean(value);

    if (!thinking) return;

    thinking.classList.toggle(
        "hidden",
        !generating
    );

}

/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {

    sidebar?.classList.add(
        "show"
    );

    overlay?.classList.add(
        "show"
    );

}

function closeSidebar() {

    sidebar?.classList.remove(
        "show"
    );

    overlay?.classList.remove(
        "show"
    );

}

menuBtn?.addEventListener(
    "click",
    openSidebar
);

overlay?.addEventListener(
    "click",
    closeSidebar
);

/* =========================================================
   NEW CHAT
========================================================= */

function startNewChat() {

    if (generating) {

        stopGeneration();

    }

    history = [];

    currentConversation = [];

    uploadedFiles = [];

    saveHistory();

    if (chat) {

        chat.innerHTML = `
            <div class="welcome">
                <div class="welcome-logo-wrap">
                    <img
                        class="welcome-logo"
                        src="assets/logo.svg"
                        alt="NOXGPT"
                    >
                </div>

                <h2>NOXGPT</h2>

                <p>
                    Xin chào, tôi có thể giúp gì cho bạn?
                </p>
            </div>
        `;

    }

    if (prompt) {

        prompt.value = "";

        autoResize();

    }

    closeSidebar();

}

/* =========================================================
   CLEAR CHAT
========================================================= */

function clearChat() {

    history = [];

    currentConversation = [];

    saveHistory();

    if (chat) {

        chat.innerHTML = "";

    }

    closeSidebar();

    showToast(
        "Đã xóa cuộc trò chuyện."
    );

}

/* =========================================================
   STOP
========================================================= */

function stopGeneration() {

    if (controller) {

        try {

            controller.abort();

        } catch {}

        controller = null;

    }

    setThinking(false);

    showToast(
        "Đã dừng tạo câu trả lời."
    );

}

/* =========================================================
   BUILD GEMINI CONTENT
========================================================= */

function buildContents() {

    return history.map(
        item => {

            return {

                role:
                    item.role ===
                    "assistant"
                        ? "model"
                        : "user",

                parts: [
                    {
                        text:
                            item.content
                    }
                ]

            };

        }
    );

}

/* =========================================================
   GEMINI REQUEST
========================================================= */

async function requestGemini() {

    if (
        !NOX_CONFIG.API_KEY ||
        NOX_CONFIG.API_KEY ===
            "YOUR_GEMINI_API_KEY"
    ) {

        throw new Error(
            "Chưa cấu hình Gemini API key."
        );

    }

    controller =
        new AbortController();

    const url =
        NOX_CONFIG.API_URL +
        encodeURIComponent(
            NOX_CONFIG.MODEL
        ) +
        ":generateContent?key=" +
        encodeURIComponent(
            NOX_CONFIG.API_KEY
        );

    const body = {

        contents:
            buildContents(),

        generationConfig: {

            temperature:
                NOX_CONFIG.TEMPERATURE,

            maxOutputTokens:
                NOX_CONFIG.MAX_OUTPUT_TOKENS

        }

    };

    const response =
        await fetch(
            url,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        body
                    ),

                signal:
                    controller.signal

            }
        );

    if (!response.ok) {

        let errorText =
            "Gemini API error.";

        try {

            const errorData =
                await response.json();

            errorText =
                errorData?.error?.message ||
                errorText;

        } catch {}

        throw new Error(
            errorText
        );

    }

    return response.json();

}

/* =========================================================
   EXTRACT RESPONSE
========================================================= */

function extractGeminiText(
    data
) {

    const candidates =
        data?.candidates;

    if (
        !Array.isArray(candidates) ||
        !candidates.length
    ) {

        return "";

    }

    const parts =
        candidates[0]
            ?.content
            ?.parts;

    if (
        !Array.isArray(parts)
    ) {

        return "";

    }

    return parts
        .map(
            part =>
                part?.text || ""
        )
        .join("");

}

/* =========================================================
   SEND MESSAGE
========================================================= */

async function sendMessage() {

    if (generating) return;

    if (!prompt) return;

    const text =
        prompt.value.trim();

    if (!text) return;

    addMessage(
        text,
        "user"
    );

    history.push({

        role: "user",

        content: text

    });

    limitHistory();

    saveHistory();

    prompt.value = "";

    autoResize();

    setThinking(true);

    try {

        const data =
            await requestGemini();

        const reply =
            extractGeminiText(
                data
            );

        if (!reply) {

            throw new Error(
                "Gemini không trả về nội dung."
            );

        }

        history.push({

            role:
                "assistant",

            content:
                reply

        });

        limitHistory();

        saveHistory();

        setThinking(false);

        addMessage(
            reply,
            "ai"
        );

    } catch (error) {

        setThinking(false);

        if (
            error?.name ===
            "AbortError"
        ) {

            return;

        }

        addMessage(
            "Lỗi: " +
            (
                error?.message ||
                "Không thể kết nối Gemini."
            ),
            "ai"
        );

    } finally {

        controller =
            null;

        setThinking(false);

    }

}

/* =========================================================
   REGENERATE
========================================================= */

async function regenerateLastResponse() {

    if (generating) return;

    if (
        history.length === 0
    ) {

        return;

    }

    const last =
        history[
            history.length - 1
        ];

    if (
        last.role ===
        "assistant"
    ) {

        history.pop();

    }

    const lastUser =
        history[
            history.length - 1
        ];

    if (
        !lastUser ||
        lastUser.role !==
            "user"
    ) {

        return;

    }

    if (chat) {

        const messages =
            chat.querySelectorAll(
                ".message.ai"
            );

        if (messages.length) {

            messages[
                messages.length - 1
            ].remove();

        }

    }

    saveHistory();

    setThinking(true);

    try {

        const data =
            await requestGemini();

        const reply =
            extractGeminiText(
                data
            );

        if (!reply) {

            throw new Error(
                "Không có phản hồi."
            );

        }

        history.push({

            role: "assistant",

            content: reply

        });

        saveHistory();

        addMessage(
            reply,
            "ai"
        );

    } catch (error) {

        if (
            error?.name !==
            "AbortError"
        ) {

            addMessage(
                error.message ||
                    "Không thể tạo lại.",
                "ai"
            );

        }

    } finally {

        setThinking(false);

        controller = null;

    }

}

/* =========================================================
   EDIT LAST USER
========================================================= */

function editLastUser() {

    for (
        let i =
            history.length - 1;
        i >= 0;
        i--
    ) {

        if (
            history[i].role ===
            "user"
        ) {

            if (prompt) {

                prompt.value =
                    history[i].content;

                autoResize();

                prompt.focus();

            }

            return;

        }

    }

}

/* =========================================================
   AUTO RESIZE
========================================================= */

function autoResize() {

    if (!prompt) return;

    prompt.style.height =
        "auto";

    prompt.style.height =
        Math.min(
            prompt.scrollHeight,
            170
        ) + "px";

}

/* =========================================================
   ENTER
========================================================= */

prompt?.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
                "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);

/* =========================================================
   INPUT
========================================================= */

prompt?.addEventListener(
    "input",
    autoResize
);

/* =========================================================
   SEND BUTTON
========================================================= */

sendBtn?.addEventListener(
    "click",
    sendMessage
);

/* =========================================================
   NEW CHAT BUTTON
========================================================= */

newChat?.addEventListener(
    "click",
    startNewChat
);

/* =========================================================
   CLEAR BUTTON
========================================================= */

clearBtn?.addEventListener(
    "click",
    clearChat
);

/* =========================================================
   ATTACHMENT
========================================================= */

attachBtn?.addEventListener(
    "click",
    () => {

        showToast(
            "Chức năng file đang được chuẩn bị."
        );

    }
);

/* =========================================================
   TOAST
========================================================= */

function showToast(
    message
) {

    let container =
        document.querySelector(
            ".toast-container"
        );

    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.className =
            "toast-container";

        document.body.appendChild(
            container
        );

    }

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        "toast";

    toast.textContent =
        message;

    container.appendChild(
        toast
    );

    setTimeout(
        () => {

            toast.remove();

        },
        2500
    );

}

/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            if (generating) {

                stopGeneration();

                return;

            }

            closeSidebar();

        }

        if (
            (event.ctrlKey ||
                event.metaKey) &&
            event.key === "Enter"
        ) {

            sendMessage();

        }

    }
);

/* =========================================================
   LOAD SAVED CHAT
========================================================= */

function restoreChat() {

    loadHistory();

    if (
        !history.length
    ) {

        return;

    }

    document
        .querySelector(
            ".welcome"
        )
        ?.remove();

    history.forEach(
        item => {

            addMessage(
                item.content,
                item.role ===
                    "assistant"
                    ? "ai"
                    : "user",
                {
                    actions:
                        true
                }
            );

        }
    );

}

/* =========================================================
   SERVICE WORKER
========================================================= */

if (
    "serviceWorker" in
    navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./sw.js"
                )
                .catch(
                    error => {

                        console.warn(
                            "Service worker:",
                            error
                        );

                    }
                );

        }
    );

}

/* =========================================================
   STARTUP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        restoreChat();

        autoResize();

    }
);

/* =========================================================
   GLOBAL API
========================================================= */

window.NOXGPT = {

    sendMessage,

    stopGeneration,

    startNewChat,

    clearChat,

    regenerateLastResponse,

    editLastUser,

    copyText,

    showToast

};

/* =========================================================
   END
========================================================= */
