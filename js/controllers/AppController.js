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


        //three.js renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.viewportEl });
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#31313c')
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth/ window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 5;

        //model
        this.sceneModel = new SceneModel( this.scene );

        //views
        // 1) ObjectView에 “선택 시 모델 생성” 로직을 콜백으로 넘겨준다.
        this.charView = new CharacterUploadView( this.propEl );
        this.objView = new ObjectView( 
            this.propEl,
            this._handleObjectSelect.bind(this)   // ← 콜백 바인딩 
        );
        this.timeline = new TimelineView( this.layerEl );
        this.bottomView  = new BottomControlsView(this.bottomEl);

        const property_list = {
            'btnChar': this.charView,
            'btnObjects': this.objView,
        }

        //bind toolbar  >> 중복되는 코드 정리해야 함        
        let toolbar_btns = document.querySelectorAll('.toolbar-btn');

        toolbar_btns.forEach( btn => {
            btn.addEventListener('click', e => {
                const prop = this.propEl;
                const title = e.currentTarget.dataset.title;
                const id = e.currentTarget.id;

                const wasHidden = window.getComputedStyle(prop).display === 'none';
                prop.style.display = wasHidden ? 'block' : 'none';

                if (wasHidden) {
                    // 이제 막 보이게 되었으니 실행
                    property_list[id].render({
                        title: title,
                        list: this._objectList?.() || []
                    });
                }

            });
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

    // 3) ObjectsView에서 더블클릭 시 호출될 메서드
    _handleObjectSelect(id) {
        switch (id) {
            case 1: 
                this.sceneModel.addCube(); 
                break;
            case 2: 
                this.sceneModel.addSphere(); 
                break;
            case 3: 
                this.sceneModel.addCylinder(); 
                break;
        }
      // SceneModel 내부에서 this.scene.add(mesh)까지 처리한다고 가정
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