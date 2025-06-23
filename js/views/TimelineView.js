export class TimelineView {
    constructor( container ) {
        this.container = container;
    }

    render() {
        this.container.innerHTML = `
            <div class="timeline-editor">타임라인 에디터 영역</div>
        `
    }
}