import { SceneModel } from "../models/SceneModel.js";
import { ObjectModel } from "../models/ObjectModel.js";
import { CharacterUploadView } from "../views/CharacterUploadView.js";
import { ObjectView } from "../views/ObjectsView.js";
import { TimelineView } from "../views/TimelineView.js";
import { BottomControlsView } from "../views/BottomControlsView.js";
import * as THREE from 'three';
// import { FaceMesh } from "@mediapipe/face_mesh";

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

        // **조명 추가**
        this.scene.add( new THREE.AmbientLight( 0xffffff, 0.6 ) );
        const dl = new THREE.DirectionalLight( 0xffffff, 0.8 );
        dl.position.set( 0, 0, 1 );
        this.scene.add( dl );

        //model
        this.sceneModel = new SceneModel( this.scene );

        //views
        // 1) ObjectView에 “선택 시 모델 생성” 로직을 콜백으로 넘겨준다.
        this.charView = new CharacterUploadView( this.propEl );
        
        // 업로드 콜백 설정
        this.charView.onUpload( file => this._handleUploadCharacter(file) );

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

    // 파일 → HTMLImageElement 로딩 헬퍼
    _loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    }

    // Mediapipe 분석 + Three.js 메쉬 생성 로직
    async _handleUploadCharacter( file ) {
        console.log('Controller, MediaPipe 분석 실행, 받은 이미지 파일: ', file )
        // 1) HTMLImageElement 로드
        const image = await this._loadImage(file);

        // 2) FaceMesh (UMD) 인스턴스 생성
        const faceMesh = new window.FaceMesh({
            locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`
        });

        faceMesh.setOptions({
            staticImageMode: true,
            maxNumFaces: 1,
            refineLandmarks: false,
            minDetectionConfidence: 0.5,
        });

        // 3) onResults 콜백 등록
        faceMesh.onResults(results => {
            const landmarks = results.multiFaceLandmarks?.[0];
            if (!landmarks) {
                console.warn('얼굴을 찾지 못했습니다.');
                return;
            }
        
            // → 여기서 Three.js 메쉬 생성 로직 실행
            const positions = new Float32Array(landmarks.length * 3);
            landmarks.forEach((pt, i) => {
                positions[i*3+0] = (pt.x - 0.5)*2;
                positions[i*3+1] = -(pt.y - 0.5)*2;
                positions[i*3+2] = -pt.z;
            });
            
            const tess = window.FACEMESH_TESSELLATION;  
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setIndex(tess.flat());
            geometry.computeVertexNormals();
        
            const material = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geometry, material);
            this.sceneModel.addMesh(mesh);
        });
    
        // 4) 결과 리턴 대신 send 호출만
        await faceMesh.initialize?.();  // UMD에서는 필요 없으면 삭제해도 무방
        await faceMesh.send({ image });

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