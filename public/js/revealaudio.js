Reveal.initialize({
  controls: false,
  progress:   true,
  center:     true,
  transition: 'slide',
  slideNumber: true,
  help: true,
});
Reveal.addEventListener('autoslidepaused', function(ev) {
  document.getElementById('amtag').pause();
});
Reveal.addEventListener('autoslideresumed', function(ev) {
  resumeAudio();
});

function resumeAudio() {
  var slideNum = Reveal.getIndices().h
  var ae = document.getElementById('amtag');
  ae.currentTime = slideNum>0?(cues[slideNum-1]):0;
  document.getElementById('amtag').play();
}

audioControl = document.getElementById('audiocontrol');
audioControl.addEventListener('click', function(ev) {
  var ae = document.getElementById('amtag');
  if (ae.paused) {
    resumeAudio()
  } else {
    ae.pause()
  }
})

