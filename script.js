// Internet Media Art - UnderIM
// Comments that pop up on screen
const comments = [
    { text: "First!", type: "spam" },
    { text: "This is so true!", type: "positive" },
    { text: "You're wrong about everything", type: "negative" },
    { text: "Who's watching in 2025?", type: "spam" },
    { text: "SUBSCRIBE TO MY CHANNEL", type: "spam" },
    { text: "This changed my life", type: "positive" },
    { text: "Stop spreading misinformation!", type: "negative" },
    { text: "Can someone explain?", type: "neutral" },
    { text: "I'm not reading all that", type: "negative" },
    { text: "Amazing content!", type: "positive" },
    { text: "This is literally me", type: "neutral" },
    { text: "Delete your account", type: "negative" },
    { text: "💀💀💀", type: "neutral" },
    { text: "Why am I here?", type: "neutral" },
    { text: "BUY CRYPTO NOW", type: "spam" },
    { text: "My grandmother could do better", type: "negative" },
    { text: "This deserves more views", type: "positive" },
    { text: "CLICKBAIT!", type: "negative" },
    { text: "Source?", type: "neutral" },
    { text: "Not even funny", type: "negative" },
    { text: "I can't stop watching", type: "positive" },
    { text: "This is the 10th time I'm watching this", type: "positive" },
    { text: "Skip to 5:23 for the good part", type: "neutral" },
    { text: "Nobody asked", type: "negative" },
    { text: "Touch grass", type: "negative" },
    { text: "I'm literally crying rn", type: "positive" },
    { text: "CHECK OUT MY CHANNEL FOR FREE IPHONE", type: "spam" },
    { text: "The algorithm brought me here", type: "neutral" },
    { text: "This aged like milk", type: "negative" },
    { text: "This aged like wine", type: "positive" },
    { text: "Who else is procrastinating?", type: "neutral" },
    { text: "I should be studying", type: "neutral" },
    { text: "My parents are fighting in the background", type: "neutral" },
    { text: "Ratio", type: "spam" },
    { text: "L + Ratio", type: "spam" },
    { text: "W video", type: "positive" },
    { text: "Take this down immediately", type: "negative" },
    { text: "Pin me please!", type: "spam" }
];

// Interruption messages
const interruptions = [
    "WAIT, THERE'S MORE!",
    "BREAKING NEWS!",
    "YOU WON'T BELIEVE THIS!",
    "URGENT UPDATE!",
    "SPECIAL ANNOUNCEMENT!",
    "STOP EVERYTHING!",
    "THIS JUST IN!",
    "ATTENTION PLEASE!",
    "IMPORTANT MESSAGE!",
    "NEW NOTIFICATION!",
    "DEVELOPING STORY!",
    "SHOCKING REVELATION!",
    "DON'T SKIP THIS!",
    "CRITICAL ALERT!",
    "LIVE UPDATE!",
    "MUST WATCH!",
    "VIRAL MOMENT!",
    "TRENDING NOW!",
    "EVERYONE IS TALKING ABOUT THIS!",
    "THIS CHANGES EVERYTHING!",
    "EXCLUSIVE CONTENT!",
    "LIMITED TIME ONLY!",
    "ACT NOW!",
    "YOU NEED TO SEE THIS!",
    "MASSIVE ANNOUNCEMENT!"
];

// Voice interruption phrases
const voicePhrases = [
    "Wait, let me tell you something",
    "Actually, you're completely wrong",
    "Hold on a second",
    "This reminds me of",
    "Can you just listen?",
    "No offense but",
    "I have to disagree",
    "Let me interrupt you real quick",
    "Sorry, not sorry",
    "To be honest"
];

let commentInterval;
let interruptionInterval;
let voiceInterval;
let isPaused = false;
let isInterrupting = false; // Track if an interruption is currently active
let interruptionQueue = []; // Queue for sequential interruptions

// Initialize the art piece
function init() {
    // Start comment pop-ups
    startCommentPopups();
    
    // Start interruptions
    startInterruptions();
    
    // Start voice interruptions
    startVoiceInterruptions();
    
    // Add click handlers
    document.querySelector('.subscribe-btn').addEventListener('click', handleSubscribe);
    document.querySelector('.play-btn').addEventListener('click', togglePlay);
}

// Pause the content (video and mouth animation)
function pauseContent() {
    if (!isPaused) {
        isPaused = true;
        const video = document.getElementById('mainVideo');
        const mouth = document.querySelector('.mouth');
        const progress = document.querySelector('.progress');
        const eyes = document.querySelectorAll('.eye');
        const speechIndicator = document.querySelector('.speech-indicator');
        
        video.pause();
        if (mouth) {
            mouth.style.animationPlayState = 'paused';
        }
        if (progress) {
            progress.style.animationPlayState = 'paused';
        }
        if (speechIndicator) {
            speechIndicator.style.animationPlayState = 'paused';
            speechIndicator.textContent = '⏸ Interrupted...';
        }
        // Pause eye animations too
        eyes.forEach(eye => {
            eye.style.animationPlayState = 'paused';
            const pupil = eye.querySelector('::after');
            if (pupil) {
                eye.style.setProperty('animation-play-state', 'paused');
            }
        });
        
        // Pause any ongoing speech
        if ('speechSynthesis' in window) {
            speechSynthesis.pause();
        }
    }
}

