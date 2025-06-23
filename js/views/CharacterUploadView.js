export class CharacterUploadView {
    constructor( container ) {
        this.container = container;
    }

    render( title ) {
        console.log('title: ', title );
        this.container.innerHTML = `
            <div id="property-title">${title}</div>
        `
        this.container.innerHTML += `
            <input type="file" id="charInput" accept="image/*">
        `;
        document.getElementById('charInput').addEventListener('change', e => {
            const file = e.target.files[0];
            if (file) this.onUpload && this.onUpload(file);
        });
    }

    onUpload( cb ) {
        this.onUpload = cb;
    }

    onUpload( cb ) { this.onUpload = cb; }
}