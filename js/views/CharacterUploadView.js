export class CharacterUploadView {
    constructor( container ) {
        this.container = container;
    }

    render( props ) {
        
        const { title } = props;
        console.log('캐릭터 실행, title: ', title );
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