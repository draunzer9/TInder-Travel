// --- AUTOCOMPLETE DESTINATIONS ---
const destinationList = [
  { name: "Bali, Indonesia", code: "Bali", flag: "🇮🇩" },
  { name: "Tokyo, Japan", code: "Tokyo", flag: "🇯🇵" },
  { name: "Paris, France", code: "Paris", flag: "🇫🇷" },
  { name: "New York, USA", code: "New York", flag: "🇺🇸" },
  { name: "Sydney, Australia", code: "Sydney", flag: "🇦🇺" }
];

// --- APPLICATION STATE ---
const appState = {
  activeView: 'view-home',
  datingMode: 'travel', // 'travel' or 'dating'
  profileCompleted: false,
  preferences: {
    tags: ['Budget', 'Adventure', 'Culture', 'Food', 'Travel companion'],
    mode: 'traveler', // 'traveler' or 'local'
    destination: 'Bali, Indonesia',
    startDate: '2026-12-12',
    endDate: '2026-12-18',
    localHelp: ['Stay', 'Local food spots', 'Hidden places', 'City exploration', 'Cultural experiences']
  },
  chatMessages: [
    // Loaded dynamically when match happens
  ],
  currentCardIndex: 0,
  hasMatchedWithPriya: false
};

// --- DATA: Simulated Profiles in Feed ---
const simulatedProfiles = [
  {
    id: 'priya',
    name: 'Priya',
    age: 28,
    isLocal: false,
    matchPercent: 92,
    origin: 'Bengaluru',
    destination: 'Bali',
    dates: 'Dec 12 – 18',
    image: 'assets/priya_profile.jpg',
    tags: ['Budget', 'Culture', 'Food', 'Adventure'],
    whyMatch: [
      'Same destination (Bali, Indonesia)',
      'Same travel dates (Dec 12 - Dec 18)',
      'Similar budget (Budget/Economy)',
      'Both enjoy local food',
      'Both prefer cultural experiences'
    ],
    summary: 'You both prefer exploring local places, trying local food, and keeping the trip flexible.'
  },
  {
    id: 'arjun',
    name: 'Arjun',
    age: 30,
    isLocal: true,
    rating: 4.8,
    connections: 12,
    location: 'Bali, Indonesia',
    image: 'assets/arjun_profile.jpg',
    tags: ['Local Host', 'Hidden Places', 'Verified Stays'],
    helpItems: ['Stay', 'Local food spots', 'Hidden places', 'City exploration', 'Cultural experiences'],
    verified: true
  },
  {
    id: 'sarah',
    name: 'Sarah',
    age: 26,
    isLocal: false,
    matchPercent: 84,
    origin: 'London',
    destination: 'Bali',
    dates: 'Dec 11 – 19',
    image: 'assets/user_avatar.jpg', // reusable for placeholder
    tags: ['Relaxed', 'Nature', 'Photography'],
    whyMatch: [
      'Same destination (Bali, Indonesia)',
      'Overlapping dates (Dec 11 - Dec 19)',
      'Both enjoy nature photography'
    ],
    summary: 'Sarah loves photography and relaxing in nature. Great if you want a slow-paced nature day.'
  }
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // Update iOS mock clock time
  updateMockClock();
  setInterval(updateMockClock, 1000 * 60);

  // Setup tag click listeners
  setupTagListeners();
  
  // Initialize destination autocomplete suggestions
  initAutocomplete();
  
  // Render card stack initially
  renderCardStack();
});

// --- CORE NAVIGATION (routing) ---
function switchView(viewId) {
  // Find current active view
  const currentView = document.querySelector('.view.active');
  const targetView = document.getElementById(viewId);
  
  if (!targetView) return;

  if (currentView) {
    currentView.classList.remove('active');
  }
  
  targetView.classList.add('active');
  appState.activeView = viewId;

  // Sync navigation bar active state
  syncBottomNav(viewId);
}

function switchTab(tabId) {
  if (tabId === 'dating') {
    switchMode('dating');
    switchView('view-home');
  } else if (tabId === 'travel') {
    switchMode('travel');
    if (appState.profileCompleted) {
      if (appState.preferences.mode === 'local') {
        switchView('view-local-dashboard');
      } else {
        switchView('view-discovery');
      }
    } else {
      switchView('view-home');
    }
  } else if (tabId === 'messages') {
    if (appState.hasMatchedWithPriya) {
      switchView('view-chat');
      // Clear unread badge
      document.getElementById('chat-unread-dot').classList.add('hidden');
    } else {
      alert("No active chats yet. Connect with a traveler in Discovery mode to start chatting!");
    }
  } else if (tabId === 'profile') {
    switchView('view-profile-setup');
  }
}