// Resume the content
function resumeContent() {
    isPaused = false;
    const video = document.getElementById('mainVideo');
    const mouth = document.querySelector('.mouth');
    const progress = document.querySelector('.progress');
    const eyes = document.querySelectorAll('.eye');
    const speechIndicator = document.querySelector('.speech-indicator');
    
    video.play().catch(() => {
        // Video might not exist, that's okay
    });
    
    if (mouth) {
        mouth.style.animationPlayState = 'running';
    }
    if (progress) {
        progress.style.animationPlayState = 'running';
    }
    if (speechIndicator) {
        speechIndicator.style.animationPlayState = 'running';
        speechIndicator.textContent = 'Speaking...';
    }
    // Resume eye animations
    eyes.forEach(eye => {
        eye.style.animationPlayState = 'running';
    });
    
    // Resume speech
    if ('speechSynthesis' in window && speechSynthesis.paused) {
        speechSynthesis.resume();
    }
    
    // Process next interruption in queue if any
    processNextInterruption();
}

// Process the next interruption in the queue
function processNextInterruption() {
    updateQueueDisplay();
    if (interruptionQueue.length > 0 && !isInterrupting) {
        const nextInterruption = interruptionQueue.shift();
        updateQueueDisplay();
        nextInterruption();
    }
}

// Update the queue display
function updateQueueDisplay() {
    const queueCount = document.querySelector('.queue-count');
    const queueIndicator = document.querySelector('.queue-indicator');
    
    if (queueCount) {
        queueCount.textContent = interruptionQueue.length;
    }
    
    if (queueIndicator) {
        if (interruptionQueue.length > 0) {
            queueIndicator.classList.add('has-queue');
        } else {
            queueIndicator.classList.remove('has-queue');
        }
    }
}

// Create pop-up comments
function createPopupComment() {
    // If already interrupting, add to queue
    if (isInterrupting) {
        interruptionQueue.push(executePopupComment);
        updateQueueDisplay();
        return;
    }
    
    executePopupComment();
}

// Execute the popup comment interruption
function executePopupComment() {
    isInterrupting = true;
    
    const container = document.getElementById('popupComments');
    const comment = comments[Math.floor(Math.random() * comments.length)];
    
    const popup = document.createElement('div');
    popup.className = `popup-comment ${comment.type}`;
    popup.textContent = comment.text;
    
    // Random position
    const x = Math.random() * (window.innerWidth - 320) + 10;
    const y = Math.random() * (window.innerHeight - 100) + 10;
    
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    
    container.appendChild(popup);
    
    // Ring bell
    animateBell();
    
    // PAUSE THE CONTENT when comment appears
    pauseContent();
    
    // Remove after animation and RESUME
    setTimeout(() => {
        popup.remove();
        isInterrupting = false;
        resumeContent();
    }, 3000);
}

// Create interruptions
function createInterruption() {
    // If already interrupting, add to queue
    if (isInterrupting) {
        interruptionQueue.push(executeInterruption);
        updateQueueDisplay();
        return;
    }
    
    executeInterruption();
}

// Execute the big interruption
function executeInterruption() {
    isInterrupting = true;
    
    const container = document.getElementById('interruptions');
    const message = interruptions[Math.floor(Math.random() * interruptions.length)];
    
    const interruption = document.createElement('div');
    interruption.className = 'interruption';
    interruption.textContent = message;
    
    // Center position with slight randomness
    const x = (window.innerWidth / 2) - 150 + (Math.random() * 100 - 50);
    const y = (window.innerHeight / 2) - 50 + (Math.random() * 100 - 50);
    
    interruption.style.left = `${x}px`;
    interruption.style.top = `${y}px`;
    
    container.appendChild(interruption);
    
    // PAUSE THE CONTENT when interruption appears
    pauseContent();
    
    // Speak the interruption
    speakText(message);
    
    // Make it last MUCH LONGER (6-7 seconds total)
    setTimeout(() => {
        interruption.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            interruption.remove();
            isInterrupting = false;
            resumeContent();
        }, 500);
    }, 6500); // Changed from 2000 to 6500 - much longer!
}

// Voice interruptions using Web Speech API
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.2;
        utterance.pitch = Math.random() * 0.5 + 0.8; // Random pitch for variety
        utterance.volume = 0.8;
        
        // Try to get different voices
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            utterance.voice = voices[Math.floor(Math.random() * Math.min(5, voices.length))];
        }
        
        speechSynthesis.speak(utterance);
    }
}

// Random voice interruptions
function createVoiceInterruption() {
    // If already interrupting, add to queue
    if (isInterrupting) {
        interruptionQueue.push(executeVoiceInterruption);
        updateQueueDisplay();
        return;
    }
    
    executeVoiceInterruption();
}

