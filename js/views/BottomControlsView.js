export class BottomControlsView {
    constructor( container ) {
        this.container = container;
    }

    render() {
        this.container.innerHTML = `
        <div class="controls">
            <div class="timeline-wrap">
                <span class="icon"><img src="./assets/icons/icons8-timeline-48_grey.png"/></span>
                <input id="timeline-zoom" type="range" min="5" max="47" value="47" step="1" class="rangeslider" autocomplete="off">
                
                <div id="speed">
                    <div id="speed-settings">
                        <div class="speed" data-speed="4">4.0x</div>
                        <div class="speed" data-speed="3">3.0x</div>
                        <div class="speed" data-speed="2">2.0x</div>
                        <div class="speed" data-speed="1.5">1.5x</div>
                        <div class="speed" data-speed="1">1.0x</div>
                        <div class="speed" data-speed="0.5">0.5x</div>
                    </div>
                    <span class="icon"><img src="./assets/icons/icons8-bolt-48_grey.png"/></span>
                    <span id="speed-text">1.0x</span>
                    <span class="icon"><img src="./assets/icons/icons8-up-arrow-48_grey.png"/></span>
                </div>
            </div>

            <div class="playback">
                <div id="current-time"><input readonly value="00:00:00"></div>
                <span id="skip-backward" class="icon"><img src="./assets/icons/icons8-prevplay-48_grey.png"/></span>
                <span id="play-button" class="icon"><img src="./assets/icons/icons8-play-48_grey.png"/></span>
                <span id="skip-forward" class="icon"><img src="./assets/icons/icons8-nextplay-48_grey.png"/></span>
                <div id="total-time"><input readonly value="00:00:00"></div>
            </div>
            <div class="controls-right">
                <button id="download" class="btn primary">
                    <img src="./assets/icons/icons8-download-48_icon.png" id="download-icon">Download
                </button>
            </div>
        </div>
        `;

        this._bindEvents();
    }

    _bindEvents() {
        this.container.querySelector('#play-button')
        .addEventListener('click', () => this.onPlay && this.onPlay());

        this.container.querySelector('#skip-backward')
          .addEventListener('click', () => this.onSkipBack && this.onSkipBack());

        this.container.querySelector('#skip-forward')
          .addEventListener('click', () => this.onSkipForward && this.onSkipForward());

        this.container.querySelector('#timeline-zoom')
          .addEventListener('input', e => this.onZoom && this.onZoom(e.target.value));

        this.container.querySelector('#download')
          .addEventListener('click', () => this.onDownload && this.onDownload());
    }

    onPlay(cb) { this.onPlay = cb; }
    onSkipBack(cb) { this.onSkipBack = cb; }
    onSkipForward(cb) { this.onSkipForward = cb; }
    onZoom(cb) { this.onZoom = cb; }
    onDownload(cb) { this.onDownload = cb; }

}