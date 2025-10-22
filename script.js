// Internet Media Art - UnderIM
// Comments that pop up on screen
const comments = [
    { text: "bro I'm watching this at 3am eating cereal", type: "neutral" },
    { text: "the comments section is a whole movie 😭", type: "positive" },
    { text: "why is no one talking about the chair???", type: "neutral" },
    { text: "this unlocked a core memory I didn't know I had", type: "positive" },
    { text: "I can't tell if this is genius or cursed", type: "neutral" },
    { text: "the way I paused at the exact moment the cat blinked 😭", type: "positive" },
    { text: "this video feels like a dream I had once", type: "neutral" },
    { text: "help I'm crying but I don't know why", type: "positive" },
    { text: "bro dropped this and disappeared like it's ancient prophecy", type: "positive" },
    { text: "this comment section has no laws", type: "neutral" },
    { text: "literally crying and throwing up rn", type: "positive" }
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
    
    // Get video wrapper dimensions to constrain comments to video area
    const videoWrapper = document.querySelector('.video-wrapper');
    const rect = videoWrapper.getBoundingClientRect();
    
    // Random position ONLY within the video area
    const x = rect.left + Math.random() * (rect.width - 420);
    const y = rect.top + Math.random() * (rect.height - 100);
    
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    
    container.appendChild(popup);
    
    // Ring bell
    animateBell();
    
    // SPEAK THE COMMENT with varied voice
    speakComment(comment.text, comment.type);
    
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

// Speak comments with characteristics based on type
function speakComment(text, type) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Adjust voice characteristics based on comment type
        switch(type) {
            case 'positive':
                utterance.rate = 1.1;
                utterance.pitch = 1.3; // Higher, enthusiastic
                utterance.volume = 0.9;
                break;
            case 'negative':
                utterance.rate = 1.0;
                utterance.pitch = 0.7; // Lower, aggressive
                utterance.volume = 1.0;
                break;
            case 'spam':
                utterance.rate = 1.5; // Fast, annoying
                utterance.pitch = 1.4; // Very high
                utterance.volume = 1.0;
                break;
            case 'neutral':
                utterance.rate = 1.0;
                utterance.pitch = 1.0; // Normal
                utterance.volume = 0.8;
                break;
        }
        
        // Try to get different voices for variety
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            utterance.voice = voices[Math.floor(Math.random() * Math.min(8, voices.length))];
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
    // First comment after a brief delay
    setTimeout(() => createPopupComment(), 2000);
    
    // Continuous comments with nice spacing
    commentInterval = setInterval(() => {
        createPopupComment();
    }, 3500); // One comment every 3.5 seconds (3s display + 0.5s speaking/buffer)
}

function startInterruptions() {
    // No big interruptions - just smooth comment flow
}

function startVoiceInterruptions() {
    // Wait for voices to load
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = () => {
            console.log('Voices loaded');
        };
    }
    
    // No separate voice interruptions - comments have sound now
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
    
    // Get video wrapper dimensions to constrain to video area
    const videoWrapper = document.querySelector('.video-wrapper');
    const rect = videoWrapper.getBoundingClientRect();
    
    // Random position within video area
    popup.style.left = `${rect.left + Math.random() * (rect.width - 420)}px`;
    popup.style.top = `${rect.top + Math.random() * (rect.height - 100)}px`;
    
    container.appendChild(popup);
    
    // Pause for celebration comment
    pauseContent();
    
    // Speak the celebration with enthusiasm!
    const celebrations = [
        'New subscriber!',
        'Thank you for subscribing!',
        'Welcome to the family!',
        'You just subscribed!',
        'Awesome!'
    ];
    speakComment(celebrations[Math.floor(Math.random() * celebrations.length)], 'positive');
    
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

