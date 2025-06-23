export class SceneModel {
    constructor() {
        this.objects = [];
        this.selected = null;
        this.changeCallbacks = [];
    }

    add( obj ) {
        this.objects.push( obj );
        this._emit();
    }

    select( id ) {
        this.selected = this.objects.find( o => o.id === id ) || null;
        this._emit();
    }

    onChange( cb ) {
        this.changeCallbacks.push( cb );
    }

    _emit() {
        this.changeCallbacks.forEach( cb => cb(this) );
    }
}