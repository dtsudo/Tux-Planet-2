
let MapDataLevelUtil = ((function () {

	let getDisplayLayer = function (
			mapData: MapDataLevel,
			layerName: string,
			display: { getWidth: (image: GameImage) => number }): ({ gameImage: GameImage, imageX: number, imageY: number } | null)[][] {

		let layer: ({ gameImage: GameImage, imageX: number, imageY: number } | null)[][] = [];
		for (let i = 0; i < mapData.width; i++) {
			let array = [];
			for (let j = 0; j < mapData.height; j++) {
				array.push(null);
			}
			layer.push(array);
		}

		let x = 0;
		let y = mapData.height - 1;

		let mapDataLayer: number[] = mapData.layers.find(x => x.name === layerName)!.data;

		for (let id of mapDataLayer) {
			if (id > 0) {
				let correspondingTileset: MapDataTileset = mapData.tilesets.filter(tileset => tileset.firstgid <= id).sort((a, b) => b.firstgid - a.firstgid)[0];
				let tileset: Tileset = TilesetUtil.getTilesetFromMapDataTileset(correspondingTileset);

				let spriteNum = id - correspondingTileset.firstgid;

				let tilesetImage: GameImage = TilesetUtil.getGameImageForTileset(tileset);
				let tilesetImageWidth = display.getWidth(tilesetImage);
				let numberOfSpritesPerRow = Math.floor(tilesetImageWidth / 16);

				let row = 0;

				while (spriteNum >= numberOfSpritesPerRow) {
					row++;
					spriteNum -= numberOfSpritesPerRow;
				}

				layer[x][y] = {
					gameImage: tilesetImage,
					imageX: spriteNum * 16,
					imageY: row * 16
				};
			}

			x++;

			if (x === mapData.width) {
				x = 0;
				y--;
			}
		}

		return layer;
	};

	let getForegroundLayer = function (
			mapData: MapDataLevel,
			display: { getWidth: (image: GameImage) => number }): ({ gameImage: GameImage, imageX: number, imageY: number } | null)[][] {

		return getDisplayLayer(mapData, "Foreground", display);
	};

	let getBackgroundLayer = function (
			mapData: MapDataLevel,
			display: { getWidth: (image: GameImage) => number }): ({ gameImage: GameImage, imageX: number, imageY: number } | null)[][] {

		return getDisplayLayer(mapData, "Background", display);
	};

	let getSolidLayer = function (mapData: MapDataLevel): (number | null)[][] {

		let solidLayer: (number | null)[][] = [];
		for (let i = 0; i < mapData.width; i++) {
			let array = [];
			for (let j = 0; j < mapData.height; j++) {
				array.push(null);
			}
			solidLayer.push(array);
		}

		let x = 0;
		let y = mapData.height - 1;

		let solidTileset: MapDataTileset = mapData.tilesets.find(tileset => tileset.name === "Solid")!;

		let mapDataSolidLayer: number[] = mapData.layers.find(x => x.name === "Solid")!.data;

		for (let id of mapDataSolidLayer) {
			if (id > 0)
				solidLayer[x][y] = id - solidTileset.firstgid;

			x++;

			if (x === mapData.width) {
				x = 0;
				y--;
			}
		}

		return solidLayer;
	};

	let getEnemyTiles = function (mapData: MapDataLevel): ({ x: number, y: number, id: number })[] {

		let enemyTiles: ({ x: number, y: number, id: number })[] = [];

		let x = 0;
		let y = mapData.height - 1;

		let enemiesTileset: MapDataTileset = mapData.tilesets.find(tileset => tileset.name === "EnemySpawns")!;

		let mapDataEnemiesLayer: number[] = mapData.layers.find(x => x.name === "Enemies")!.data;

		for (let id of mapDataEnemiesLayer) {
			if (id > 0)
				enemyTiles.push({
					x: x,
					y: y,
					id: id - enemiesTileset.firstgid
				});

			x++;

			if (x === mapData.width) {
				x = 0;
				y--;
			}
		}

		return enemyTiles;
	};

	return {
		getForegroundLayer,
		getBackgroundLayer,
		getSolidLayer,
		getEnemyTiles
	};
})());
