import Grid from './grid';

enum Direction {
  'down',
  'right',
  'up',
  'left',
}

export default class BoardManager {
  private size: number;

  private grid: Grid;

  constructor(size: number) {
    this.grid = new Grid(size);
    this.size = size;
  }

  private generateTile() {
    const empty = this.grid.getEmpty();
    const index = Math.round(Math.random() * empty.length);
    const { x, y } = empty[index];
    const id = Math.random()
      .toString(36)
      .substr(2, 9);
    this.grid.addTile({
      value: Math.random() <= 0.3 ? 4 : 2,
      changed: false,
      merged: false,
      id,
      x,
      y,
    });
  }

  private moveTiles(direction: Direction) {
    switch (direction) {
      case Direction.up:
      case Direction.down: {
        const up = direction === Direction.up;
        this.grid.eachColumn((column) => {
          column
            .sort((tileA, tileB) => (up ? tileB.y - tileA.y : tileA.y - tileB.y))
            .forEach((tile, index, tiles) => {
              if (tile.y !== (up ? this.size - 1 : 0)) {
                if (index === 0) {
                  this.grid.setTileY(tile, up ? this.size - 1 : 0);
                } else {
                  const previousTile = tiles[index - 1];
                  if (previousTile.value === tile.value) {
                    this.grid.merge(previousTile, tile);
                  } else {
                    this.grid.setTileY(tile, up ? previousTile.y - 1 : previousTile.y + 1);
                  }
                }
              }
            });
        });
        break;
      }
      case Direction.right:
      case Direction.left: {
        const right = direction === Direction.right;
        this.grid.eachRow((row) => {
          row
            .sort((tileA, tileB) => (right ? tileB.x - tileA.x : tileA.x - tileB.x))
            .forEach((tile, index, tiles) => {
              if (tile.x !== (right ? this.size - 1 : 0)) {
                if (index === 0) {
                  this.grid.setTileX(tile, right ? this.size - 1 : 0);
                } else {
                  const previousTile = tiles[index - 1];
                  if (previousTile.value === tile.value) {
                    this.grid.merge(previousTile, tile);
                  } else {
                    this.grid.setTileX(tile, right ? previousTile.x - 1 : previousTile.x + 1);
                  }
                }
              }
            });
        });
        break;
      }
      default:
        break;
    }
  }

  resetTiles() {
    this.grid.resetTiles();
    for (let i = 0; i < 2; i += 1) {
      this.generateTile();
    }
  }

  updateTiles(direction: Direction) {
    this.grid.eachTile((tile) => {
      tile.changed = false;
      tile.merged = false;
    });
    this.moveTiles(direction);
    if (this.grid.hasChanged()) this.generateTile();
  }

  getTiles() {
    return this.grid.getTiles();
  }

  getBoardSize() {
    return this.size + (this.size + 1) * this.getMarginSize();
  }

  getMarginSize() {
    return this.size / 20;
  }
}