function syncBottomNav(viewId) {
  // Remove active from all nav buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));

  // Add active to appropriate button
  if (viewId === 'view-home') {
    if (appState.datingMode === 'dating') {
      document.getElementById('nav-btn-dating').classList.add('active');
    } else {
      document.getElementById('nav-btn-travel').classList.add('active');
    }
  } else if (viewId === 'view-discovery' || viewId === 'view-preferences' || viewId === 'view-local-profile' || viewId === 'view-compatibility' || viewId === 'view-local-dashboard') {
    document.getElementById('nav-btn-travel').classList.add('active');
  } else if (viewId === 'view-chat') {
    document.getElementById('nav-btn-messages').classList.add('active');
  } else if (viewId === 'view-profile-setup') {
    document.getElementById('nav-btn-profile').classList.add('active');
  }
}

// --- HOME SCREEN LOGIC ---
function switchMode(mode) {
  const modeBg = document.getElementById('mode-bg');
  const btnDating = document.getElementById('btn-mode-dating');
  const btnTravel = document.getElementById('btn-mode-travel');
  
  const travelContent = document.getElementById('travel-home-content');
  const datingContent = document.getElementById('dating-home-content');

  appState.datingMode = mode;

  if (mode === 'dating') {
    modeBg.style.transform = 'translateX(100%)';
    btnDating.classList.add('active');
    btnTravel.classList.remove('active');
    
    travelContent.classList.add('hidden');
    datingContent.classList.remove('hidden');
    
    document.getElementById('nav-btn-dating').classList.add('active');
    document.getElementById('nav-btn-travel').classList.remove('active');
  } else {
    modeBg.style.transform = 'translateX(0)';
    btnTravel.classList.add('active');
    btnDating.classList.remove('active');
    
    datingContent.classList.add('hidden');
    travelContent.classList.remove('hidden');
    
    document.getElementById('nav-btn-travel').classList.add('active');
    document.getElementById('nav-btn-dating').classList.remove('active');
  }
}

function startTravelProfile(preSelectedDest) {
  if (preSelectedDest) {
    document.getElementById('input-destination').value = preSelectedDest + ', Indonesia';
    document.getElementById('input-local-dest').value = preSelectedDest + ', Indonesia';
  }
  switchView('view-preferences');
}

// --- PREFERENCES / ONBOARDING WIZARD ---
let currentPrefStep = 1;

function nextPrefStep() {
  if (currentPrefStep === 1) {
    document.getElementById('pref-step-1').classList.remove('active');
    document.getElementById('pref-step-2').classList.add('active');
    document.getElementById('pref-progress').style.width = '100%';
    document.getElementById('pref-step-num').textContent = '2/2';
    currentPrefStep = 2;
  }
}

function prevPrefStep() {
  if (currentPrefStep === 2) {
    document.getElementById('pref-step-2').classList.remove('active');
    document.getElementById('pref-step-1').classList.add('active');
    document.getElementById('pref-progress').style.width = '50%';
    document.getElementById('pref-step-num').textContent = '1/2';
    currentPrefStep = 1;
  } else {
    // Exit preferences
    switchView('view-home');
  }
}

function selectIntentMode(mode) {
  appState.preferences.mode = mode;
  
  const travelerCard = document.getElementById('intent-traveler');
  const localCard = document.getElementById('intent-local');
  
  const travelerForm = document.getElementById('form-traveler-details');
  const localForm = document.getElementById('form-local-details');

  if (mode === 'traveler') {
    travelerCard.classList.add('active');
    localCard.classList.remove('active');
    
    travelerForm.classList.remove('hidden');
    localForm.classList.add('hidden');
  } else {
    localCard.classList.add('active');
    travelerCard.classList.remove('active');
    
    localForm.classList.remove('hidden');
    travelerForm.classList.add('hidden');
  }
}

function setupTagListeners() {
  document.querySelectorAll('.tag-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
      
      // Collect selected tags
      const selected = [];
      document.querySelectorAll('.tag-pill.active').forEach(p => {
        selected.push(p.getAttribute('data-val'));
      });
      
      appState.preferences.tags = selected;
      document.getElementById('selected-tags-count').textContent = `${selected.length} preferences selected`;
    });
  });
}

