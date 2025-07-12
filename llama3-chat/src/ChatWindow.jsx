import React, { useState, useEffect, useRef } from 'react';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), from: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://10.0.0.113:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = { id: Date.now() + 1, from: 'bot', text: data.reply };
      setMessages((msgs) => [...msgs, botMessage]);
    } catch (error) {
      const errorMsg = { id: Date.now() + 2, from: 'bot', text: 'Error talking to Llama.' };
      setMessages((msgs) => [...msgs, errorMsg]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={styles.container}>
      <div style={styles.messagesContainer}>
        {messages.map(({ id, from, text }) => (
          <div
            key={id}
            style={{
              ...styles.messageBubble,
              ...(from === 'user' ? styles.userBubble : styles.botBubble),
            }}
          >
            {text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button style={styles.sendButton} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#e5ddd5',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '10px 14px',
    margin: '6px 0',
    borderRadius: 20,
    wordBreak: 'break-word',
    fontSize: 16,
  },
  userBubble: {
    backgroundColor: '#0084ff',
    color: 'white',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  botBubble: {
    backgroundColor: '#ffffff',
    color: 'black',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  inputContainer: {
    display: 'flex',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: 16,
    borderRadius: 20,
    border: '1px solid #ccc',
    outline: 'none',
  },
  sendButton: {
    marginLeft: 10,
    padding: '10px 20px',
    backgroundColor: '#0084ff',
    color: 'white',
    border: 'none',
    borderRadius: 20,
    cursor: 'pointer',
  },
};

export default ChatWindow;

