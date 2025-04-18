// script.js
document.addEventListener("DOMContentLoaded", function () {
    // Preloader removal and initial message
    setTimeout(() => {
        document.querySelector('.preloader').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.preloader').remove();
        }, 500);
        
        // Add initial AI message
        const chatWindow = document.getElementById('chat-window');
        addAIMessage("✨ Welcome! I am SIYA, your advanced AI companion. How may I assist you today? You can ask me anything from general knowledge to coding help!");
    }, 3000);

    // Sidebar functionality
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const overlay = document.querySelector('.overlay');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });

    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Message functions
    function addMessage(content, isUser = false) {
        const chatWindow = document.getElementById('chat-window');
        const message = document.createElement('div');
        message.className = `message ${isUser ? 'user' : 'ai'}`;
        
        // Add message actions (copy, etc.)
        const actions = document.createElement('div');
        actions.className = 'message-actions';
        actions.innerHTML = `
            <div class="message-action" title="Copy"><i class="fas fa-copy"></i></div>
            <div class="message-action" title="Share"><i class="fas fa-share"></i></div>
        `;
        
        // Add message content
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = content;
        
        // Add timestamp
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        message.appendChild(actions);
        message.appendChild(contentDiv);
        message.appendChild(timeDiv);
        
        chatWindow.appendChild(message);
        
        // Scroll to bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        // Add click event for copy action
        message.querySelector('.fa-copy').closest('.message-action').addEventListener('click', () => {
            navigator.clipboard.writeText(contentDiv.textContent);
            const copyBtn = message.querySelector('.fa-copy');
            copyBtn.classList.remove('fa-copy');
            copyBtn.classList.add('fa-check');
            setTimeout(() => {
                copyBtn.classList.remove('fa-check');
                copyBtn.classList.add('fa-copy');
            }, 2000);
        });
        
        return message;
    }

    function addUserMessage(content) {
        return addMessage(content, true);
    }

    function addAIMessage(content) {
        return addMessage(content, false);
    }

    function showTypingIndicator() {
        const chatWindow = document.getElementById('chat-window');
        const typing = document.createElement('div');
        typing.className = 'message ai';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'message-typing';
        typingContent.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        typing.appendChild(typingContent);
        chatWindow.appendChild(typing);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        return typing;
    }

    function removeTypingIndicator(typingElement) {
        if (typingElement && typingElement.parentNode) {
            typingElement.parentNode.removeChild(typingElement);
        }
    }

    // Chat functionality
    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Quick suggestions
    document.querySelectorAll('.suggestion').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('user-input').value = button.textContent;
            document.getElementById('user-input').focus();
        });
    });

    // Command responses
    const commands = {
        "tell me a joke": "हड्डियाँ आपस में क्यों नहीं लड़तीं? क्योंकि उनके पास हिम्मत नहीं होती! 😄",
        "time": `The current time is ${new Date().toLocaleTimeString()}.`,
        "date": `Today's date is ${new Date().toLocaleDateString()}.`,
        "hello": "Namaste! 🙏 How can I help you today?",
        "hi": "Hello there! 👋 What would you like to know?",
        "help": "I can help with various topics including jokes, time, date, and more. Just ask!"
    };

    // Voice Chat Functionality
    const voiceChatPage = document.querySelector('.voice-chat-page');
    const voiceMicButton = document.getElementById('voice-mic-button');
    const voiceBackButton = document.getElementById('voice-back-button');
    const voiceStatus = document.getElementById('voice-status');
    const voiceTranscript = document.getElementById('voice-transcript');
    const micButton = document.getElementById('mic-button');

    // Mic button in main chat
    micButton.addEventListener('click', () => {
        // Open voice chat page
        voiceChatPage.classList.add('active');
        
        // First AI greeting in voice chat
        voiceStatus.textContent = "Namaste, main SIYA. Main aapki kya madad kar sakti hoon?";
    });

    // Back button in voice chat
    voiceBackButton.addEventListener('click', () => {
        voiceChatPage.classList.remove('active');
        if (voiceRecognition && isVoiceListening) {
            voiceRecognition.stop();
        }
    });

    // Voice recognition in voice chat page
    let voiceRecognition;
    let isVoiceListening = false;

    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        voiceRecognition = new SpeechRecognition();
        voiceRecognition.continuous = false;
        voiceRecognition.interimResults = false;
        voiceRecognition.lang = 'en-US';

        voiceRecognition.onstart = () => {
            isVoiceListening = true;
            voiceMicButton.classList.add('listening');
            voiceStatus.textContent = "Listening... Speak now";
        };

        voiceRecognition.onend = () => {
            isVoiceListening = false;
            voiceMicButton.classList.remove('listening');
            voiceStatus.textContent = "Processing your request...";
        };

        voiceRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            voiceTranscript.textContent = `You said: "${transcript}"`;
            
            // Process the command
            setTimeout(() => {
                const response = commands[transcript.toLowerCase()] || generateAIResponse(transcript);
                voiceStatus.textContent = response;
                voiceTranscript.textContent = "";
                
                // Also add to main chat
                addUserMessage(transcript);
                addAIMessage(response);
            }, 1000);
        };

        voiceRecognition.onerror = (event) => {
            console.error('Voice recognition error', event.error);
            voiceMicButton.classList.remove('listening');
            voiceStatus.textContent = "Sorry, I didn't catch that. Please try again.";
        };

        voiceMicButton.addEventListener('click', () => {
            if (!isVoiceListening) {
                try {
                    voiceRecognition.start();
                } catch (e) {
                    console.error('Voice recognition error', e);
                    voiceStatus.textContent = "Voice input not available. Please type instead.";
                }
            } else {
                voiceRecognition.stop();
            }
        });

    } catch (e) {
        console.error('Speech recognition not supported', e);
        voiceStatus.textContent = "Voice chat not supported in your browser";
        voiceMicButton.style.display = 'none';
    }

    function sendMessage() {
        const input = document.getElementById('user-input');
        const message = input.value.trim();
        
        if (message) {
            addUserMessage(message);
            input.value = '';
            
            // Show typing indicator
            const typing = showTypingIndicator();
            
            // Check for commands or generate AI response
            setTimeout(() => {
                removeTypingIndicator(typing);
                
                let response = commands[message.toLowerCase()] || generateAIResponse(message);
                addAIMessage(response);
            }, 1000);
        }
    }

    // Simple response generator
    function generateAIResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi')) {
            return "Hello there! 👋 How can I help you today?";
        } else if (message.includes('joke')) {
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything!",
                "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
                "Why don't skeletons fight each other? They don't have the guts!"
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        } else if (message.includes('help') || message.includes('assist')) {
            return "I can help with a wide range of topics! Here are some things I can do:\n\n" +
                   "• Answer general knowledge questions\n" +
                   "• Help with coding problems\n" +
                   "• Explain complex concepts\n" +
                   "• Provide recommendations\n" +
                   "• And much more! What specifically do you need help with?";
        } else if (message.includes('time')) {
            return `The current time is ${new Date().toLocaleTimeString()}.`;
        } else if (message.includes('date')) {
            return `Today is ${new Date().toLocaleDateString()}.`;
        } else if (message.includes('weather')) {
            return "I can't check real-time weather, but you can ask me general questions about climate or weather patterns!";
        } else if (message.includes('thank')) {
            return "You're welcome! 😊 Is there anything else I can help you with?";
        } else if (message.includes('what can you do') || message.includes('capabilities')) {
            return "As an advanced AI assistant, I can:\n\n" +
                   "📚 Answer questions on various topics\n" +
                   "💡 Provide creative ideas and suggestions\n" +
                   "📊 Help with data analysis concepts\n" +
                   "👨‍💻 Assist with coding problems\n" +
                   "📖 Explain complex topics simply\n" +
                   "🗣 Engage in meaningful conversations\n\n" +
                   "What would you like to explore today?";
        } else {
            // Default response for unrecognized queries
            const responses = [
                "Interesting question! I'm designed to assist with a wide range of topics. Could you elaborate a bit more?",
                "I'd be happy to help with that. Could you provide some more details about what you're looking for?",
                "That's a great topic! Here's what I can tell you about it...",
                "I'm constantly learning! While I don't have a response for that exact question, I can help with related topics."
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    // Sidebar button functionality
    document.getElementById('new-chat-button').addEventListener('click', () => {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML = '';
        addAIMessage("✨ Welcome to a new conversation! I'm SIYA, your AI companion. What would you like to discuss?");
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    document.getElementById('history-button').addEventListener('click', () => {
        addAIMessage("Chat history would be displayed here in a full implementation.");
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    document.getElementById('home-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    document.getElementById('settings-button').addEventListener('click', () => {
        addAIMessage("Settings would be available here in a full implementation. This could include preferences for dark mode, notification settings, and more!");
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    document.getElementById('get-app-button').addEventListener('click', () => {
        addAIMessage("In a complete implementation, this would direct you to download our mobile app from the App Store or Google Play!");
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});