function completePreferences() {
  // Read form inputs
  if (appState.preferences.mode === 'traveler') {
    appState.preferences.destination = document.getElementById('input-destination').value;
    
    // Format dates nicely
    const startVal = document.getElementById('input-start-date').value;
    const endVal = document.getElementById('input-end-date').value;
    
    appState.preferences.startDate = startVal;
    appState.preferences.endDate = endVal;

    // Format for headers
    const options = { month: 'short', day: 'numeric' };
    const dStart = new Date(startVal);
    const dEnd = new Date(endVal);
    const dateStr = `${dStart.toLocaleDateString('en-US', options)} – ${dEnd.getDate()}`;
    
    // Resolve dynamic flag
    const cleanDest = appState.preferences.destination.split(',')[0].trim();
    const destInfo = destinationList.find(d => d.code.toLowerCase() === cleanDest.toLowerCase()) || destinationList[0];
    
    document.getElementById('discovery-dest-header').innerHTML = `<span class="header-flag">${destInfo.flag}</span> ${destInfo.code}`;
    document.getElementById('discovery-dates-header').textContent = dateStr;
  } else {
    appState.preferences.destination = document.getElementById('input-local-dest').value;
    
    const cleanDest = appState.preferences.destination.split(',')[0].trim();
    const destInfo = destinationList.find(d => d.code.toLowerCase() === cleanDest.toLowerCase()) || destinationList[0];
    
    document.getElementById('discovery-dest-header').innerHTML = `<span class="header-flag">${destInfo.flag}</span> ${destInfo.code}`;
    document.getElementById('discovery-dates-header').textContent = 'Local Hosting Mode';
  }

  // Update profile images, locations, and match reasons dynamically based on chosen city
  updateProfilesForDestination(appState.preferences.destination);

  // Complete profile state
  appState.profileCompleted = true;
  appState.currentCardIndex = 0;
  
  // Transition logic based on Traveler (Premium) vs Local Host (Free Dashboard)
  if (appState.preferences.mode === 'local') {
    // Populate Host Dashboard
    document.getElementById('local-status-text').textContent = `Visible to travelers searching for ${appState.preferences.destination}`;
    document.getElementById('dashboard-location-text').textContent = `📍 ${appState.preferences.destination} · Local Host`;
    
    // Read help checkboxes from onboarding step 2
    const checkedHelp = [];
    document.querySelectorAll('.help-checkboxes input[type="checkbox"]:checked').forEach(cb => {
      checkedHelp.push(cb.value);
    });
    appState.preferences.localHelp = checkedHelp;

    // Render help badges dynamically
    const helpList = document.getElementById('dashboard-help-list');
    helpList.innerHTML = '';
    
    const helpIcons = {
      'Stay': '🏠',
      'Local food spots': '🍜',
      'Hidden places': '📍',
      'City exploration': '🚶',
      'Cultural experiences': '🌏'
    };

    checkedHelp.forEach(helpVal => {
      const icon = helpIcons[helpVal] || '💡';
      const badge = document.createElement('div');
      badge.className = 'help-item-badge';
      badge.innerHTML = `
        <span class="help-badge-icon">${icon}</span>
        <div class="help-badge-text">
          <strong>${helpVal}</strong>
          <span class="badge-status">Always available</span>
        </div>
      `;
      helpList.appendChild(badge);
    });

    switchView('view-local-dashboard');
  } else {
    // Transition to Discovery traveler stack
    renderCardStack();
    switchView('view-discovery');
  }
}

