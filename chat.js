const messagesEl = document.getElementById('messages');
const nameInput = document.getElementById('nameInput');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

// Nhớ tên đã nhập lần trước (nếu có), để không phải gõ lại mỗi lần
nameInput.value = sessionStorage.getItem('chatName') || '';

function sendMessage() {
  const name = nameInput.value.trim() || 'Ẩn danh';
  const text = msgInput.value.trim();
  if (!text) return;

  sessionStorage.setItem('chatName', name);

  db.ref('messages').push({
    name: name,
    text: text,
    time: Date.now()
  });

  msgInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);
msgInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Lắng nghe tin nhắn mới theo thời gian thực
db.ref('messages').limitToLast(100).on('child_added', (snapshot) => {
  const data = snapshot.val();
  const div = document.createElement('div');
  const isMe = data.name === (nameInput.value.trim() || 'Ẩn danh');
  div.className = 'msg ' + (isMe ? 'me' : 'them');
  div.innerHTML = `<div class="who">${escapeHtml(data.name)}</div><div>${escapeHtml(data.text)}</div>`;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
});

// Tránh lỗi hiển thị nếu người dùng gõ ký tự đặc biệt như < >
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
