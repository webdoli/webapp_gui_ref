import * as THREE from "three";
export class SceneModel {
    constructor( scene ) {
        this.scene = scene;
        this.objects = [];
        this.selected = null;
        this.changeCallbacks = [];
    }

    addMesh( mesh ) {
        // Add to Three.js scene
        mesh.scale.multiplyScalar(0.05);
        this.scene.add( mesh );
        // Track in model list
        this.objects.push( mesh );
        // Notify change listeners
        this._emit();
    }

    // 테스트용
    addCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        return mesh;
    }

    add( obj ) {
        this.objects.push( obj );
        this._emit();
    }

    select( id ) {
        this.selected = this.objects.find( o => o.id === id ) || null;
        this._emit();
    }

    onChange( cb ) {
        this.changeCallbacks.push( cb );
    }

    _emit() {
        this.changeCallbacks.forEach( cb => cb(this) );
    }
}