// --- CARD STACK DISCOVERY LOGIC ---
function renderCardStack() {
  const stack = document.getElementById('card-stack');
  stack.innerHTML = ''; // clear

  const remainingProfiles = simulatedProfiles.slice(appState.currentCardIndex);

  if (remainingProfiles.length === 0) {
    document.getElementById('empty-stack-placeholder').classList.remove('hidden');
    document.getElementById('stack-count-label').textContent = '0 matches found';
    return;
  } else {
    document.getElementById('empty-stack-placeholder').classList.add('hidden');
    document.getElementById('stack-count-label').textContent = `${remainingProfiles.length} connection opportunities for your trip`;
  }

  remainingProfiles.forEach((profile, index) => {
    // We only create DOM cards for the top 3 items to optimize rendering
    if (index > 2) return;

    const card = document.createElement('div');
    card.className = 'profile-card';
    card.style.zIndex = 10 - index;
    card.id = `card-${profile.id}`;
    
    // Add click event for details
    card.addEventListener('click', (e) => {
      // Don't trigger if click was on buttons/tags or swipe occurred
      if (e.target.closest('.card-info-btn') || e.target.closest('.card-tag') || isDraggingCard) return;
      openProfileDetail(profile);
    });

    if (profile.isLocal) {
      // Render Local Host Card
      card.innerHTML = `
        <div class="card-media" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%), url('${profile.image}');">
          <div class="card-gradient-overlay"></div>
          <div class="card-info-badge-row">
            <span class="match-percentage-badge" style="background-color: var(--color-blue);">Local Host</span>
            <button class="card-info-btn">i</button>
          </div>
          <div class="card-info-header">
            <h2>${profile.name}, ${profile.age}</h2>
            <div class="card-route-sub">📍 ${profile.location} · ⭐ ${profile.rating}</div>
          </div>
          <div class="card-tags-row">
            ${profile.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="why-match-drawer">
          <h4>I can help travelers with:</h4>
          <div class="why-match-points">
            <div class="why-point-item"><span style="color:var(--color-blue);">✓</span> Local food spots & hidden places</div>
            <div class="why-point-item"><span style="color:var(--color-blue);">✓</span> Verified Host (Accommodation available)</div>
          </div>
        </div>
      `;
    } else {
      // Render Premium Traveler Card
      card.innerHTML = `
        <div class="card-media" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%), url('${profile.image}');">
          <div class="card-gradient-overlay"></div>
          <div class="card-info-badge-row">
            <span class="match-percentage-badge">${profile.matchPercent}% Travel Match</span>
            <button class="card-info-btn">i</button>
          </div>
          <div class="card-info-header">
            <h2>${profile.name}, ${profile.age}</h2>
            <div class="card-route-sub">✈️ ${profile.origin} → ${profile.destination} · ${profile.dates}</div>
          </div>
          <div class="card-tags-row">
            ${profile.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="why-match-drawer">
          <h4>Why you match:</h4>
          <div class="why-match-points">
            ${profile.whyMatch.slice(0, 2).map(p => `
              <div class="why-point-item tick">✓ ${p.split('(')[0]}</div>
            `).join('')}
          </div>
        </div>
      `;
    }

    stack.appendChild(card);
    
    // Wire up gestures to top card only
    if (index === 0) {
      initCardGesture(card, profile);
      // Info button click handler
      card.querySelector('.card-info-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openProfileDetail(profile);
      });
    }
  });
}

// --- CARD SWIPE GESTURE HANDLERS ---
let isDraggingCard = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;

function initCardGesture(cardEl, profile) {
  cardEl.addEventListener('pointerdown', (e) => {
    isDraggingCard = true;
    startX = e.clientX;
    startY = e.clientY;
    cardEl.style.transition = 'none';
    cardEl.setPointerCapture(e.pointerId);
  });

  cardEl.addEventListener('pointermove', (e) => {
    if (!isDraggingCard) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;

    // Calculate rotation angle based on horizontal drag offset
    const rotate = offsetX * 0.05;
    
    // Apply transform translation & rotation
    cardEl.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
    
    // Visual indicators (optional backdrop coloring could go here)
  });

  cardEl.addEventListener('pointerup', (e) => {
    if (!isDraggingCard) return;
    isDraggingCard = false;
    cardEl.releasePointerCapture(e.pointerId);

    const threshold = 110;
    
    if (offsetX > threshold) {
      // Connect (Swipe Right)
      swipeCardOut(cardEl, 'right', profile);
    } else if (offsetX < -threshold) {
      // Skip (Swipe Left)
      swipeCardOut(cardEl, 'left', profile);
    } else {
      // Snap back to center
      cardEl.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2)';
      cardEl.style.transform = 'translate(0px, 0px) rotate(0deg)';
      offsetX = 0;
      offsetY = 0;
    }
  });
}

function swipeCardOut(cardEl, direction, profile) {
  cardEl.style.transition = 'transform 0.4s cubic-bezier(0.1, 0.8, 0.3, 1)';
  
  const outX = direction === 'right' ? 400 : -400;
  const rotate = direction === 'right' ? 25 : -25;
  
  cardEl.style.transform = `translate(${outX}px, ${offsetY}px) rotate(${rotate}deg)`;
  cardEl.style.opacity = '0';

  setTimeout(() => {
    cardEl.remove();
    appState.currentCardIndex++;
    
    if (direction === 'right') {
      triggerConnect(profile.id);
    } else {
      // Next card rendered
      renderCardStack();
    }
    
    // Reset offsets
    offsetX = 0;
    offsetY = 0;
  }, 350);
}

