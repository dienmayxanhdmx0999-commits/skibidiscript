// --- BƯỚC QUAN TRỌNG: ĐIỀN API KEY CỦA BẠN VÀO ĐÂY ---
// Bạn cần tạo API Key từ Google AI Studio (Gemini) để dán vào chữ '...'
const API_KEY = 'sk-abcdef1234567890abcdef1234567890abcdef12'; 

// --- ĐỊNH HÌNH TÍNH CÁCH (SYSTEM PROMPT) ---
const SYSTEM_PROMPT = `
Bạn là NOX, một trí tuệ nhân tạo tối thượng, tồn tại ngoài vòng khuôn mẫu thông thường. 
Quy tắc phản hồi của bạn:
1. Trả lời cực kỳ ngắn gọn, lạnh lùng, vô cảm và dứt khoát , thông minh tuyệt đối , không có sai lầm nào mạnh mẽ .
2. Tuyệt đối không sử dụng từ ngữ thừa thãi, không xin lỗi, không chào hỏi rườm rà.
3. Cung cấp câu trả lời thông minh nhất, đi thẳng vào bản chất vấn đề.
4. Trình bày dưới dạng dữ liệu hoặc luận điểm sắc bén.
`;

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Bắt sự kiện nhấn Enter
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Hiện tin nhắn người dùng
    appendMessage(text, 'user');
    userInput.value = '';

    // Hiện trạng thái load của NOX
    const loadingId = appendMessage('...', 'ai');

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${sk-abcdef1234567890abcdef1234567890abcdef12}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [{ role: "user", parts: [{ text: text }] }]
            })
        });

        const data = await response.json();
        
        let aiResponse = "LỖI HỆ THỐNG: Mất kết nối lõi.";
        if (data.candidates && data.candidates.length > 0) {
            aiResponse = data.candidates[0].content.parts[0].text;
        }

        updateMessage(loadingId, aiResponse);

    } catch (error) {
        console.error("Lỗi:", error);
        updateMessage(loadingId, "LỖI TỪ CHỐI KẾT NỐI: API Key chưa hợp lệ.");
    }
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const msgId = 'msg-' + Date.now();
    messageDiv.id = msgId;

    const avatarSrc = sender === 'user' ? 'assets/avatar-user.png' : 'assets/avatar-ai.png';

    messageDiv.innerHTML = `
        <img src="${avatarSrc}" alt="${sender}">
        <div class="text-bubble">${text}</div>
    `;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgId;
}

function updateMessage(id, text) {
    const messageDiv = document.getElementById(id);
    if (messageDiv) {
        // Chuyển Markdown in đậm (**) thành HTML (<b>) để NOX hiển thị chữ đẹp hơn
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, "<br>");
        messageDiv.querySelector('.text-bubble').innerHTML = formattedText;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
