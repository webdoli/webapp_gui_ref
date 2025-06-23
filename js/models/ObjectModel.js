export class ObjectModel{
    constructor( id, type, props={} ) {
        this.id = id;
        this.type = type;
        this.props = props;
        this.updateCallbacks = [];
        
    }

    updateProps( delta ) {
        Object.assign( this.props, delta );
        this.updateCallbacks.forEach( cb => cb( this ) );
    }

    onUpdate( cb ) {
        this.updateCallbacks.push( cb );
    }
}