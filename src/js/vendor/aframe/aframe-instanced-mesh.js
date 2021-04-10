
if (typeof AFRAME === 'undefined') {
   throw new Error('Component attempted to register before' +
      'AFRAME was available.');
}

AFRAME.registerComponent('instanced-mesh', {
   schema: {
      src: { type: 'model' },
      refName: { type: 'string' } // Name of the reference object that holds the instanced mesh
   },

   init: function () {
      this.loader = new THREE.GLTFLoader()
   },

   update: function () {
      var self = this;
      this.remove();

      this.loader.load(self.data.src,
         function onLoaded(gltfModel) {

            var mesh;
            if (self.data.refName) {
               // Try to find the ref at the first level of the scene
               let refObject = gltfModel.scene.children.find(element => element.name == self.data.refName);
               if (!refObject) {
                  console.warn("refName " + self.data.refName + " object not found")
               }
               else if (refObject.type != "Mesh") {
                  console.warn("refName " + self.data.refName + " object is not a mesh")
               }
               else {
                  mesh = refObject;
               }
            }

            if (!mesh) {
               // Default to first child
               mesh = gltfModel.scene.children[0];
            }

            if (!mesh || mesh.type != 'Mesh') {
               console.error("No mesh found");
               return;
            }

            if (!mesh.geometry) {
               console.error("Mesh has missing geometry");
               return;
            }

            // Gather instances that have the same mesh
            var instances = new Array();
            gltfModel.scene.children.forEach(child => {
               if (child.type == 'Mesh' && child.geometry == mesh.geometry) {
                  instances.push(child);
               }
            });

            // Create the instanced mesh
            self.geometry = (new THREE.InstancedBufferGeometry()).copy(mesh.geometry);
            self.material = mesh.material.clone();
            self.geometry.maxInstancedCount = instances.length;
            self.instancedMesh = new THREE.InstancedMesh(self.geometry, self.material, instances.length);

            // TODO: recalculate correct bounds. For now, simply dissable frustumCulling.
            self.instancedMesh.frustumCulled = false;

            // Fill the matrices
            var i;
            for (i = 0; i < instances.length; ++i) {
               var matrix = new THREE.Matrix4();
               matrix.compose(instances[i].position, instances[i].quaternion, instances[i].scale);
               self.instancedMesh.setMatrixAt(i, matrix);
            }

            self.el.setObject3D('mesh', self.instancedMesh);
            self.el.emit('model-loaded', { format: 'gltf', model: self.instancedMesh });
         },
         undefined /* onProgress */,
         function onFailed(error) {
            var message = (error && error.message) ? error.message : 'Unkown error';
            console.error(message);
            self.el.emit('model-error', { format: 'gltf', src: self.src });
         });
   },
})