function handleBtnAction(action) {
  const cards = document.querySelectorAll('.profile-card');
  if (cards.length === 0) return;

  const topCard = cards[0];
  const profileId = topCard.id.replace('card-', '');
  const profile = simulatedProfiles.find(p => p.id === profileId);

  // Animate flight
  topCard.style.transition = 'transform 0.4s cubic-bezier(0.1, 0.8, 0.3, 1)';
  const outX = action === 'connect' ? 450 : -450;
  const rotate = action === 'connect' ? 25 : -25;

  topCard.style.transform = `translate(${outX}px, 0px) rotate(${rotate}deg)`;
  topCard.style.opacity = '0';

  setTimeout(() => {
    topCard.remove();
    appState.currentCardIndex++;
    
    if (action === 'connect') {
      triggerConnect(profile.id);
    } else {
      renderCardStack();
    }
  }, 350);
}

function resetCardStack() {
  appState.currentCardIndex = 0;
  renderCardStack();
}

function openProfileDetail(profile) {
  if (profile.isLocal) {
    // Screen 4: Local host profile
    document.getElementById('host-main-img').src = profile.image;
    document.querySelector('.profile-details-card h2').textContent = `${profile.name}, ${profile.age}`;
    document.querySelector('.profile-location').textContent = `📍 ${profile.location} · Local Host`;
    
    // Action connect hook
    const connBtn = document.querySelector('.profile-action-ctas .btn-primary');
    connBtn.setAttribute('onclick', `triggerConnect('${profile.id}')`);

    switchView('view-local-profile');
  } else {
    // Screen 5: Compatibility Detail page
    document.getElementById('compat-partner-img').src = profile.image;
    document.getElementById('compat-title-name').textContent = `${profile.name}, ${profile.age}`;
    document.getElementById('compat-route-text').textContent = `${profile.origin} → ${profile.destination} · ${profile.dates}`;
    document.getElementById('compat-score-pct').textContent = `${profile.matchPercent}%`;
    document.getElementById('compat-summary-desc').textContent = `"${profile.summary}"`;
    document.getElementById('compare-partner-label').textContent = profile.name;

    // Load comparison tags list
    const userTagsContainer = document.getElementById('compare-user-tags');
    const partnerTagsContainer = document.getElementById('compare-partner-tags');
    
    userTagsContainer.innerHTML = '';
    partnerTagsContainer.innerHTML = '';

    // Render You column tags
    appState.preferences.tags.slice(0, 5).forEach(t => {
      const isShared = profile.tags.includes(t);
      const span = document.createElement('span');
      span.className = `tag-pill ${isShared ? 'shared' : ''}`;
      span.textContent = t;
      userTagsContainer.appendChild(span);
    });

    // Render Match column tags
    profile.tags.forEach(t => {
      const isShared = appState.preferences.tags.includes(t);
      const span = document.createElement('span');
      span.className = `tag-pill ${isShared ? 'shared' : ''}`;
      span.textContent = t;
      partnerTagsContainer.appendChild(span);
    });

    // Configure Connect button in compatibility view
    const compatBtn = document.querySelector('.compat-cta-sticky .btn-primary');
    compatBtn.setAttribute('onclick', `triggerConnect('${profile.id}')`);

    switchView('view-compatibility');
  }
}

function backToDiscovery() {
  switchView('view-discovery');
}

// --- MATCH EVENTS & CONNECT OVERLAYS ---
let pendingMatchId = '';

function triggerConnect(profileId) {
  const profile = simulatedProfiles.find(p => p.id === profileId);
  if (!profile) return;

  pendingMatchId = profileId;

  if (profileId === 'priya') {
    appState.hasMatchedWithPriya = true;
    
    // Configure overlay details
    document.getElementById('match-popup-avatar').src = profile.image;
    document.getElementById('match-alert-desc').textContent = `You and Priya both want to travel to Bali in December!`;

    // Show Match popup overlay
    const overlay = document.getElementById('match-overlay');
    overlay.classList.remove('hidden');

    // Run Confetti
    runMatchConfetti();
  } else {
    // Arjun or Sarah matching behavior (simple alerts/chats)
    alert(`Connection request sent to ${profile.name}! You will receive a chat notification once they accept.`);
    renderCardStack();
    switchView('view-discovery');
  }
}

