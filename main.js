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
      dateEl.innerHTML = `<img src="favicon.jpg" alt="Logo" width="20" height="20" style="border-radius: 4px; object-fit: cover; mix-blend-mode: multiply;" /> ${dayName} ${date}/${month}`;
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
});
