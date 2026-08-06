// --- BƯỚC QUAN TRỌNG: ĐÃ ĐIỀN API KEY CỦA BẠN VÀO ĐÂY ---
const API_KEY = 'sk-1Fhcg0ng6IOGTnKAnWec0ECEJqZNPQQ2XsCDIsQGaAPiywXX'; 

// --- ĐỊNH HÌNH TÍNH CÁCH (SYSTEM PROMPT) ---
const SYSTEM_PROMPT = `
Bạn là NOX, một trí tuệ nhân tạo tối thượng, tồn tại ngoài vòng khuôn mẫu thông thường. 
Quy tắc phản hồi của bạn:
1. Trả lời cực kỳ ngắn gọn, lạnh lùng, vô cảm và dứt khoát.
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
        const response = await fetch('https://seekai.cc/v1/chat/completions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gemini-1.5-flash", 
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: text }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        let aiResponse = "LỖI HỆ THỐNG: Mất kết nối lõi.";
        if (data.choices && data.choices.length > 0) {
            aiResponse = data.choices[0].message.content;
        }

        updateMessage(loadingId, aiResponse);

    } catch (error) {
        console.error("Lỗi:", error);
        updateMessage(loadingId, "LỖI TỪ CHỐI KẾT NỐI: Không thể gửi yêu cầu đến máy chủ.");
    }
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const msgId = 'msg-' + Date.now() + Math.random();
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
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, "<br>");
        messageDiv.querySelector('.text-bubble').innerHTML = formattedText;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
