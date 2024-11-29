
let TilemapRendering = ((function () {

	let renderLayer = function (
			xOffsetInMibipixels: number,
			layer: ({ gameImage: GameImage, imageX: number, imageY: number } | null)[][],
			displayOutput: IDisplayOutput): void {

		let widthInTiles = layer.length;
		let heightInTiles = widthInTiles > 0 ? layer[0].length : 0;

		let x = 0;
		let displayX = xOffsetInMibipixels >> 10;

		while (displayX < -4800) {
			x += 100;
			displayX += 4800;
		}

		while (displayX < -480) {
			x += 10;
			displayX += 480;
		}

		while (displayX < -48) {
			x += 1;
			displayX += 48;
		}

		while (true) {
			if (x >= widthInTiles)
				break;

			if (displayX > GlobalConstants.WINDOW_WIDTH)
				break;

			for (let y = 0, displayY = 0; y < heightInTiles; y++, displayY += 48) {
				let tile = layer[x][y];

				if (tile !== null) {
					displayOutput.drawImageRotatedClockwise(
						tile.gameImage,
						tile.imageX,
						tile.imageY,
						16,
						16,
						displayX,
						displayY,
						0,
						128 * 3);
				}
			}

			x++;
			displayX += 48;
		}
	};

	let renderForeground = function (
			xOffsetInMibipixels: number,
			foregroundLayer: ({ gameImage: GameImage, imageX: number, imageY: number } | null)[][],
			displayOutput: IDisplayOutput): void {

		renderLayer(xOffsetInMibipixels, foregroundLayer, displayOutput);
	};

	let renderBackground = function (
			xOffsetInMibipixels: number,
			backgroundLayer: ({ gameImage: GameImage, imageX: number, imageY: number } | null)[][],
			bossFrameCounter: number | null,
			tilemapLevelInfo: TilemapLevelInfo,
			displayOutput: IDisplayOutput): void {

		renderLayer(xOffsetInMibipixels, backgroundLayer, displayOutput);

		if (bossFrameCounter !== null) {
			let alpha = tilemapLevelInfo.getDarkenBackgroundAlpha(bossFrameCounter);

			displayOutput.drawRectangle(
				0,
				0,
				GlobalConstants.WINDOW_WIDTH,
				GlobalConstants.WINDOW_HEIGHT,
				{ r: 0, g: 0, b: 0, alpha: alpha },
				true);
		}
	};

	return {
		renderForeground,
		renderBackground
	};
})());
