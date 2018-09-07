
const music = ce('audio', body, {
  src: './music.mp3',
  autoplay: true,
  volume: 0.1,
  loop: true
});

ce('button', body, {
  textContent: 'mute music',
  className: 'mute',
  onclick: function(e) {
    music.paused ? music.play() : music.pause();
    this.textContent = music.paused ? 'play music' : 'mute music';
  }
})
