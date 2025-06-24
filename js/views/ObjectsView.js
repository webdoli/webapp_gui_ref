export class ObjectView {
    constructor( container, onSelectCallback ) {
        this.container = container;
        this._onSelect = onSelectCallback;   // ← 두 번째 인자를 받아서 멤버에 저장
        this.itemsPerpage = 5;
        this.page = 1;

        // 외부에서 받은 콜백을 저장
        this._onSelect = onSelectCallback;
    }

    render({ title, list }) {
        const start = ( this.page - 1 )*this.itemsPerpage;
        // const pageItems = list.slice( start, start + this.itemsPerpage );
        const items = list.slice(start, start + this.itemsPerpage);

        const asset_list = {
            'tokyo': 'https://firebasestorage.googleapis.com/v0/b/mogl3d.appspot.com/o/bobapix%2Ftmp%2F01_tokyo_thumb.jpg?alt=media&token=693974e1-6f52-466e-a0a0-587a93fcca9c',
            'game': 'https://firebasestorage.googleapis.com/v0/b/mogl3d.appspot.com/o/bobapix%2Ftmp%2F02_game_thumb.jpg?alt=media&token=dd5b92fa-2d84-4c29-b636-2518be2fe8d7',
            'brick':'https://firebasestorage.googleapis.com/v0/b/mogl3d.appspot.com/o/bobapix%2Ftmp%2F03_brick_thumb.jpg?alt=media&token=21b5d819-75d9-4e55-97ba-a63b49432dd0',
            'razor':'https://firebasestorage.googleapis.com/v0/b/mogl3d.appspot.com/o/bobapix%2Ftmp%2F04_razor_thumb.jpg?alt=media&token=77ad520f-da35-4dde-9fb1-34e9f536cad8',
            'helmet':'https://firebasestorage.googleapis.com/v0/b/mogl3d.appspot.com/o/bobapix%2Ftmp%2F05_helmet_thumb.jpg?alt=media&token=f165aeb1-1861-4ec2-bba5-99415014bde0',
            'stage':'https://firebasestorage.googleapis.com/v0/b/mogl3d.appspot.com/o/bobapix%2Ftmp%2F06_stage_thumb.jpg?alt=media&token=349b7c80-7fb8-4ca5-af7f-85c1d275b4bc',
            'earth':'https://firebasestorage.googleapis.com/v0/b/mogl3d.appspot.com/o/bobapix%2Ftmp%2F07_earth_thumb.jpg?alt=media&token=d8287686-deeb-4239-98c8-cf1611178c2c',
            'vfx':'https://firebasestorage.googleapis.com/v0/b/mogl3d.appspot.com/o/bobapix%2Ftmp%2F08_vfx_thumb.jpg?alt=media&token=723290df-fef0-4ff6-8f74-9d266ea8e1f9',
            'text':'https://firebasestorage.googleapis.com/v0/b/mogl3d.appspot.com/o/bobapix%2Ftmp%2F09_text_thumb.jpg?alt=media&token=14600321-f72f-4fca-8398-9c6ee9b6e1fb',
        }

        const asset_url = {
            'tokyo':'https://firebasestorage.googleapis.com/v0/b/mogl3d.appspot.com/o/bobapix%2Ftmp%2FLittlestTokyo.glb?alt=media&token=6acbb993-051a-4db6-b470-5399a6946810'
        }

        this.container.textContent = '';
        const frag = document.createDocumentFragment();

        // 1) 제목 DOM 추가
        const h3 = document.createElement('div');
        h3.id = 'property-title';
        h3.textContent = title;
        frag.append( h3 );

        // 2) 에셋 래퍼
        const wrapper = document.createElement('div');
        wrapper.className = 'asset-wrapper';

        // 3) 에셋 
        for( let item in asset_list ) {
            const thumb_wrapper = document.createElement('span');
            thumb_wrapper.className = 'thumb-wrapper';
            const thumb = document.createElement('img');
            thumb.className = 'asset-thumb';
            thumb.src = asset_list[item];
            thumb.dataset.asseturl = asset_url[item]; 
            thumb_wrapper.append( thumb );
            wrapper.append( thumb_wrapper );

            thumb.addEventListener('dblclick', (e) => {
                const url = e.target.dataset.asseturl;
                this._onSelect( url );
            })
        }


        // 4) 페이지 생성
        const pageDiv = document.createElement('div');
        pageDiv.className = 'pagination';
        wrapper.append( pageDiv );


        // 5) 조합
        frag.append( wrapper );
        this.container.append( frag );

        // this.container.innerHTML = `
        //     <div id="property-title">${title}</div>
        //     ${ items.map( o =>
        //         `<div class="object-item" data-id="${o.id}">${o.type}</div>` 
        //     ).join('')}
        //     <div class="pagination">Page ${this.page}</div>
        // `;

        

        this.container.querySelectorAll('.object-item')
        .forEach( el => {
            el.addEventListener('dblclick', () => {
                const id = +el.dataset.id;
                console.log('cb:', id);
                this._onSelect(id);
            });
        });
        
    }

    onSelect( cb ) {
        console.log('cb: ', cb);
        this.onSelect = cb;
    }

}