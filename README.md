# UnderIM - Internet Media Art

An interactive web-based media art installation exploring the fractured nature of digital attention and online video consumption.

## Concept

"UnderIM" simulates the chaotic experience of watching online video content with a rhythmic pattern of interruption:

**The Pattern:**
1. 💬 **Comment 1** → Speaker pauses → Comment disappears → Speaker resumes
2. 💬 **Comment 2** → Speaker pauses → Comment disappears → Speaker resumes  
3. 💬 **Comment 3** → Speaker pauses → Comment disappears → Speaker resumes
4. 🚨 **BIG INTERRUPTION** (lasts 6-7 seconds!) → Speaker stays paused → Finally disappears → Speaker resumes
5. 🔄 **Pattern repeats endlessly**

The interruptions are **relentless and long**, dominating the experience. The speaker gets brief moments to talk between comments, but then the massive interruption takes over for an extended period. This creates a rhythm where the commentary and alerts become more important than the actual content.

The piece comments on:
- Information overload in digital spaces
- The impossibility of focused attention online
- How comments and reactions disrupt and fragment the original message
- The parasocial relationship between content and commentary
- The commodification of attention

## How to Experience

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge)
2. Allow audio permissions when prompted (for voice synthesis)
3. Watch as the interruptions happen **one at a time** in sequence
4. Notice the **queue counter** in the bottom right showing how many interruptions are waiting
5. Try clicking the video to add more interruptions to the queue
6. Try clicking the SUBSCRIBE button to queue celebration messages

## Technical Features

- **Web Speech API** for voice synthesis interruptions
- **CSS animations** for smooth pop-up effects
- **Dynamic comment generation** with varied timing
- **Responsive design** that works on different screen sizes
- **No external dependencies** - pure HTML, CSS, and JavaScript

## Artist's Note

This piece examines how digital platforms fragment our attention and create an environment where signal and noise become indistinguishable. The viewer becomes complicit in the chaos, unable to escape the constant stream of notifications, comments, and interruptions that characterize modern internet media consumption.

The "video" at the center - whether real or simulated - becomes almost secondary to the ecosystem of reactions, comments, and interruptions that surround it. This reflects the reality that online content is increasingly consumed not in isolation, but through the lens of aggregated social responses.

## Customization

- Add your own video by replacing the video source in `index.html`
- Modify comment messages in the `comments` array in `script.js`
- Adjust timing intervals to make it more or less chaotic
- Change color schemes in `styles.css` to alter the mood

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (may need to enable Web Speech API)
- Mobile browsers: Supported with responsive design

---

**UnderIM** © 2025 - A meditation on digital distraction

