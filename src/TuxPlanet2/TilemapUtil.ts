
let TilemapUtil = ((function () {

	let getTilemap = function (
			tilemapLevelInfo: TilemapLevelInfo,
			xOffsetInMibipixels: number,
			bossFrameCounter: number | null,
			widthInTiles: number,
			heightInTiles: number,
			solidLayer: (number | null)[][],
			foregroundLayer: ({ gameImage: GameImage, imageX: number, imageY: number } | null)[][],
			backgroundLayer: ({ gameImage: GameImage, imageX: number, imageY: number } | null)[][],
			remainingEnemyTiles: { x: number, y: number, id: number }[]): Tilemap {

		let getSnapshot = function (thisObj: Tilemap): Tilemap {
			let remainingEnemyTilesSnapshot = remainingEnemyTiles.map(x => ({ x: x.x, y: x.y, id: x.id }));

			return getTilemap(tilemapLevelInfo, xOffsetInMibipixels, bossFrameCounter, widthInTiles, heightInTiles, solidLayer, foregroundLayer, backgroundLayer, remainingEnemyTilesSnapshot);
		};

		let startBoss = function (): void {
			bossFrameCounter = 0;
		};

		let getXVelocityForEnemiesInMibipixelsPerFrame = function (): number {
			return tilemapLevelInfo.getXVelocityForEnemiesInMibipixelsPerFrame();
		};

		let hasReachedEndOfMap = function (): boolean {
			return tilemapLevelInfo.hasReachedEndOfMap(xOffsetInMibipixels, widthInTiles);
		};

		let isSolid = function (xMibi: number, yMibi: number): boolean {
			return SolidLayerUtil.isSolid(xMibi, yMibi, xOffsetInMibipixels, widthInTiles, heightInTiles, solidLayer);
		};

		let isDeadly = function (xMibi: number, yMibi: number): boolean {
			return false;
		};

		let getNewEnemies = function (): { xMibi: number, yMibi: number, id: number }[] {
			let returnValue: { xMibi: number, yMibi: number, id: number }[] = [];

			let newRemainingEnemyTiles: { x: number, y: number, id: number }[] = [];

			for (let enemyTile of remainingEnemyTiles) {

				let rightEdgeOfScreen = GlobalConstants.WINDOW_WIDTH * 1024 - xOffsetInMibipixels;

				let relevantX = Math.floor(rightEdgeOfScreen / (48 * 1024)) + 1;

				if (enemyTile.x <= relevantX) {
					returnValue.push({
						xMibi: (enemyTile.x * 48 + 24) * 1024 + xOffsetInMibipixels,
						yMibi: (enemyTile.y * 48 + 24) * 1024,
						id: enemyTile.id
					});
				} else {
					newRemainingEnemyTiles.push(enemyTile);
				}
			}

			remainingEnemyTiles = newRemainingEnemyTiles;

			return returnValue;
		};

		let processFrame = function (): void {

			if (bossFrameCounter !== null)
				bossFrameCounter++;

			xOffsetInMibipixels = tilemapLevelInfo.getNewXOffsetInMibipixels(xOffsetInMibipixels, widthInTiles, bossFrameCounter);
		};

		let renderForeground = function (displayOutput: IDisplayOutput): void {
			TilemapRendering.renderForeground(xOffsetInMibipixels, foregroundLayer, displayOutput);
		};

		let renderBackground = function (displayOutput: IDisplayOutput): void {
			TilemapRendering.renderBackground(xOffsetInMibipixels, backgroundLayer, bossFrameCounter, tilemapLevelInfo, displayOutput);
		};

		return {
			getSnapshot,
			getXVelocityForEnemiesInMibipixelsPerFrame,
			hasReachedEndOfMap,
			isSolid,
			isDeadly,
			startBoss,
			getNewEnemies,
			processFrame,
			renderForeground,
			renderBackground
		};
	};

	return {
		getTilemap: function (mapData: MapDataLevel, tilemapLevelInfo: TilemapLevelInfo, display: { getWidth: (image: GameImage) => number }): Tilemap {

			let foregroundLayer: ({ gameImage: GameImage, imageX: number, imageY: number } | null)[][] = MapDataLevelUtil.getForegroundLayer(mapData, display);
			let backgroundLayer: ({ gameImage: GameImage, imageX: number, imageY: number } | null)[][] = MapDataLevelUtil.getBackgroundLayer(mapData, display);
			let solidLayer: (number | null)[][] = MapDataLevelUtil.getSolidLayer(mapData);
			let enemyTiles: ({ x: number, y: number, id: number })[] = MapDataLevelUtil.getEnemyTiles(mapData);

			if (!SolidLayerUtil.isValidSolidLayer(solidLayer))
				throw new Error("Invalid solid layer");

			return getTilemap(tilemapLevelInfo, 0, null, mapData.width, mapData.height, solidLayer, foregroundLayer, backgroundLayer, enemyTiles);
		}
	};
})());
