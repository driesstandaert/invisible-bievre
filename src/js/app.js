import '../scss/app.scss';
import 'regenerator-runtime/runtime.js';
import './vendor/howler/howler.min.js';

//////////////////////////
// Init Howler audio files
/////////////////////////

const soundVoiceover = new Howl({
  src: ['./assets/audio/voiceover.mp3'],
  loop: false,
  volume: 1,
  html5: true, // Force to HTML5 so that the audio can stream in. Plays on IOS.
  onend: function () {
    console.log('Sound Finished!');
    const btnPlay = document.querySelector('.js-play__button');
    const overlay = document.querySelector('.js-overlay');
    btnPlay.classList.remove('is-playing');
    overlay.classList.toggle('is-visible');
  }
});

const soundRiver = new Howl({
  src: ['./assets/audio/river.mp3'],
  html5: true, // Force to HTML5 so that the audio can stream in. Plays on IOS.
  loop: true,
  volume: .2
});

const soundBirds = new Howl({
  src: ['./assets/audio/birds.mp3'],
  html5: true, // Force to HTML5 so that the audio can stream in. Plays on IOS.
  loop: true,
  volume: .2
});


window.onload = function () {
  var scene = document.querySelector('a-scene');
  var sky = document.querySelector('.js-sky');
  var river = document.querySelector('.js-river');
  var cloud = document.querySelector('.js-cloud');
  var cloud2 = document.querySelector('.js-cloud2');
  var light = document.querySelector('.js-light');

  var btnMute = document.querySelector('.js-mute__button');
  var btnPlay = document.querySelector('.js-play__button');
  var btnTranscript = document.querySelector('.js-transcript__button');
  var transcript = document.querySelector('.js-transcript');

  var overlay = document.querySelector('.js-overlay');
  var btnClose = document.querySelector('.js-close__button');

  var btnStart = document.querySelector('.js-start__button');
  var landing = document.querySelector('.js-landing');
  var landingContent = document.querySelector('.js-landing-content');

  /////////////////
  // Logo animation
  /////////////////

  function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
  }
  
  const logoSvgCircles = document.querySelectorAll(".js-logo circle");
  let loadinganime = true;

  async function introAnimation () {
  while (loadinganime) {
      var el = Math.floor(Math.random() * logoSvgCircles.length);
      logoSvgCircles[el].classList.toggle("is-visible");
      await timer(5);
    }
  }
  introAnimation();

  btnMute.addEventListener('click', function () {
    this.classList.toggle('is-muted');
    if (this.classList.contains('is-muted')) {
      soundRiver.mute(true)
      soundBirds.mute(true)
      soundVoiceover.mute(true)
    } else {
      soundRiver.mute(false)
      soundBirds.mute(false)
      soundVoiceover.mute(false)
    }
  });

  btnPlay.addEventListener('click', function () {
    this.classList.toggle('is-playing');
    if (this.classList.contains('is-playing')) {
      soundRiver.play();
      soundBirds.play();
      soundVoiceover.play();

    } else {
      soundRiver.pause();
      soundBirds.pause();
      soundVoiceover.pause();
    }
  });

  btnTranscript.addEventListener('click', function () {
    transcript.classList.toggle('is-open');
    this.classList.toggle('is-active');
  });

  btnClose.addEventListener('click', function () {
    overlay.classList.toggle('is-visible');
  });

  btnStart.addEventListener('click', function () {
    landingContent.classList.add('is-hidden');
    btnPlay.classList.add('is-playing');
    loadinganime = false; // intro animation until scene starts
    function playSound () {
      var id1 = soundRiver.play();
      var id2 = soundBirds.play();
      soundRiver.fade(0, .1, 2000, id1);
      soundBirds.fade(0, .1, 2000, id2);
      soundVoiceover.play();
    }
    function fadeInScene () {
      sky.setAttribute('animation__fadein', 'property: material.opacity; from: 1; to: 0; dur: 4000; delay:0');
      cloud.setAttribute('animation__fadein', 'property: material.opacity; from: 0; to: 1; dur: 4000; delay:0');
      cloud2.setAttribute('animation__fadein', 'property: material.opacity; from: 0; to: 1; dur: 4000; delay:0');
      light.setAttribute('animation', 'property: light.intensity; to: .2; dur: 2000; easing: linear; delay:0');
      river.setAttribute('animation', 'property: material.opacity; from: 0; to: .6; dur: 2000; delay:0');
    }

    setTimeout(
      function () {
        // (scene.hasLoaded) ? playSound() : scene.addEventListener('loaded', playSound);
        if (scene.hasLoaded) {
          playSound();
          fadeInScene();
        } else {
          scene.addEventListener('loaded', playSound);
          scene.addEventListener('loaded', fadeInScene);
        }
        landing.classList.remove('is-visible');
      }, 1000
    );
    
  });

  ////////////////////////////
  // Start scene after loading
  ////////////////////////////

  (scene.hasLoaded) ? startScene() : scene.addEventListener('loaded', startScene);

  function startScene () {
    console.log('Models loaded!');
    const loader = document.querySelector(".js-loader");
    const enter = document.querySelector(".js-enter");
    const controls = document.querySelector(".js-controls");
    setTimeout(
      function () {
        loader.classList.remove('is-visible');
        enter.classList.add('is-visible');
        controls.classList.add('is-visible');
      }, 1000
    );
  }
}