// Execute the voice interruption
function executeVoiceInterruption() {
    isInterrupting = true;
    
    const phrase = voicePhrases[Math.floor(Math.random() * voicePhrases.length)];
    
    // PAUSE THE CONTENT when voice interruption starts
    pauseContent();
    
    speakText(phrase);
    
    // Also show it briefly as text
    const container = document.getElementById('interruptions');
    const voiceText = document.createElement('div');
    voiceText.className = 'interruption';
    voiceText.style.background = 'rgba(100, 100, 255, 0.9)';
    voiceText.textContent = `"${phrase}"`;
    
    const x = (window.innerWidth / 2) - 150;
    const y = window.innerHeight - 200;
    
    voiceText.style.left = `${x}px`;
    voiceText.style.top = `${y}px`;
    voiceText.style.fontSize = '20px';
    
    container.appendChild(voiceText);
    
    // Make voice interruptions last longer too (4 seconds)
    setTimeout(() => {
        voiceText.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            voiceText.remove();
            isInterrupting = false;
            resumeContent();
        }, 500);
    }, 4000); // Changed from 1500 to 4000
}

// Start all the chaos
function startCommentPopups() {
    // Start the pattern: 3 comments, then big interruption
    let commentCount = 0;
    
    // First comment after a brief delay
    setTimeout(() => {
        startCommentCycle();
    }, 2000);
    
    function startCommentCycle() {
        // Add 3 comments
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createPopupComment();
            }, i * 3500); // 3.5 seconds apart (3 sec display + 0.5 sec buffer)
        }
        
        // Then add a big interruption after the 3 comments
        setTimeout(() => {
            createInterruption();
        }, 3 * 3500);
        
        // Repeat the whole cycle
        setTimeout(() => {
            startCommentCycle();
        }, 3 * 3500 + 7500); // After 3 comments (10.5s) + long interruption (7s) = 17.5s per cycle
    }
}

function startInterruptions() {
    // Interruptions are now controlled by the comment cycle
    // This function is kept for compatibility but does nothing
    // The big interruptions happen automatically after every 3 comments
}

function startVoiceInterruptions() {
    // Wait for voices to load
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = () => {
            console.log('Voices loaded');
        };
    }
    
    // Voice interruptions are disabled to maintain the 3-comment pattern
    // They're only used when speaking the big interruption messages
}

// Animate bell notification
function animateBell() {
    const bell = document.querySelector('.sound-indicator');
    bell.style.animation = 'none';
    setTimeout(() => {
        bell.style.animation = 'bellRing 0.5s ease-out';
    }, 10);
}

// Handle subscribe button
function handleSubscribe(e) {
    const btn = e.target;
    btn.textContent = 'SUBSCRIBED';
    btn.style.background = '#666';
    
    // Queue celebration comments to play one at a time
    for (let i = 0; i < 5; i++) {
        interruptionQueue.push(() => executeCelebrationComment());
    }
    
    // Trigger the first one if nothing is playing
    if (!isInterrupting) {
        processNextInterruption();
    }
    
    setTimeout(() => {
        btn.textContent = 'SUBSCRIBE';
        btn.style.background = '#cc0000';
    }, 15000); // Longer timeout since celebrations take time
}

// Execute a celebration comment
function executeCelebrationComment() {
    isInterrupting = true;
    
    const container = document.getElementById('popupComments');
    const popup = document.createElement('div');
    popup.className = 'popup-comment positive';
    popup.textContent = '🎉 NEW SUBSCRIBER! 🎉';
    popup.style.left = `${Math.random() * (window.innerWidth - 320)}px`;
    popup.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
    container.appendChild(popup);
    
    // Pause for celebration comment
    pauseContent();
    
    // Speak only on first celebration
    if (Math.random() > 0.8) {
        speakText('Thank you for subscribing!');
    }
    
    setTimeout(() => {
        popup.remove();
        isInterrupting = false;
        resumeContent();
    }, 2000); // Slightly shorter for celebrations
}

// Toggle play/pause
function togglePlay(e) {
    const btn = e.target;
    const video = document.getElementById('mainVideo');
    
    if (btn.textContent === '▶') {
        btn.textContent = '⏸';
        video.play().catch(() => {
            // Video might not exist, that's okay
        });
    } else {
        btn.textContent = '▶';
        video.pause();
    }
}

// Increase chaos over time
let chaosLevel = 1;
setInterval(() => {
    chaosLevel += 0.1;
    if (chaosLevel > 3) chaosLevel = 3;
}, 30000);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    clearInterval(commentInterval);
    clearInterval(interruptionInterval);
    clearInterval(voiceInterval);
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Easter egg: clicking the video adds more comments to queue
document.addEventListener('click', (e) => {
    if (e.target.closest('.video-wrapper')) {
        // Add 3 comments to the queue
        for (let i = 0; i < 3; i++) {
            createPopupComment();
        }
    }
});

