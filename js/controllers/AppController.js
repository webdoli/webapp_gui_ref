import { SceneModel } from "../models/SceneModel";
import { ObjectModel } from "../models/ObjectModel";
import { CharacterUploadView } from "../views/CharacterUploadView";
import { ObjectView } from "../views/ObjectsView";
import { TimelineView } from "../views/TimelineView";
import * as THREE from 'three';

export class AppController {
    constructor() {
        //container
        this.propEl = document.getElementById('property');
        this.layerEl = document.getElementById('layer');
        this.viewportEl = document.getElementById('canvas3d');

        //model
        this.sceneModel = new SceneModel();

        //three.js renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.viewportEl });
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth/ window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 5;

        //views
        this.charView = new CharacterUploadView( this.propEl );
        this.ObjView = new ObjectView( this.propEl );
        this.timeline = new TimelineView( this.layerEl );

        //bind toolbar
        document.getElementById('btnChar').addEventListener('click', () => this.showChar() );
        document.getElementById('btnOBjects').addEventListener('click', () => {
            this.showObjects();
            //render loop
            this._animate();
        })
    
    }

    showChar() {
        this.charView.render();
        this.charView.onUpload( file => {
            //얼굴 인식 > mesh 생성
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh( geometry, material );
            const id = Date.now();
            cube.userData.id = id;
            this.scene.add( cube );
            this.sceneModel.add( new ObjectModel( id, 'character', { mesh: cube }));

        })
    }

    showObjects() {

    }

    _animate() {
        requestAnimationFrame(( () => this._animate() ));
        this.renderer.render( this.scene, this.camera );
    }
}