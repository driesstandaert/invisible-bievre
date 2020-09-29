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

// ////////////////////
// Create water affect
// ////////////////////

AFRAME.registerComponent('wobble-normal', {
	schema: {},
	tick: function (t) {
    if (!this.el.components.material.material.normalMap) return;
		this.el.components.material.material.normalMap.offset.x += 0.0001 * Math.sin(t/10000);
		this.el.components.material.material.normalMap.offset.y += 0.0001 * Math.cos(t/8000);
		this.el.components.material.material.normalScale.x = 0.5 + 0.5 * Math.cos(t/1000);
		this.el.components.material.material.normalScale.x = 0.5 + 0.5 * Math.sin(t/1200);
	}
})

AFRAME.registerPrimitive('a-ocean-plane', {
	defaultComponents: {
		geometry: {
			primitive: 'plane',
			height: 1000,
			width: 1000
		},
    rotation: '-90 0 0',
		material: {
			shader: 'standard',
			color: '#A3D3D5',
			metalness: 1,
			roughness: 0.1,
			normalMap: 'url(./waternormals.jpg)',
			normalTextureRepeat: '50 50',
			normalTextureOffset: '0 0',
			normalScale: '0.5 0.5',
			opacity: 0 // Start opacity 0. See animation on Start event.
		},
		'wobble-normal': {}
	},
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


