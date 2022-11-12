// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

const L = require('../leaflet.js');
const tilelayer = require('./TileLayer.js');

export class LeafletBinaryTileLayerModel extends tilelayer.LeafletTileLayerModel {
  defaults() {
    return {
      ...super.defaults(),
      _view_name: 'LeafletLocalTileLayerView',
      _model_name: 'LeafletLocalTileLayerModel',
      // NOTE: url is ignored
      _tiles: {},
    };
  }
}


export class LeafletBinaryTileLayerView extends tilelayer.LeafletTileLayerView {


  create_obj() {
    class BinaryTileLayer extends L.GridLayer {
        createTile (coords) {
          var tile = document.createElement('div');
          tile.innerHTML = [coords.z, coords.x, coords.y].join(', ');
          tile.style.outline = '1px solid red';

          // Send request for tile to Python
          this.view.send({
            event: 'tile_request',
            coords: [coords.z, coords.x, coords.y],
          });
          // Tile is asynchronously placed in the `_tile` dict
          var key = [coords.x, coords.y, coords.z].join(',');
          const start = new Date();
          while ((new Date()) - start < 100) {
              if (key in this.model.get('_tiles')) {
                console.log('tile request succeeded')
                tile.style.outline = '2px solid green';
                // TODO use tile binary
                return tile
              }
          }
          // Error out as tile request failed
          console.log('tile request failed')
          // console.log(this.model.get('_tiles'))
          return tile
      }
    }
    this.obj = new BinaryTileLayer(this.get_options());
    this.obj.model = this.model
    this.obj.view = this
  }

  leaflet_events() {
    super.leaflet_events();
  }

  model_events() {
    super.model_events();
  }
}
