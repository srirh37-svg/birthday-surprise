// Comprehensive Audio Manager for Birthday Experience

import CONFIG from './config.js';

class AudioManager {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.volume = 0.5;
    this.isPlaying = false;
    this.isMuted = !CONFIG.musicEnabled;
    this.currentTrack = null;
    this.fadeInterval = null;

    this.tracks = {
      welcome: '/assets/music/welcome.mp3',
      cake: '/assets/music/cake.mp3',
      memories: '/assets/music/memories.mp3',
      letter: '/assets/music/letter.mp3'
    };

    // Attach end/error safety listeners
    this.audioElement.addEventListener('ended', () => {
      if (!this.audioElement.loop) {
        this.isPlaying = false;
      }
    });
  }

  playTrack(trackKey, targetVolume = 0.5, fadeDuration = 500) {
    const src = this.tracks[trackKey];
    if (!src) return;

    // If same track is already playing, do nothing
    if (this.currentTrack === trackKey && this.isPlaying) {
      return;
    }

    // Stop current playing audio immediately before starting new track (Rule 5: Only one track plays at a time)
    if (this.audioElement.src && this.isPlaying) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }

    this.currentTrack = trackKey;
    this.audioElement.src = src;
    this.audioElement.load();
    this.audioElement.loop = true;
    this.audioElement.muted = this.isMuted;

    if (!this.isMuted) {
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.fadeIn(targetVolume, fadeDuration);
          })
          .catch(err => {
            console.warn('[AudioManager] Playback deferred until user interaction:', err);
          });
      }
    }
  }

  play() {
    if (this.audioElement.src && !this.isMuted) {
      this.audioElement.play().then(() => {
        this.isPlaying = true;
      }).catch(e => console.warn('[AudioManager] Play error:', e));
    }
  }

  pause() {
    if (this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    }
  }

  stop(fadeDuration = 1000, callback) {
    if (!this.isPlaying && this.audioElement.paused) {
      this.audioElement.currentTime = 0;
      this.currentTrack = null;
      if (callback) callback();
      return;
    }

    this.fadeOut(fadeDuration, () => {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isPlaying = false;
      this.currentTrack = null;
      if (callback) callback();
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audioElement.muted = this.isMuted;

    if (!this.isMuted && !this.isPlaying && this.currentTrack) {
      this.play();
    }

    return this.isMuted;
  }

  setVolume(vol) {
    const validVol = Math.max(0, Math.min(1, parseFloat(vol)));
    this.audioElement.volume = validVol;
  }

  setLoop(loop) {
    this.audioElement.loop = !!loop;
  }

  fadeIn(targetVol = 0.5, duration = 500) {
    clearInterval(this.fadeInterval);
    this.audioElement.volume = 0;
    const step = targetVol / (duration / 50);

    this.fadeInterval = setInterval(() => {
      if (this.audioElement.volume + step >= targetVol) {
        this.audioElement.volume = targetVol;
        clearInterval(this.fadeInterval);
      } else {
        this.audioElement.volume += step;
      }
    }, 50);
  }

  fadeOut(duration = 1000, callback) {
    clearInterval(this.fadeInterval);
    const startVol = this.audioElement.volume;
    if (startVol <= 0) {
      if (callback) callback();
      return;
    }

    const step = startVol / (duration / 50);

    this.fadeInterval = setInterval(() => {
      if (this.audioElement.volume - step <= 0) {
        this.audioElement.volume = 0;
        clearInterval(this.fadeInterval);
        if (callback) callback();
      } else {
        this.audioElement.volume -= step;
      }
    }, 50);
  }
}

export const audioManager = new AudioManager();
export default audioManager;
