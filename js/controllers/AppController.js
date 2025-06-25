import { SceneModel } from "../models/SceneModel.js";
import { ObjectModel } from "../models/ObjectModel.js";
import { CharacterUploadView } from "../views/CharacterUploadView.js";
import { ObjectView } from "../views/ObjectsView.js";
import { AssetLoader } from "../loaders/AssetLoader.js";
import { TimelineView } from "../views/TimelineView.js";
import { BottomControlsView } from "../views/BottomControlsView.js";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { FaceMesh, FACEMESH_TESSELATION  } from '@mediapipe/face_mesh';
import { TRIANGULATION } from "../lib/triangulation.js";
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';


export class AppController {
    constructor() {
        
        //container
        this.propEl = document.getElementById('property');
        this.layerEl = document.getElementById('layer');
        this.bottomEl = document.getElementById('bottom');
        this.viewportEl = document.getElementById('canvas3d');

        //three.js renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.viewportEl,
            antialias: true
        });

        // 디바이스 픽셀 비율 설정 (고DPI 대응)
        this.renderer.setPixelRatio( window.devicePixelRatio );
        // 3) 렌더러 사이즈를 실제 화면 크기 맞춤
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#31313c')
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth/ window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 5;

        // **조명 추가**
        this.scene.add( new THREE.AmbientLight( 0xffffff, .6 ) );
        const dl = new THREE.DirectionalLight( 0xffffff, .6 );
        dl.position.set( 0, 0, 5 );
        this.scene.add( dl );

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        const grid = new THREE.GridHelper( 10, 10 );
        this.scene.add( grid );

        this.transformControls = new TransformControls( this.camera, this.renderer.domElement );
        this.scene.add( this.transformControls );

        // transform 상태일 때 OrbitControls 가 방해하지 않도록 토글
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.controls.enabled = !event.value;
        });

        // 윈도우 리사이즈 대응
        window.addEventListener('resize', () => {
            // 화면 크기 변화에 맞춰 카메라 비율 업데이트
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            // 렌더러 크기도 다시 맞춰줍니다
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        //model
        this.sceneModel = new SceneModel( this.scene );
        this.assetLoader = new AssetLoader();

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
        const faceMesh = new FaceMesh({
            locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`
        });

        // 옵션 설정
        faceMesh.setOptions({
            staticImageMode:true,
            maxNumFaces:1,
            refineLandmarks:false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence:  0.5
        });

        // 3) onResults 콜백 등록
        faceMesh.onResults(results => {
            const landmarks = results.multiFaceLandmarks?.[0];
            if (!landmarks) return;
        
            // → 여기서 Three.js 메쉬 생성 로직 실행
            // 포지션 버퍼 생성
            const positions = new Float32Array(landmarks.length * 3);
            landmarks.forEach((pt, i) => {
                positions[i*3+0] = (pt.x - 0.5)*2;
                positions[i*3+1] = -(pt.y - 0.5)*2;
                positions[i*3+2] = -pt.z;
            });

            // UV 2D코드로 만들기
            const uvs = new Float32Array( landmarks.length * 2 );
            landmarks.forEach((pt,i) => {
              uvs[i*2] = pt.x;
              uvs[i*2 + 1] = 1 - pt.y;
            });
            
            // 토폴로지 인덱스 (삼각형 연결 정보)
            const tess2d = FACEMESH_TESSELATION;
            const indicesFlat = Array.isArray(tess2d[0])
            ? tess2d.flat()
            : tess2d;

            // const indicesFlat = tess2d.flat(); // 2차원 배열임, mesh는 1차원 배열로 만들어야 하므로 .flat()필요없음

            // Three.js 지오메트리 & 메쉬 생성
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
            geometry.setIndex( TRIANGULATION );
            geometry.computeVertexNormals();

            const texture = new THREE.Texture(image);
            texture.needsUpdate = true;

            const material = new THREE.MeshBasicMaterial({
                map:  texture,
                side: THREE.DoubleSide, 
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.frustumCulled = false;         // disable culling in case bounds are odd
            this.sceneModel.addMesh(mesh);

            const wireGeo = new THREE.WireframeGeometry( geometry );
            const wireMat = new THREE.LineBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.5,
                depthTest: false     // 텍스처 메쉬 위에 항상 보이게
            });

            const wireframe = new THREE.LineSegments( wireGeo, wireMat );
            this.sceneModel.addMesh( wireframe );
            

            // Reframe camera
            geometry.computeBoundingSphere();
            const { center, radius } = geometry.boundingSphere;
            this.camera.position.set(center.x, center.y, center.z + radius * 5);
            this.camera.lookAt(center);
            this.controls.update();

        });
    
        // 정적 이미지 한 번 처리
        await faceMesh.send({ image });

    }


    // 3) ObjectsView에서 더블클릭 시 호출될 메서드
    async _handleObjectSelect(url) {
        try {
            const model3d = await this.assetLoader.load(url);
            model3d.scale.multiplyScalar(0.2);
            this.sceneModel.addMesh(model3d);

            const lastAdded = this.sceneModel.objects.slice(-1)[0]; // 방금 addMesh 한 객체
            // 또는 load 콜백에서 gltf.scene 을 바로 사용해도 OK

            // 1) TransformControls 에 연결
            this.transformControls.attach( lastAdded );

        } catch (err) {
            console.error('모델 로드 중 에러:', err);
        }
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
        this.controls.update();
        this.renderer.render( this.scene, this.camera );
    }
}