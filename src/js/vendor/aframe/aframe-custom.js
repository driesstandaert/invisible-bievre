/**
  * Player for animation clips. Intended to be compatible with any model format that supports
  * skeletal or morph animations.
*/
AFRAME.registerComponent('play-all-model-animations', {
  init: function () {
    this.model = null;
    this.mixer = null;

    var model = this.el.getObject3D('mesh');
    if (model) {
      this.load(model);
    } else {
      this.el.addEventListener('model-loaded', function (e) {
        this.load(e.detail.model);
      }.bind(this));
    }
  },

  load: function (model) {
    this.model = model;
    this.mixer = new THREE.AnimationMixer(model);
    this.model.animations.forEach(animation => {
      this.mixer.clipAction(animation, model).play();
    });
  },

  tick: function (t, dt) {
    if (this.mixer && !isNaN(dt)) {
      this.mixer.update(dt / 1000);
    }
  }
});

//////////////////////////////////////
// Show element transparent in AR mode
//////////////////////////////////////

AFRAME.registerComponent('hide-in-ar-mode', {
  // Set this object invisible while in AR mode.
  init: function () {
      this.el.sceneEl.addEventListener('enter-vr', (ev) => {
          this.wasVisible = this.el.getAttribute('visible');
          if (this.el.sceneEl.is('ar-mode')) {
              this.el.setAttribute('visible', false);
          }
      });
      this.el.sceneEl.addEventListener('exit-vr', (ev) => {
          if (this.wasVisible) this.el.setAttribute('visible', true);
          this.el.setAttribute('visible', true);        
      });
  }
});

AFRAME.registerComponent('transparent-in-ar-mode', {
  // Set this object semi transparent while in AR mode. Only images
  init: function () {
      this.el.sceneEl.addEventListener('enter-vr', (ev) => {
          this.wasVisible = this.el.getAttribute('visible');
          if (this.el.sceneEl.is('ar-mode')) {
              this.el.setAttribute('material', 'opacity: 0.2; transparent: true');
          }
      });
      this.el.sceneEl.addEventListener('exit-vr', (ev) => {
          if (this.wasVisible) this.el.setAttribute('visible', true);
          this.el.setAttribute('material', 'opacity: 1; transparent: true');      
      });
  }
});

// ////////////////////////////////////////
// // Loading screen before model is loaded
// ////////////////////////////////////////

// AFRAME.registerComponent('box-loader', {
//   init: function () {
//     this.el.addEventListener('model-loaded', e => {
      
//     });
//   }
// });

// AFRAME.registerComponent("check-if-assets-loaded", {
//   init: function() {
//     var models = document.getElementsByClassName("model");
//     for (i = 0; i < models.length; i++) {
//       console.log(models[i]);
//       models[i].addEventListener("model-loaded",()=>{
//         console.log('model loaded');
//         // if (i = 4 ) {
//           // console.log('Models loaded!');
//           // const loader = document.querySelector(".js-loader");
//           // const enter = document.querySelector(".js-enter");
//           // const controls = document.querySelector(".js-controls");
//           // setTimeout(
//           //   function () {
//           //     loader.classList.remove('is-visible');
//           //     enter.classList.add('is-visible');
//           //     controls.classList.add('is-visible');
//           //   }, 1000
//           // );
//         // };
//       }); 
//     };
//   }
// });

// ////////////////////////////////////////
// // Aframe mirror
// // https://github.com/aalavandhaann/three_reflector
// ////////////////////////////////////////

AFRAME.registerComponent('aframe-mirror', 
{
	schema:{
	    textureOne: {default: undefined},
	    textureTwo: {default: undefined},
	    wrapOne: 
	    {
	    	type: 'vec2',
	    	default: {x: 1, y: 1}
	    },
	    wrapTwo: 
	    {
	    	type: 'vec2',
	    	default: {x: 1, y: 1}
	    },
	    invertedUV:
	    {
	    	type: 'bool',
	    	default: false
	    },
	    textureWidth: {default: 512},
	    textureHeight: {default: 512},
	    color: {default: new THREE.Color(0xe445f8)},
	    intensity: {default: 1.0},
	    blendIntensity: {default: 0.5},
	},
	init: function () 
	{
	    var scene = this.el.sceneEl;
	    var three_scene = scene.object3D;
	    var mirrorObj = this.el.getObject3D('mesh');

	    if(!mirrorObj)
	    {
	    	return;
	    }

	    var gscenereflector = Ashok.GroundSceneReflector(mirrorObj, scene.renderer, three_scene, this.data);
	},
	tick: function () 
	{	    	

	}
});