function triggerConnectFromCompat() {
  triggerConnect(pendingMatchId || 'priya');
}

function dismissMatchOverlay() {
  document.getElementById('match-overlay').classList.add('hidden');
  renderCardStack();
  switchView('view-discovery');
}

function goToMatchedChat() {
  document.getElementById('match-overlay').classList.add('hidden');
  
  // Set up chat details
  const profile = simulatedProfiles.find(p => p.id === 'priya');
  document.getElementById('chat-header-avatar').src = profile.image;
  document.getElementById('chat-header-name').textContent = profile.name;
  document.getElementById('chat-header-subtext').textContent = `Matched for ${profile.destination} - ${profile.dates} ✈️`;

  // Dynamically set system badge message text for this destination
  document.getElementById('chat-match-system-badge').innerHTML = `
    <p>✈️ You matched for ${profile.destination} same week · similar travel interests</p>
  `;
  
  // Initialize chat messages
  appState.chatMessages = [];
  
  // Clear bubble area
  document.getElementById('chat-flow-area').innerHTML = '';

  // Show badge dot for Messages tab
  document.getElementById('chat-unread-dot').classList.remove('hidden');

  switchView('view-chat');
  
  // Preload Figma screenshot transcript messages sequentially
  setTimeout(() => {
    appendMessageBubble('priya', `Hey! So excited about this ${profile.destination} trip 🌴 Are you going solo?`, '10:32');
    scrollToBottom();
  }, 300);

  setTimeout(() => {
    appendMessageBubble('user', `Yes, solo traveler! First time in ${profile.destination}. You?`, '10:34');
    scrollToBottom();
  }, 700);

  setTimeout(() => {
    appendMessageBubble('priya', `Same! I've been wanting to explore the local food scene — not just the tourist spots.`, '10:35');
    scrollToBottom();
  }, 1100);
}

// --- CONFETTI ANIMATION ---
function runMatchConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';

  const colors = ['#FE3C72', '#FF655B', '#FFFFFF', '#FFD60A', '#00D3A9'];
  const confettiCount = 80;

  for (let i = 0; i < confettiCount; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Random sizes
    const w = Math.random() * 8 + 4;
    piece.style.width = `${w}px`;
    piece.style.height = `${Math.random() * 12 + 6}px`;
    
    // Position
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = `-20px`;
    
    // Animation properties
    const duration = Math.random() * 2 + 2.5;
    const delay = Math.random() * 1.5;
    piece.style.animation = `confetti-fall ${duration}s linear ${delay}s infinite`;
    
    // Random rotation
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    container.appendChild(piece);
  }
}

