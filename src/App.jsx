import { useState, useEffect } from 'react';
import './App.css';

export default function SorayaChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mood, setMood] = useState(null);

  useEffect(() => {
    // Show daily check-in prompt on load
    setMessages([
      { sender: 'soraya', text: '💛 Happy    😐 Okay    😔 Sad    😵‍💫 Overwhelmed' }
    ]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('https://278e9317-0402-4acb-9e04-7ac09cde900e-00-2hnd8ngkm1a05.kirk.replit.dev/api/message', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'soraya', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'soraya', text: "I'm having trouble thinking right now, but I’m still with you." }]);
      console.error('Backend error:', error);
    }
  };

  const handleMoodClick = (emoji, label) => {
    setMood(label);
        setMessages([...messages, { sender: 'user', text: `${emoji} ${label}` }, { sender: 'soraya', text: `Thank you for checking in. I'm here if you want to talk about your day.` }]);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col items-center justify-center p-4 font-[Barlow]">
      <div className="bg-[#2a2a2a] rounded-2xl shadow-lg max-w-xl w-full p-6">
        <div className="flex items-center mb-6 animate-fadeInUp">
          <img
            src="/soraya2.png"
            alt="Soraya avatar"
            className="w-16 h-16 rounded-full object-cover shadow-md animate-float border-2 border-yellow-400"
          />
          <h1 className="ml-4 text-3xl font-semibold text-yellow-400">Soraya</h1>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
              <p className={`inline-block px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-yellow-500 text-black' : 'bg-rose-500 text-white'}`}>{msg.text}</p>
            </div>
          ))}
        </div>

        {!mood && (
          <div className="flex justify-center space-x-4 mb-4">
            <button onClick={() => handleMoodClick('💛', 'Happy')} className="text-2xl">💛</button>
            <button onClick={() => handleMoodClick('😐', 'Okay')} className="text-2xl">😐</button>
            <button onClick={() => handleMoodClick('😔', 'Sad')} className="text-2xl">😔</button>
            <button onClick={() => handleMoodClick('😵‍💫', 'Overwhelmed')} className="text-2xl">😵‍💫</button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your feeling…"
            className="flex-1 p-2 rounded-lg text-black"
          />
          <button onClick={handleSend} className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">Send</button>
        </div>



        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setMood(null);
              setMessages([{ sender: 'soraya', text: '💛 Happy    😐 Okay    😔 Sad    😵‍💫 Overwhelmed' }]);
            }}
            className="text-sm text-yellow-300 underline hover:text-yellow-400"
          >
            Reset Check-in
          </button>
        </div>
      </div>
    </div>
  );
}
