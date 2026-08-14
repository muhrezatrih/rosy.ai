/**
 * Invest Buddy — Frontend Client Script
 * Integrates chat interface with Express Gemini AI backend
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const form = document.getElementById('chat-form');
  const input = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  const fileInput = document.getElementById('file-input');
  const attachBtn = document.getElementById('attach-btn');
  const attachmentTray = document.getElementById('attachment-tray');
  const attachmentName = document.getElementById('attachment-name');
  const attachmentSize = document.getElementById('attachment-size');
  const attachmentImgPreview = document.getElementById('attachment-img-preview');
  const attachmentIcon = document.getElementById('attachment-icon');
  const removeAttachmentBtn = document.getElementById('remove-attachment-btn');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  const sendBtn = document.getElementById('send-btn');
  const quickPromptChips = document.querySelectorAll('.prompt-chip');

  let currentFile = null;
  let isGenerating = false;

  // Initialize Health Check
  checkBackendHealth();
  setInterval(checkBackendHealth, 30000); // Check every 30s

  // Event Listeners
  form.addEventListener('submit', handleFormSubmit);

  // Auto-grow textarea and Enter-to-send
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && (input.value.trim() || currentFile)) {
        form.requestSubmit();
      }
    }
  });

  // Attach File Button
  attachBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelected(file);
    }
  });

  // Drag and Drop files onto chat container
  const dropZone = document.querySelector('.chat-container');
  ['dragenter', 'dragover'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.outline = '2px dashed var(--accent-primary)';
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.outline = 'none';
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
  });

  // Remove Attachment
  removeAttachmentBtn.addEventListener('click', clearAttachment);

  // Clear Chat History
  clearChatBtn.addEventListener('click', () => {
    if (confirm('Clear all conversation messages?')) {
      const messages = chatBox.querySelectorAll('.message:not(.intro-message)');
      messages.forEach((msg) => msg.remove());
      const quickPrompts = document.getElementById('quick-prompts');
      if (quickPrompts) quickPrompts.classList.remove('hidden');
    }
  });

  // Quick Prompt Chips
  quickPromptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt && !isGenerating) {
        input.value = prompt;
        input.style.height = 'auto';
        input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
        form.requestSubmit();
      }
    });
  });

  // File Handling
  function handleFileSelected(file) {
    // 50MB check (matching server config)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds the 50MB limit.');
      return;
    }

    currentFile = file;
    attachmentName.textContent = file.name;
    attachmentSize.textContent = formatBytes(file.size);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        attachmentImgPreview.src = e.target.result;
        attachmentImgPreview.classList.remove('hidden');
        attachmentIcon.classList.add('hidden');
      };
      reader.readAsDataURL(file);
    } else {
      attachmentImgPreview.classList.add('hidden');
      attachmentIcon.classList.remove('hidden');
    }

    attachmentTray.classList.remove('hidden');
    attachBtn.classList.add('has-file');
    input.focus();
  }

  function clearAttachment() {
    currentFile = null;
    fileInput.value = '';
    attachmentTray.classList.add('hidden');
    attachmentImgPreview.src = '';
    attachmentImgPreview.classList.add('hidden');
    attachmentIcon.classList.remove('hidden');
    attachBtn.classList.remove('has-file');
  }

  // Backend Health Check
  async function checkBackendHealth() {
    try {
      const res = await fetch('/health');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok') {
          statusIndicator.className = 'status-badge online';
          statusText.textContent = 'AI Ready';
          return;
        }
      }
      throw new Error('Health check failed');
    } catch {
      statusIndicator.className = 'status-badge offline';
      statusText.textContent = 'Offline';
    }
  }

  // Form Submit Handler
  async function handleFormSubmit(e) {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage && !currentFile) return;
    if (isGenerating) return;

    // Hide quick prompts once user starts chatting
    const quickPrompts = document.getElementById('quick-prompts');
    if (quickPrompts) quickPrompts.classList.add('hidden');

    const fileToSend = currentFile;
    const promptToSend = userMessage;

    // Append user message bubble with optional media preview
    appendUserMessage(promptToSend, fileToSend);

    // Reset inputs
    input.value = '';
    input.style.height = 'auto';
    clearAttachment();

    // Show loading state
    setLoadingState(true);
    const typingIndicator = appendTypingIndicator();

    try {
      let resultText = '';

      if (fileToSend) {
        const formData = new FormData();
        if (promptToSend) {
          formData.append('prompt', promptToSend);
        }

        if (fileToSend.type.startsWith('image/')) {
          formData.append('image', fileToSend);
          const response = await fetch('/generate-from-image', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          if (!response.ok || !data.success) {
            throw new Error(data?.error?.message || data?.message || 'Failed to process image');
          }
          resultText = data.result;
        } else {
          formData.append('document', fileToSend);
          const response = await fetch('/generate-from-document', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          if (!response.ok || !data.success) {
            throw new Error(data?.error?.message || data?.message || 'Failed to process document');
          }
          resultText = data.result;
        }
      } else {
        const response = await fetch('/generate-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptToSend }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data?.error?.message || 'Failed to generate AI response');
        }
        resultText = data.result;
      }

      // Remove typing indicator and show response
      typingIndicator.remove();
      appendBotMessage(resultText, data.escalation);
    } catch (err) {
      typingIndicator.remove();
      appendErrorMessage(err.message || 'An unexpected error occurred while communicating with the server.');
    } finally {
      setLoadingState(false);
    }
  }

  // UI Message Append Helpers
  function appendUserMessage(text, file) {
    const msg = document.createElement('div');
    msg.classList.add('message', 'user');

    const body = document.createElement('div');
    body.classList.add('message-body');

    const sender = document.createElement('div');
    sender.classList.add('message-sender');
    sender.textContent = 'Penyewa / Anda';
    body.appendChild(sender);

    // If file was attached
    if (file) {
      if (file.type.startsWith('image/')) {
        const imgThumb = document.createElement('img');
        imgThumb.classList.add('message-attachment-thumb');
        imgThumb.alt = file.name;
        const reader = new FileReader();
        reader.onload = (e) => { imgThumb.src = e.target.result; };
        reader.readAsDataURL(file);
        body.appendChild(imgThumb);
      } else {
        const fileCard = document.createElement('div');
        fileCard.classList.add('message-attachment-card');
        fileCard.innerHTML = `📄 <strong>${escapeHtml(file.name)}</strong> (${formatBytes(file.size)})`;
        body.appendChild(fileCard);
      }
    }

    if (text) {
      const content = document.createElement('div');
      content.classList.add('message-content');
      content.textContent = text;
      body.appendChild(content);
    }

    const time = document.createElement('div');
    time.classList.add('message-time');
    time.textContent = getCurrentTimeString();
    body.appendChild(time);

    msg.appendChild(body);
    chatBox.appendChild(msg);
    scrollToBottom();
  }

  function appendBotMessage(markdownText, escalation) {
    const msg = document.createElement('div');
    msg.classList.add('message', 'bot');

    const avatar = document.createElement('div');
    avatar.classList.add('message-avatar');
    avatar.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>`;

    const body = document.createElement('div');
    body.classList.add('message-body');

    const sender = document.createElement('div');
    sender.classList.add('message-sender');
    sender.textContent = 'Rosy (AI Assistant)';

    const content = document.createElement('div');
    content.classList.add('message-content');
    content.innerHTML = renderMarkdown(markdownText);

    // If escalation required, render interactive WhatsApp card
    if (escalation && escalation.required) {
      const escCard = document.createElement('div');
      escCard.style.marginTop = '12px';
      escCard.style.padding = '12px';
      escCard.style.borderRadius = '10px';
      escCard.style.background = '#fff8e6';
      escCard.style.border = '1px solid #ffd591';
      escCard.innerHTML = `
        <div style="font-weight: bold; color: #ad4e00; margin-bottom: 6px; font-size: 13px;">🚨 Perlu Rembuk Langsung Sama Ibu Ros</div>
        <p style="font-size: 12px; color: #595959; margin-bottom: 8px;">Keputusan ini perlu persetujuan langsung dari Ibu Ros.</p>
        <a href="${escalation.whatsappUrl || 'https://wa.me/6281266641431'}" target="_blank" style="display: inline-block; padding: 6px 14px; background: #25D366; color: white; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: bold;">
          💬 Chat WhatsApp Ibu Ros (+6281266641431)
        </a>
      `;
      content.appendChild(escCard);
    }

    const time = document.createElement('div');
    time.classList.add('message-time');
    time.textContent = getCurrentTimeString();

    // Copy Button Action
    const actions = document.createElement('div');
    actions.classList.add('message-actions');
    const copyBtn = document.createElement('button');
    copyBtn.classList.add('copy-btn');
    copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Salin`;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(markdownText).then(() => {
        copyBtn.innerHTML = `✓ Tersalin!`;
        setTimeout(() => {
          copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Salin`;
        }, 2000);
      });
    });
    actions.appendChild(copyBtn);

    body.appendChild(sender);
    body.appendChild(content);
    body.appendChild(actions);
    body.appendChild(time);

    msg.appendChild(avatar);
    msg.appendChild(body);
    chatBox.appendChild(msg);
    scrollToBottom();
  }


  function appendErrorMessage(errorText) {
    const msg = document.createElement('div');
    msg.classList.add('message', 'bot');

    const avatar = document.createElement('div');
    avatar.classList.add('message-avatar');
    avatar.style.borderColor = 'var(--danger)';
    avatar.style.color = 'var(--danger)';
    avatar.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    const body = document.createElement('div');
    body.classList.add('message-body');

    const content = document.createElement('div');
    content.classList.add('message-content');
    content.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    content.innerHTML = `<p style="color: #fca5a5;"><strong>Error:</strong> ${escapeHtml(errorText)}</p>`;

    body.appendChild(content);
    msg.appendChild(avatar);
    msg.appendChild(body);
    chatBox.appendChild(msg);
    scrollToBottom();
  }

  function appendTypingIndicator() {
    const msg = document.createElement('div');
    msg.classList.add('message', 'bot', 'typing-message');

    const avatar = document.createElement('div');
    avatar.classList.add('message-avatar');
    avatar.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>`;

    const body = document.createElement('div');
    body.classList.add('message-body');

    const typing = document.createElement('div');
    typing.classList.add('typing-indicator');
    typing.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;

    body.appendChild(typing);
    msg.appendChild(avatar);
    msg.appendChild(body);
    chatBox.appendChild(msg);
    scrollToBottom();

    return msg;
  }

  function setLoadingState(loading) {
    isGenerating = loading;
    sendBtn.disabled = loading;
    if (loading) {
      sendBtn.querySelector('.send-text').textContent = 'Thinking...';
    } else {
      sendBtn.querySelector('.send-text').textContent = 'Send';
      input.focus();
    }
  }

  function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Utilities
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function getCurrentTimeString() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Simple, Safe Markdown Renderer
  function renderMarkdown(text) {
    if (!text) return '';

    let html = escapeHtml(text);

    // Code blocks ```lang\ncode\n```
    html = html.replace(/```([\s\S]*?)```/g, (_match, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>');

    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Lists
    // Unordered lists
    html = html.replace(/(?:^|\n)- (.+)(?=\n|$)/g, '\n<ul><li>$1</li></ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, ''); // merge consecutive lists

    // Numbered lists
    html = html.replace(/(?:^|\n)\d+\. (.+)(?=\n|$)/g, '\n<ol><li>$1</li></ol>');
    html = html.replace(/<\/ol>\s*<ol>/g, ''); // merge consecutive lists

    // Line breaks to paragraphs
    const paragraphs = html.split(/\n{2,}/);
    html = paragraphs.map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h2>') || p.startsWith('<h3>') || p.startsWith('<pre>') || p.startsWith('<ul>') || p.startsWith('<ol>') || p.startsWith('<blockquote>')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('');

    return html;
  }
});