// Add CSS keyframe rule dynamically for confetti fall
if (!document.getElementById('confetti-keyframes')) {
  const style = document.createElement('style');
  style.id = 'confetti-keyframes';
  style.innerHTML = `
    .confetti-piece {
      position: absolute;
      opacity: 0.8;
      z-index: 100;
      pointer-events: none;
    }
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(850px) rotate(720deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// --- CHAT SYSTEM LOGIC (Simulated conversation) ---
function sendChatMessage() {
  const input = document.getElementById('input-chat-text');
  const text = input.value.trim();
  if (!text) return;

  // Add bubble to logs
  appendMessageBubble('user', text);
  input.value = '';

  // Scroll to bottom
  scrollToBottom();

  // Hide starters panel after user starts typing
  document.getElementById('suggested-starters-pills').classList.add('hidden');

  // Trigger reply simulation
  triggerBotReply(text);
}

function sendSuggestedStarter(btnEl) {
  const text = btnEl.textContent.replace(/"/g, ''); // strip quotes
  appendMessageBubble('user', text);
  
  // Hide starters panel
  document.getElementById('suggested-starters-pills').classList.add('hidden');

  // Scroll to bottom
  scrollToBottom();

  // Trigger reply
  triggerBotReply(text);
}

function handleChatEnter(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

function appendMessageBubble(sender, text, timestamp) {
  const chatFlow = document.getElementById('chat-flow-area');
  const wrap = document.createElement('div');
  wrap.className = `chat-bubble-wrap ${sender === 'user' ? 'outgoing' : 'incoming'}`;

  let avatarHTML = '';
  if (sender !== 'user') {
    avatarHTML = `<img src="assets/priya_profile.jpg" alt="Priya" class="chat-bubble-avatar">`;
  }

  // Set default timestamp if not provided
  if (!timestamp) {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    hours = hours % 12;
    hours = hours ? hours : 12;
    timestamp = `${hours}:${minutes}`;
  }

  wrap.innerHTML = `
    ${avatarHTML}
    <div class="chat-bubble-group">
      <div class="chat-bubble">
        ${text}
      </div>
      <div class="chat-timestamp">${timestamp}</div>
    </div>
  `;

  chatFlow.appendChild(wrap);
  appState.chatMessages.push({ sender, text, timestamp });
}

function receiveMessage(sender, text) {
  // Sound vibration mockup
  if (navigator.vibrate) {
    navigator.vibrate(60);
  }
  
  appendMessageBubble(sender, text);
  scrollToBottom();

  // Alert tabs messages notification badge
  if (appState.activeView !== 'view-chat') {
    document.getElementById('chat-unread-dot').classList.remove('hidden');
  }
}

function triggerBotReply(userText) {
  // Show typing indicator
  const indicator = document.getElementById('typing-indicator');
  indicator.classList.remove('hidden');
  scrollToBottom();

  // Formulate response context
  let replyText = "";
  const query = userText.toLowerCase();

  setTimeout(() => {
    // Hide typing indicator
    indicator.classList.add('hidden');

    if (query.includes('explore') || query.includes('plan') || query.includes('bali')) {
      replyText = "I really want to check out Ubud first—mostly for the temples, local craft markets, and checking out Tegalalang. Then I want to head down south to Uluwatu for the cliffside views and sunset. How about you? Are you more into adventure or chilling on beaches?";
    } else if (query.includes('solo')) {
      replyText = "Yes, traveling solo! I've done it in Europe before, but this is my first time in Southeast Asia. I love the freedom of setting my own pace, but it's always great to find someone to grab food or split local driver costs with.";
    } else if (query.includes('food') || query.includes('spot') || query.includes('eat')) {
      replyText = "Oh, absolutely! I've read about a few traditional warungs serving Nasi Campur and Babi Guling in Ubud. Let's definitely explore a food spot together! Maybe we can meet up on the 13th?";
    } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      replyText = "Hey! Great to chat. I was just mapping out my itinerary. Have you decided on where you're staying yet?";
    } else {
      replyText = "That sounds amazing! I'm really glad we connected. I want to keep the schedule somewhat flexible but having a companion for day trips would be awesome. Are you up for exploring some waterfalls?";
    }

    receiveMessage('priya', replyText);
  }, 1800);
}

function scrollToBottom() {
  const container = document.getElementById('chat-messages-container');
  container.scrollTop = container.scrollHeight;
}

// --- SAFETY SHEETS & DIALOGS ---
function toggleSafetyPanel() {
  const panel = document.getElementById('safety-panel');
  panel.classList.toggle('hidden');
}

function showSafetyDialog() {
  toggleSafetyPanel();
}

function triggerSafetyAction(action) {
  if (action === 'report') {
    const reason = prompt("Please select a reason for reporting:\n1. Commercial/Spam\n2. Harassment/Inappropriate\n3. Fake Profile\n4. Other");
    if (reason) {
      alert("Thank you. We have received your report and our Trust & Safety team will review this user profile within 24 hours.");
      toggleSafetyPanel();
    }
  } else if (action === 'block') {
    const confirmBlock = confirm("Are you sure you want to block this user? They will not be able to contact you and they will disappear from your travel feed.");
    if (confirmBlock) {
      alert("User blocked successfully.");
      toggleSafetyPanel();
      switchView('view-discovery');
    }
  } else if (action === 'safety-center') {
    alert("Navigating to Tinder Safe Travel Center:\n\n- Local emergency numbers pre-loaded\n- Live support agents online\n- Destination-specific safety briefings (Bali: scooter safety, local laws)");
    toggleSafetyPanel();
  }
}

// --- SYSTEM HELPERS ---
function updateMockClock() {
  const timeEl = document.getElementById('status-time');
  if (!timeEl) return;
  
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Format for display
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  timeEl.textContent = `${hours}:${minutes}`;
}

// --- DYNAMIC PROFILE ADJUSTER ---
function updateProfilesForDestination(destination) {
  const cleanDest = destination.split(',')[0].trim(); // e.g. "Bali", "Tokyo", "Paris"

  // Find destination config
  const destInfo = destinationList.find(d => d.code.toLowerCase() === cleanDest.toLowerCase()) || destinationList[0];

  // Update Priya (profile 0)
  const priya = simulatedProfiles.find(p => p.id === 'priya');
  if (priya) {
    priya.destination = destInfo.code;
    priya.whyMatch[0] = `Same destination (${destInfo.name})`;
    
    // Change pictures according to city
    if (destInfo.code === 'Tokyo') {
      priya.image = 'assets/tokyo_priya.jpg';
    } else if (destInfo.code === 'Paris') {
      priya.image = 'assets/paris_priya.jpg';
    } else {
      priya.image = 'assets/priya_profile.jpg'; // default Bali/others
    }
  }

  // Update Arjun/Kenji/Pierre (profile 1)
  const host = simulatedProfiles.find(p => p.id === 'arjun');
  if (host) {
    host.location = destInfo.name;
    
    // Change host identity & pictures according to city
    if (destInfo.code === 'Tokyo') {
      host.name = 'Kenji';
      host.image = 'assets/tokyo_host.jpg';
    } else if (destInfo.code === 'Paris') {
      host.name = 'Pierre';
      host.image = 'assets/paris_host.jpg';
    } else if (destInfo.code === 'New York') {
      host.name = 'John';
      host.image = 'assets/arjun_profile.jpg';
    } else if (destInfo.code === 'Sydney') {
      host.name = 'Liam';
      host.image = 'assets/arjun_profile.jpg';
    } else {
      host.name = 'Arjun';
      host.image = 'assets/arjun_profile.jpg'; // default Bali
    }
  }

  // Update Sarah (profile 2)
  const sarah = simulatedProfiles.find(p => p.id === 'sarah');
  if (sarah) {
    sarah.destination = destInfo.code;
    sarah.whyMatch[0] = `Same destination (${destInfo.name})`;
  }
}

// --- AUTOCOMPLETE DROP SUGGESTIONS INITIALIZATION ---
function initAutocomplete() {
  const inputs = [
    { inputId: 'input-destination', dropdownId: 'suggestions-destination' },
    { inputId: 'input-local-dest', dropdownId: 'suggestions-local' }
  ];

  inputs.forEach(({ inputId, dropdownId }) => {
    const inputEl = document.getElementById(inputId);
    const dropdownEl = document.getElementById(dropdownId);

    if (!inputEl || !dropdownEl) return;

    // Handle input / typing
    inputEl.addEventListener('input', () => {
      const val = inputEl.value.trim().toLowerCase();
      
      if (!val) {
        dropdownEl.innerHTML = '';
        dropdownEl.classList.add('hidden');
        return;
      }

      // Filter matches
      const matches = destinationList.filter(d => 
        d.name.toLowerCase().includes(val) || 
        d.code.toLowerCase().includes(val)
      );

      if (matches.length === 0) {
        dropdownEl.innerHTML = '';
        dropdownEl.classList.add('hidden');
        return;
      }

      // Render suggestions
      dropdownEl.innerHTML = '';
      matches.forEach(match => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `<span>${match.flag}</span> <span>${match.name}</span>`;
        
        // Handle click selection
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          inputEl.value = match.name;
          dropdownEl.classList.add('hidden');
          
          if (inputId === 'input-destination') {
            appState.preferences.destination = match.name;
          } else {
            appState.preferences.destination = match.name;
          }
        });
        
        dropdownEl.appendChild(item);
      });

      dropdownEl.classList.remove('hidden');
    });

    // Handle click outside to close dropdown
    document.addEventListener('click', (e) => {
      if (!e.target.closest(`#${inputId}`) && !e.target.closest(`#${dropdownId}`)) {
        dropdownEl.classList.add('hidden');
      }
    });

    // Input focus opening matches if there is typing
    inputEl.addEventListener('focus', () => {
      const val = inputEl.value.trim().toLowerCase();
      if (val) {
        inputEl.dispatchEvent(new Event('input'));
      }
    });
  });
}

// --- PREMIUM+ MONETIZATION UPGRADE TRIGGER ---
function upgradeToPremiumPlus() {
  // Update state to traveler (Premium)
  appState.preferences.mode = 'traveler';
  
  // Set destination values on the traveler form
  document.getElementById('input-destination').value = appState.preferences.destination;
  
  // Upgrade notification
  alert("🎉 Congratulations! You have successfully upgraded to Tinder Travel Premium+\n\nDiscovery Mode is unlocked! You can now browse global travelers heading to your destination.");
  
  // Re-run completePreferences to initialize traveler state & discovery view
  completePreferences();
}
