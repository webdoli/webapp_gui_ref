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

        this.container.innerHTML = `
            <div id="property-title">${title}</div>
            ${ items.map( o =>
                `<div class="object-item" data-id="${o.id}">${o.type}</div>` 
            ).join('')}
            <div class="pagination">Page ${this.page}</div>
        `;

        this.container.querySelectorAll('.object-item')
        .forEach( el => {
            el.addEventListener('dblclick', () => {
                const id = +el.dataset.id;
                console.log('cb:', id);
                this._onSelect(id);
            });
        });
        // this.container.innerHTML += pageItems.map( o => `
        //         <div class="object-item" data-id="${o.id}"> ${o.type}</div>
        //     `).join('') + `<div class="pagination"> Page ${this.page} </div>`;
        
        // this.container.addEventListener('dblclick', (e) => {
        //     this.onSelect(e.target.dataset.id);
        // });
    }

    onSelect( cb ) {
        console.log('cb: ', cb);
        this.onSelect = cb;
    }

}