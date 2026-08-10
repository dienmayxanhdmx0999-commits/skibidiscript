* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: Arial, sans-serif;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
}

.chat-box {
  width: 100%;
  max-width: 440px;
  height: 640px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

header {
  background: #0a0a0f;
  color: #fff;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand .logo {
  width: 28px;
  height: 28px;
}

.brand-text {
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 1px;
  color: #fff;
}

.brand-text span {
  color: #ff3333;
  text-shadow: 0 0 6px rgba(255,0,0,0.7);
}

#authArea { display: flex; align-items: center; }

.google-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 11px;
  cursor: pointer;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 3px 8px 3px 3px;
}

.user-chip img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}

.user-chip span {
  font-size: 12px;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-chip button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  opacity: 0.7;
}

#messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.msg {
  max-width: 78%;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: background 0.15s;
}

.msg .who {
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 2px;
  opacity: 0.7;
}

.msg .reply-quote {
  font-size: 11px;
  border-left: 3px solid #4a6cf7;
  padding: 2px 6px;
  margin-bottom: 4px;
  opacity: 0.7;
  background: rgba(0,0,0,0.04);
  border-radius: 4px;
}

.msg.me { align-self: flex-end; background: #d9e6ff; }
.msg.them { align-self: flex-start; background: #eee; }

.msg.pressed { background: #b9cdfb; }
.msg.them.pressed { background: #ddd; }

.thinkbox {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #f2eaff;
  font-size: 12px;
  color: #7c3aed;
}

.thinkbox .b {
  width: 5px; height: 5px; border-radius: 50%;
  background: #7c3aed;
  animation: bounce 1.1s infinite ease-in-out;
}
.thinkbox .b:nth-child(2){ animation-delay: 0.15s; }
.thinkbox .b:nth-child(3){ animation-delay: 0.3s; }
@keyframes bounce {
  0%,80%,100%{ transform: translateY(0); opacity: 0.5; }
  40%{ transform: translateY(-4px); opacity: 1; }
}

.seen-row {
  align-self: flex-end;
  font-size: 10px;
  color: #999;
  padding: 0 4px;
}

.reply-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f4f4f8;
  padding: 8px 12px;
  border-top: 1px solid #eee;
  font-size: 12px;
}

.reply-preview-text { overflow: hidden; }
.reply-preview-label { color: #4a6cf7; display: block; font-size: 11px; }
#replyToText {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #555;
}
.reply-preview button {
  background: none;
  border: none;
  font-size: 14px;
  color: #999;
  cursor: pointer;
}

.input-row {
  padding: 12px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-row input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.input-row input:focus { border-color: #4a6cf7; }

.msg-row { display: flex; gap: 8px; }
.msg-row input { flex: 1; }

.msg-row button {
  background: #4a6cf7;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0 18px;
  font-size: 14px;
  cursor: pointer;
}

.msg-action-menu {
  position: fixed;
  background: #222;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  z-index: 999;
}

.msg-action-menu button {
  display: block;
  width: 100%;
  background: none;
  border: none;
  color: #fff;
  padding: 10px 18px;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.msg-action-menu button:hover { background: #333; }
