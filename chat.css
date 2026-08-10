<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

  <!-- Ép trình duyệt luôn tải bản mới, không dùng bản cache cũ -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">

  <!-- SEO -->
  <title>NOX CHAT - Nhắn tin trực tuyến miễn phí</title>
  <meta name="description" content="NOX CHAT - Phòng chat trực tuyến miễn phí, nhắn tin thời gian thực, đăng nhập bằng Google, gửi ảnh, trả lời và chia sẻ tin nhắn dễ dàng.">
  <meta name="keywords" content="nox chat, chat online, nhắn tin trực tuyến, chat miễn phí, phòng chat, nox gpt">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://dienmayxanhdmx0999-commits.github.io/skibidiscript/chat.html">

  <meta property="og:type" content="website">
  <meta property="og:title" content="NOX CHAT - Nhắn tin trực tuyến">
  <meta property="og:description" content="Phòng chat trực tuyến miễn phí, thời gian thực, đăng nhập bằng Google.">
  <meta property="og:image" content="https://dienmayxanhdmx0999-commits.github.io/skibidiscript/nox-logo.svg">
  <meta property="og:url" content="https://dienmayxanhdmx0999-commits.github.io/skibidiscript/chat.html">

  <link rel="icon" href="nox-logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="chat.css?v=2">
</head>
<body>

  <div class="chat-box">

    <header>
      <button id="menuBtn" class="icon-btn" aria-label="Menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <div class="brand">
        <img src="nox-logo.svg" alt="NOX CHAT" class="logo">
        <span class="brand-text">NOX<span>CHAT</span></span>
      </div>

      <div id="userChip" class="user-chip" style="display:none;">
        <img id="userAvatar" src="" alt="">
      </div>
    </header>

    <!-- Menu 3 gạch -->
    <div id="sideMenu" class="side-menu">
      <div class="side-menu-header">
        <span>Menu</span>
        <button id="closeMenuBtn">✕</button>
      </div>
      <a href="https://dienmayxanhdmx0999-commits.github.io/skibidiscript/ai.html" class="side-item">
        <span class="side-icon nox-icon">N</span> NOX GPT
      </a>
      <a href="https://discord.gg/4GHRxf86U" target="_blank" rel="noopener" class="side-item">
        <span class="side-icon discord-icon">D</span> Discord
      </a>
      <a href="https://zalo.me/g/db0epbye4robazncg2jc" target="_blank" rel="noopener" class="side-item">
        <span class="side-icon zalo-icon">Z</span> Zalo
      </a>
      <button id="logoutBtn" class="side-item side-logout">
        <span class="side-icon logout-icon">⎋</span> Đăng xuất
      </button>
    </div>
    <div id="menuOverlay" class="menu-overlay" style="display:none;"></div>

    <!-- Cổng đăng nhập bắt buộc -->
    <div id="loginGate" class="login-gate">
      <img src="nox-logo.svg" class="gate-logo" alt="NOX CHAT">
      <h2>NOX CHAT</h2>
      <p>Đăng nhập để bắt đầu trò chuyện</p>
      <button id="loginBtn" class="google-btn">
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.2 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.2 29.5 4 24 4c-7.4 0-13.8 4.1-17.1 10.1z"/><path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.5 5C9.9 39.6 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.4-6.3 6.9l6.4 5.4C39.4 37.5 44 31.4 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
        Đăng nhập bằng Google
      </button>
      <p id="loginError" class="login-error"></p>
    </div>

    <!-- Nội dung chat (ẩn cho tới khi đăng nhập) -->
    <div id="chatArea" class="chat-area" style="display:none;">
      <div id="messages"></div>

      <div id="warnBox" class="warn-box" style="display:none;"></div>

      <div id="replyPreview" class="reply-preview" style="display:none;">
        <div class="reply-preview-text">
          <span class="reply-preview-label">Trả lời <b id="replyToName"></b></span>
          <span id="replyToText"></span>
        </div>
        <button id="cancelReply">✕</button>
      </div>

      <div class="input-row">
        <div class="msg-row">
          <button id="imgBtn" class="icon-btn" title="Gửi ảnh">📷</button>
          <input id="fileInput" type="file" accept="image/*" style="display:none;">
          <button id="emojiBtn" class="icon-btn" title="Emoji">😊</button>
          <input id="msgInput" placeholder="Nhập tin nhắn..." maxlength="500">
          <button id="sendBtn">Gửi</button>
        </div>
        <div id="emojiPicker" class="emoji-picker" style="display:none;"></div>
      </div>
    </div>
  </div>

  <div id="msgActionMenu" class="msg-action-menu" style="display:none;">
    <button data-action="reply">↩ Trả lời</button>
    <button data-action="copy">⧉ Sao chép</button>
    <button data-action="share">↗ Chia sẻ</button>
  </div>

  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
  <script src="firebase.config.js"></script>
  <script src="chat.js?v=2"></script>

</body>
</html>
