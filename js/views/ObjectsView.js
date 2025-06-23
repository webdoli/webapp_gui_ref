export class ObjectView {
    constructor( container ) {
        this.container = container;
        this.itemsPerpage = 5;
        this.page = 1;
    }

    render( list ) {
        const start = ( this.page - 1 )*this.itemsPerpage;
        const pageItems = list.slice( start, start + this.itemsPerpage );
        this.container.innerHTML = pageItems.map( o => `
                <div class="object-item" data-id="${o.id}"> ${o.type}</div>
            `).join('') + `<div class="pagination"> Page ${this.page} </div>`;
        
        this.container.querySelectorAll('.object-item')
            .forEach( el => el.addEventListener( 'dblclick', e => this.onSelect(+el.dataset.id)));
    }

    onSelect( cb ) {
        this.onSelect = cb;
    }

    onSelect( cb ) { this.onSelect = cb; }
}