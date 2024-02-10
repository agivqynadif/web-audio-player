import './style.css';
import { convertTime } from './utils';

// If window.AudioContext return undefined or null, then use window.webkitAudioContext
const AudioContext = window.AudioContext ?? window.webkitAudioContext;
const audioCtx = new AudioContext();

const audioElement = document.getElementById('audio');
const playBtn = document.getElementById('playbtn');
const volumeSlider = document.getElementById('volume');
const seeker = document.getElementById('seeker');
const time = document.getElementById('time');
const duration = document.getElementById('duration');

const audioSource = audioCtx.createMediaElementSource(audioElement);

window.addEventListener('load', () => {
  time.textContent = convertTime(audioElement.currentTime);
  duration.textContent = convertTime(audioElement.duration);
});

playBtn.addEventListener('click', (event) => {
  const targetEl = event.target;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (targetEl.getAttribute('class') == 'paused') {
    audioElement.play();
    targetEl.setAttribute('class', 'playing');
  } else if (targetEl.getAttribute('class') == 'playing') {
    audioElement.pause();
    targetEl.setAttribute('class', 'paused');
  }
});

audioElement.addEventListener('ended', () => {
  playBtn.setAttribute('class', 'paused');
});

audioElement.addEventListener('timeupdate', () => {
  seeker.value = audioElement.currentTime;
  time.textContent = convertTime(audioElement.currentTime);
});

seeker.setAttribute('max', audioElement.duration);

seeker.addEventListener('input', () => {
  audioElement.currentTime = seeker.value;
});
const gainNode = audioCtx.createGain();

volumeSlider.addEventListener('input', () => {
  gainNode.gain.value = volumeSlider.value;
});

audioSource.connect(gainNode).connect(audioCtx.destination);
