import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export class AssetLoader {
    constructor(manager) {
        this.loader = new GLTFLoader(manager);
        // DRACO 압축 해제 로더 설정
        const dracoLoader = new DRACOLoader();
        // 드라코 디코더 파일들이 위치한 경로로 변경하세요 (예: dist/static/draco/)
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        this.loader.setDRACOLoader(dracoLoader);
    }

    load(url) {
        return new Promise((resolve, reject) => {
        this.loader.load(
            url,
            gltf => resolve(gltf.scene),
            xhr => { /* 진행률 표시(optional) */ },
            err => reject(err)
        );
        });
    }
}
