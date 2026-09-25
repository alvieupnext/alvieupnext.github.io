document.addEventListener('DOMContentLoaded', () => {
  // Clock
  const timeEl = document.querySelector('.footer-time');
  const ampmEl = document.querySelector('.footer-ampm');
  const dateEl = document.querySelector('.footer-date');

  function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    if(ampmEl) ampmEl.textContent = ''; // 24h
    
    const minutes = now.getMinutes().toString().padStart(2, '0');
    if(timeEl) timeEl.textContent = `${hours}:${minutes}`;
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[now.getDay()];
    const date = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    if(dateEl) {
      dateEl.innerHTML = `<img src="/favicon.jpg" alt="Logo" width="20" height="20" style="border-radius: 4px; object-fit: cover; mix-blend-mode: multiply;" /> ${dayName} ${date}/${month}`;
    }
  }

  updateTime();
  setInterval(updateTime, 1000);

  // Audio Player
  const audioPlayer = document.getElementById('audioPlayer');
  if(!audioPlayer) return;

  const tracks = [
    '/01 Wii Menu.mp3',
    '/25 Mii Channel (Normal).mp3',
    '/09 Wii Shop Channel.mp3'
  ];

  let currentTrackIndex = Math.floor(Math.random() * tracks.length);
  let isPlaying = false;

  const trackNameMarquee = document.getElementById('trackName');
  const playBtn = document.getElementById('playBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  const playIcon = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  const pauseIcon = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

  function updateTrackDisplay() {
    const track = tracks[currentTrackIndex];
    audioPlayer.src = track;
    trackNameMarquee.textContent = '♪ ' + track.replace('/', '').replace('.mp3', '');
  }

  updateTrackDisplay();

  audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    playBtn.innerHTML = pauseIcon;
  });

  audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    playBtn.innerHTML = playIcon;
  });

  playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play().catch(e => console.log('Autoplay blocked:', e));
    } else {
      audioPlayer.pause();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    updateTrackDisplay();
    setTimeout(() => {
      audioPlayer.play().catch(e => console.log(e));
    }, 50);
  });

  // Dynamic Paper Scroll Text
  const paperScrollText = document.querySelector('.paper-scroll-text');
  if (paperScrollText && typeof papersData !== 'undefined') {
    const sortedPapers = [...papersData].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortedPapers.length > 0) {
      paperScrollText.textContent = sortedPapers[0].title;
    }
  }

  // Clear localStorage for testing (session-based or via ?reset/?clear query param)
  try {
    if (!sessionStorage.getItem('wii_test_cleared') || window.location.search.includes('clear') || window.location.search.includes('reset')) {
      localStorage.clear();
      sessionStorage.setItem('wii_test_cleared', 'true');
    }
  } catch(e) {
    console.warn('Storage clear error:', e);
  }

  // Global helper for console testing
  window.clearStorageAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      location.reload();
    } catch(e) {}
  };

  // Update Notification Banner for New Users
  const banner = document.getElementById('wiiNotificationBanner');
  if (banner && typeof updatesData !== 'undefined' && updatesData.length > 0) {
    const sortedUpdates = [...updatesData].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestUpdate = sortedUpdates[0];

    const updateTime = new Date(latestUpdate.date).getTime();
    const now = Date.now();
    const diffMs = now - updateTime;
    const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
    const isWithinOneMonth = diffMs >= 0 && diffMs <= ONE_MONTH_MS;

    const seenKey = 'wii_seen_update_' + latestUpdate.id;
    let hasSeen = false;
    try {
      hasSeen = localStorage.getItem(seenKey) === 'true';
    } catch(e) {
      console.warn('LocalStorage not available:', e);
    }

    // Show notification every time (configured via if clause)
    const showEveryTime = true;

    if (showEveryTime || (!hasSeen && isWithinOneMonth)) {
      const bannerMessage = document.getElementById('bannerMessage');
      const bannerScrollContainer = document.getElementById('bannerScrollContainer');
      const bannerCloseBtn = document.getElementById('bannerCloseBtn');
      const bannerTextLink = document.getElementById('bannerTextLink');

      const flavorTexts = [
        "For Your Information:",
        "This Just In:",
        "That Just Happened:",
        "Not that you'd asked, but:",
        "I wanted to share that:"
      ];
      const flavor = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];

      if (bannerMessage) {
        bannerMessage.innerHTML = `<span class="banner-flavor">${flavor}</span><span class="banner-text-content">${latestUpdate.message}</span>`;
      }

      banner.style.display = 'block';

      // Measure and apply scroll if text overflows the single-line container
      function checkBannerScroll() {
        if (!bannerScrollContainer || !bannerMessage) return;
        bannerMessage.classList.remove('can-scroll');
        bannerScrollContainer.classList.remove('has-overflow');
        bannerMessage.style.removeProperty('--scroll-distance');
        bannerMessage.style.removeProperty('--ticker-duration');

        const containerWidth = bannerScrollContainer.clientWidth;
        const textWidth = bannerMessage.scrollWidth;

        if (textWidth > containerWidth) {
          const overflow = textWidth - containerWidth;
          const scrollDistance = overflow + 16;
          const duration = Math.max(5, scrollDistance / 35);
          bannerMessage.style.setProperty('--scroll-distance', `-${scrollDistance}px`);
          bannerMessage.style.setProperty('--ticker-duration', `${duration}s`);
          bannerMessage.classList.add('can-scroll');
          bannerScrollContainer.classList.add('has-overflow');
        }
      }

      setTimeout(checkBannerScroll, 60);
      window.addEventListener('resize', checkBannerScroll);

      // Fade out after 4 seconds
      let dismissTimeout = null;

      function dismissBanner() {
        banner.classList.add('closing');
        try {
          localStorage.setItem(seenKey, 'true');
        } catch(e) {}
        setTimeout(() => {
          banner.style.display = 'none';
          banner.classList.remove('closing');
        }, 350);
      }

      function startDismissTimer() {
        clearTimeout(dismissTimeout);
        dismissTimeout = setTimeout(() => {
          dismissBanner();
        }, 4000);
      }

      startDismissTimer();

      // Pause 4s timer while hovered, resume when mouse leaves
      banner.addEventListener('mouseenter', () => {
        clearTimeout(dismissTimeout);
      });

      banner.addEventListener('mouseleave', () => {
        startDismissTimer();
      });

      if (bannerCloseBtn) {
        bannerCloseBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          clearTimeout(dismissTimeout);
          dismissBanner();
        });
      }

      if (bannerTextLink) {
        bannerTextLink.addEventListener('click', () => {
          try {
            localStorage.setItem(seenKey, 'true');
          } catch(e) {}
        });
      }
    }
  }
});

