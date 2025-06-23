export class CharacterUploadView {
    constructor( container ) {
        this.container = container;
        this._uploadCb = null;
    }

    render({ title }) {
        
        this.container.textContent = '';
        const frag = document.createDocumentFragment();
        
        // 1) 제목 DOM 추가
        const h3 = document.createElement('div');
        h3.id = 'property-title';
        h3.textContent = title;
        frag.append( h3 );

        // 2) 업로드 래퍼
        const wrapper = document.createElement('div');
        wrapper.className = 'upload-wrapper';

        // 3) 실제 보이는 업로드 영역(label)
        const area = document.createElement('label');
        area.className = 'upload-area';
        area.tabIndex = 0;
        area.innerHTML = `<span>Drag & Drop or Click to Upload</span>`;

        // 4) 숨겨진 file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        // 5) 미리보기 박스
        const preview = document.createElement('div');
        preview.className = 'upload-preview';

        // 6) DOM 조합
        wrapper.append( area, input, preview );
        frag.append( wrapper );
        this.container.append( frag );

        // 클릭 시 file dialog 열기
        area.addEventListener('click', _=> input.click());

        // 키보드 접근성: Enter/Space
        area.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                input.click();
            }
        });

        // 드래그 오버
        area.addEventListener('dragover', e => {
            e.preventDefault();
            area.classList.add('hover');
        });
        
        area.addEventListener('dragleave', e => {
            area.classList.remove('hover');
        });

        area.addEventListener('drop', e => {
            e.preventDefault();
            area.classList.remove('hover');
        
            if (e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                input.dispatchEvent(new Event('change'));
            }
        });


        // 파일 선택 / 드롭 후
        input.addEventListener('change', async e => {
            const file = e.target.files[0];
            if (!file) return;

            // 로딩 인디케이터 켜기
            area.classList.add('loading');
            preview.textContent = '';

            // 이미지 읽기
            const imgURL = URL.createObjectURL(file);
            const img = document.createElement('img');
            img.src = imgURL;

            // 로드 완료 후 미리보기
            img.onload = () => {
                URL.revokeObjectURL(imgURL);
                area.classList.remove('loading');
                preview.append(img);
            };

            // 콜백 호출 (미래에 mediapipe 분석 등)
            if (this._uploadCb) {
                this._uploadCb(file);
            }
        });

    }

    onUpload( cb ) {
        this.onUpload = cb;
    }

    onUpload( cb ) { this.onUpload = cb; }
}