import { SceneModel } from "../models/SceneModel.js";
import { ObjectModel } from "../models/ObjectModel.js";
import { CharacterUploadView } from "../views/CharacterUploadView.js";
import { ObjectView } from "../views/ObjectsView.js";
import { TimelineView } from "../views/TimelineView.js";
import { BottomControlsView } from "../views/BottomControlsView.js";
import * as THREE from 'three';

export class AppController {
    constructor() {
        //container
        this.propEl = document.getElementById('property');
        this.layerEl = document.getElementById('layer');
        this.bottomEl = document.getElementById('bottom');
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
        this.objView = new ObjectView( this.propEl );
        this.timeline = new TimelineView( this.layerEl );
        this.bottomView  = new BottomControlsView(this.bottomEl);

        //bind toolbar  >> 중복되는 코드 정리해야 함
        document.getElementById('btnChar').addEventListener('click', e => {
            const prop = document.getElementById('property');
            const title = e.target.dataset.title;

            // 토글: 숨겨져 있으면 보이기, 보이면 숨기기
            prop.style.display = (prop.style.display === 'none') ? 'block' : 'none';
            // 필요하면 렌더할 뷰 호출
            if (prop.style.display !== 'none') this.charView.render( title );
        });

        document.getElementById('btnObjects').addEventListener('click', e => {
            const title = e.target.dataset.title;
            const prop = document.getElementById('property');
            // 토글: 숨겨져 있으면 보이기, 보이면 숨기기
            prop.style.display = (prop.style.display === 'none') ? 'block' : 'none';
            this.objView.render(this._objectList(), title ); 
            
        });

        // Bottom controls
        this.bottomView.render();
        this.bottomView.onPlay(() => console.log('play'));
        this.bottomView.onSkipBack(() => console.log('back'));
        this.bottomView.onSkipForward(() => console.log('forward'));
        this.bottomView.onZoom(val => console.log('zoom', val));
        this.bottomView.onDownload(() => console.log('download'));
        
        this._animate();
    
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

    _objectList() {
        return [ 
            {id:1,type:'Cube'},
            {id:2,type:'Sphere'},
            {id:3,type:'Cylinder'} 
        ];
    }

    _animate() {
        requestAnimationFrame(( () => this._animate() ));
        this.renderer.render( this.scene, this.camera );
    }
}