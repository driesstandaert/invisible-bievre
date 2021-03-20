
if (typeof AFRAME === 'undefined') {
	throw new Error('Component attempted to register before' +
		'AFRAME was available.');
}

AFRAME.registerComponent('instanced-mesh', {
	schema: {
		src: { type: 'model' }
	},

	init: function () {
		this.loader = new THREE.GLTFLoader()
	},

	update: function () {
		var self = this;
		var el = this.el;

		this.remove();

		this.loader.load(this.data.src,
			function onLoaded(gltfModel) {
				// Expect firt child to be the source mesh
				var mesh = gltfModel.scene.children[0];

				if (mesh.type != 'Mesh') {
					console.error("Expected mesh type as first scene child");
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
				el.emit('model-error', { format: 'gltf', src: self.src });
			});
	},
})