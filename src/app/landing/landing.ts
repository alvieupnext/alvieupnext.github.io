import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit, OnDestroy {
  currentTime = signal('');
  amPm = signal('');
  currentDate = signal('');
  private timer: any;

  // Audio signals
  tracks = [
    '/01 Wii Menu.mp3',
    '/05 Mii Channel Medley.mp3',
    '/09 Wii Shop Channel.mp3'
  ];
  currentTrack = signal('');
  isPlaying = signal(false);

  @ViewChild('audioPlayer', { static: true }) audioPlayer!: ElementRef<HTMLAudioElement>;

  ngOnInit() {
    this.updateTime();
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000);

    // Set a random track on load
    const randomTrack = this.tracks[Math.floor(Math.random() * this.tracks.length)];
    this.currentTrack.set(randomTrack);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  togglePlay() {
    const audio = this.audioPlayer.nativeElement;
    if (audio.paused) {
      audio.play().then(() => this.isPlaying.set(true)).catch(err => console.log('Autoplay blocked by browser:', err));
    } else {
      audio.pause();
      this.isPlaying.set(false);
    }
  }

  nextTrack() {
    let currentIndex = this.tracks.indexOf(this.currentTrack());
    currentIndex = (currentIndex + 1) % this.tracks.length;
    this.currentTrack.set(this.tracks[currentIndex]);
    
    // Attempt to play the new track automatically if it was already playing,
    // or even if it was paused (like skipping a track on a CD player).
    setTimeout(() => {
      this.audioPlayer.nativeElement.play().then(() => this.isPlaying.set(true)).catch(e => console.log(e));
    }, 50);
  }

  getTrackName() {
    return this.currentTrack().replace('/', '').replace('.mp3', '');
  }

  updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    this.amPm.set('');
    
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    this.currentTime.set(`${hours}:${minutes}`);
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[now.getDay()];
    const date = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    this.currentDate.set(`${dayName} ${date}/${month}`);
  }
}
