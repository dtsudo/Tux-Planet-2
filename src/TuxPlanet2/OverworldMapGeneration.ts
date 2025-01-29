
let OverworldMapGeneration = {
	generateOverworldMap: function (rngSeed: number): OverworldMap {

		let generateBackgroundTile = function (random: IDTDeterministicRandom) {
			return {
				gameImage: GameImage.OverworldTileset_Snow,
				imageX: random.nextInt(3) * 16,
				imageY: 80
			};
		};

		let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

		let widthInTiles = Math.ceil(GlobalConstants.WINDOW_WIDTH / 48);
		let heightInTiles = Math.ceil(GlobalConstants.WINDOW_HEIGHT / 48);

		let overworldMap = [];
		for (let i = 0; i < widthInTiles; i++) {
			let array: OverworldMapTile[] = [];
			for (let j = 0; j < heightInTiles; j++) {
				array.push({
					tileType: OverworldMapTileType.NonPath,
					level: null,
					shouldShowLevelIcon: null,
					backgroundTile: generateBackgroundTile(rng),
					foregroundTile: null
				});
			}

			overworldMap.push(array);
		}

		overworldMap[4][5] = {
			tileType: OverworldMapTileType.Level,
			level: Level.Level1,
			shouldShowLevelIcon: true,
			backgroundTile: generateBackgroundTile(rng),
			foregroundTile: {
				gameImage: GameImage.OverworldTileset_PathDirt,
				imageX: 16,
				imageY: 112
			}
		};

		overworldMap[9][5] = {
			tileType: OverworldMapTileType.Level,
			level: Level.Level2,
			shouldShowLevelIcon: true,
			backgroundTile: generateBackgroundTile(rng),
			foregroundTile: {
				gameImage: GameImage.OverworldTileset_PathDirt,
				imageX: 32,
				imageY: 112
			}
		};

		for (let i = 5; i <= 8; i++) {
			overworldMap[i][5] = {
				tileType: OverworldMapTileType.Path,
				level: null,
				shouldShowLevelIcon: null,
				backgroundTile: generateBackgroundTile(rng),
				foregroundTile: {
					gameImage: GameImage.OverworldTileset_PathDirt,
					imageX: 32,
					imageY: 48
				}
			};
		}

		return {
			tiles: overworldMap,
			widthInTiles,
			heightInTiles
		};
	}
};
