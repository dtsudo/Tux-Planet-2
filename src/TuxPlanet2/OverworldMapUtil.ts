
let OverworldMapUtil = {
	getLevelLocations: function (overworldMap: OverworldMap): { [index in Level]?: { tileX: number, tileY: number } } {

		let returnValue: { [index in Level]?: { tileX: number, tileY: number } } = {};

		for (let i = 0; i < overworldMap.widthInTiles; i++) {
			for (let j = 0; j < overworldMap.heightInTiles; j++) {
				let tile = overworldMap.tiles[i][j];

				if (tile.tileType === OverworldMapTileType.Level) {
					returnValue[tile.level!] = { tileX: i, tileY: j };
				}
			}
		}

		return returnValue;
	},

	getReachableTiles: function (overworldMap: OverworldMap, completedLevels: Level[]): { tileX: number, tileY: number }[] {

		let levelLocations = OverworldMapUtil.getLevelLocations(overworldMap);

		if (completedLevels.length === 0)
			return [levelLocations[Level.Level1]!];

		let returnValue: { tileX: number, tileY: number }[] = [];
		let processedTiles: { [index: string]: boolean } = {};
		let tilesToProcess: { tileX: number, tileY: number }[] = [];

		for (let completedLevel of completedLevels) {
			tilesToProcess.push(levelLocations[completedLevel]!);
		}

		while (true) {
			if (tilesToProcess.length === 0)
				break;

			let tileToProcess = tilesToProcess.pop()!;

			let tileKey = tileToProcess.tileX + "_" + tileToProcess.tileY;

			if (processedTiles[tileKey])
				continue;

			returnValue.push(tileToProcess);
			processedTiles[tileKey] = true;

			let overworldMapTile = overworldMap.tiles[tileToProcess.tileX][tileToProcess.tileY];

			if (overworldMapTile.tileType === OverworldMapTileType.Path || overworldMapTile.tileType === OverworldMapTileType.Level && completedLevels.includes(overworldMapTile.level!)) {

				if (tileToProcess.tileX > 0 && overworldMap.tiles[tileToProcess.tileX - 1][tileToProcess.tileY].tileType !== OverworldMapTileType.NonPath)
					tilesToProcess.push({ tileX: tileToProcess.tileX - 1, tileY: tileToProcess.tileY });
				if (tileToProcess.tileX + 1 < overworldMap.widthInTiles && overworldMap.tiles[tileToProcess.tileX + 1][tileToProcess.tileY].tileType !== OverworldMapTileType.NonPath)
					tilesToProcess.push({ tileX: tileToProcess.tileX + 1, tileY: tileToProcess.tileY });
				if (tileToProcess.tileY > 0 && overworldMap.tiles[tileToProcess.tileX][tileToProcess.tileY - 1].tileType !== OverworldMapTileType.NonPath)
					tilesToProcess.push({ tileX: tileToProcess.tileX, tileY: tileToProcess.tileY - 1 });
				if (tileToProcess.tileY + 1 < overworldMap.heightInTiles && overworldMap.tiles[tileToProcess.tileX][tileToProcess.tileY + 1].tileType !== OverworldMapTileType.NonPath)
					tilesToProcess.push({ tileX: tileToProcess.tileX, tileY: tileToProcess.tileY + 1 });
				
			}
		}

		return returnValue;
	}
};
