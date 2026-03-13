<<<<<<< HEAD
'use client';

import { useState } from 'react';

export default function AIChatPanel({ isOpen, onClose, weatherData }) {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI weather advisor. Ask me anything about the weather!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const generateResponse = (msg) => {
    const message = msg.toLowerCase();
    let response = '';

    if (message.includes('temperature') || message.includes('temp') || message.includes('hot') || message.includes('cold')) {
      if (weatherData) {
        const temp = Math.round(weatherData.main.temp);
        response = `The current temperature is ${temp}°C. ${temp > 25 ? "It's quite warm!" : temp < 10 ? "It's cold outside!" : "The temperature is pleasant."}`;
      } else {
        response = 'Please search for a city first to get temperature information.';
      }
    } else if (message.includes('rain') || message.includes('rainy')) {
      if (weatherData && weatherData.weather[0].main.toLowerCase().includes('rain')) {
        response = "Yes, it's currently raining. Don't forget your umbrella! 🌧️";
      } else {
        response = 'No rain in the forecast for the current location. Enjoy the dry weather!';
      }
    } else if (message.includes('wear') || message.includes('clothes') || message.includes('dress')) {
      if (weatherData) {
        const temp = weatherData.main.temp;
        if (temp < 10) response = 'Wear warm layers, a coat, and consider gloves if going outside.';
        else if (temp < 20) response = 'A light jacket or sweater would be perfect.';
        else response = 'Wear light, breathable clothing and don\'t forget sunscreen if it\'s sunny!';
      } else {
        response = 'Search for a city first and I\'ll give you dressing recommendations!';
      }
    } else if (message.includes('umbrella')) {
      if (weatherData && weatherData.weather[0].main.toLowerCase().includes('rain')) {
        response = 'Yes, definitely bring an umbrella! It\'s raining 🌧️';
      } else {
        response = 'No umbrella needed for now, but it\'s always good to check the forecast!';
      }
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      response = 'Hello! I\'m your AI weather advisor. Ask me about the weather, what to wear, or any weather-related questions!';
    } else if (message.includes('thank')) {
      response = 'You\'re welcome! Feel free to ask more weather questions 😊';
    } else {
      response = 'I\'m here to help with weather-related questions! Try asking about temperature, rain, what to wear, or umbrella advice.';
    }

    return response;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    
    // Generate and add bot response
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={`chat-panel ${isOpen ? 'active' : ''}`}>
      <div className="chat-header">
        <i className="fas fa-robot"></i>
        <span>AI Weather Advisor</span>
        <button className="chat-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div className={`chat-message ${msg.sender}`} key={index}>
            <i className={`fas ${msg.sender === 'bot' ? 'fa-robot' : 'fa-user'}`}></i>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about weather..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

=======
'use client';

import { useState } from 'react';

export default function AIChatPanel({ isOpen, onClose, weatherData }) {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI weather advisor. Ask me anything about the weather!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const generateResponse = (msg) => {
    const message = msg.toLowerCase();
    let response = '';

    if (message.includes('temperature') || message.includes('temp') || message.includes('hot') || message.includes('cold')) {
      if (weatherData) {
        const temp = Math.round(weatherData.main.temp);
        response = `The current temperature is ${temp}°C. ${temp > 25 ? "It's quite warm!" : temp < 10 ? "It's cold outside!" : "The temperature is pleasant."}`;
      } else {
        response = 'Please search for a city first to get temperature information.';
      }
    } else if (message.includes('rain') || message.includes('rainy')) {
      if (weatherData && weatherData.weather[0].main.toLowerCase().includes('rain')) {
        response = "Yes, it's currently raining. Don't forget your umbrella! 🌧️";
      } else {
        response = 'No rain in the forecast for the current location. Enjoy the dry weather!';
      }
    } else if (message.includes('wear') || message.includes('clothes') || message.includes('dress')) {
      if (weatherData) {
        const temp = weatherData.main.temp;
        if (temp < 10) response = 'Wear warm layers, a coat, and consider gloves if going outside.';
        else if (temp < 20) response = 'A light jacket or sweater would be perfect.';
        else response = 'Wear light, breathable clothing and don\'t forget sunscreen if it\'s sunny!';
      } else {
        response = 'Search for a city first and I\'ll give you dressing recommendations!';
      }
    } else if (message.includes('umbrella')) {
      if (weatherData && weatherData.weather[0].main.toLowerCase().includes('rain')) {
        response = 'Yes, definitely bring an umbrella! It\'s raining 🌧️';
      } else {
        response = 'No umbrella needed for now, but it\'s always good to check the forecast!';
      }
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      response = 'Hello! I\'m your AI weather advisor. Ask me about the weather, what to wear, or any weather-related questions!';
    } else if (message.includes('thank')) {
      response = 'You\'re welcome! Feel free to ask more weather questions 😊';
    } else {
      response = 'I\'m here to help with weather-related questions! Try asking about temperature, rain, what to wear, or umbrella advice.';
    }

    return response;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    
    // Generate and add bot response
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={`chat-panel ${isOpen ? 'active' : ''}`}>
      <div className="chat-header">
        <i className="fas fa-robot"></i>
        <span>AI Weather Advisor</span>
        <button className="chat-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div className={`chat-message ${msg.sender}`} key={index}>
            <i className={`fas ${msg.sender === 'bot' ? 'fa-robot' : 'fa-user'}`}></i>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about weather..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

>>>>>>> 43126c96babf3afbbcccf11101a80700601a7caa
