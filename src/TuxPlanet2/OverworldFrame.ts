
let OverworldFrame = ((function () {

	let getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {

		let overworldMap: OverworldMap = OverworldMapGeneration.generateOverworldMap(sessionState.overworldMapSeed);

		let playerTileX = sessionState.overworldLocation.tileX;
		let playerTileY = sessionState.overworldLocation.tileY;

		let playerXMibi = (playerTileX * 48 + 24) * 1024;
		let playerYMibi = (playerTileY * 48 + 24) * 1024;
		let animationFrameCounter = 0;

		let destinationTile: { tileX: number, tileY: number } | null = null;

		let reachableTiles: { tileX: number, tileY: number }[] = OverworldMapUtil.getReachableTiles(overworldMap, sessionState.completedLevels);
		let reachableTilesMap: { [index: string]: boolean } = {};
		for (let reachableTile of reachableTiles) {
			reachableTilesMap[reachableTile.tileX + "_" + reachableTile.tileY] = true;
		}

		let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {

			musicOutput.playMusic(GameMusic.OverworldTheme, 100);

			if (destinationTile === null) {

				animationFrameCounter = 0;

				if (sessionState.overworldLocation.tileX !== playerTileX || sessionState.overworldLocation.tileY !== playerTileY) {
					sessionState.overworldLocation.tileX = playerTileX;
					sessionState.overworldLocation.tileY = playerTileY;
					globalState.saveAndLoadData.saveSessionState(sessionState);
				}

				if (keyboardInput.isPressed(Key.LeftArrow) && playerTileX > 0 && reachableTilesMap[(playerTileX - 1) + "_" + playerTileY])
					destinationTile = { tileX: playerTileX - 1, tileY: playerTileY };
				if (keyboardInput.isPressed(Key.RightArrow) && playerTileX + 1 < overworldMap.widthInTiles && reachableTilesMap[(playerTileX + 1) + "_" + playerTileY])
					destinationTile = { tileX: playerTileX + 1, tileY: playerTileY };
				if (keyboardInput.isPressed(Key.DownArrow) && playerTileY > 0 && reachableTilesMap[playerTileX + "_" + (playerTileY - 1)])
					destinationTile = { tileX: playerTileX, tileY: playerTileY - 1 };
				if (keyboardInput.isPressed(Key.UpArrow) && playerTileY + 1 < overworldMap.heightInTiles && reachableTilesMap[playerTileX + "_" + (playerTileY + 1)])
					destinationTile = { tileX: playerTileX, tileY: playerTileY + 1 };

			} else {

				let destinationXMibi = (destinationTile.tileX * 48 + 24) * 1024;
				let destinationYMibi = (destinationTile.tileY * 48 + 24) * 1024;

				let distanceToDestination = Math.abs(destinationXMibi - playerXMibi) + Math.abs(destinationYMibi - playerYMibi);

				if (distanceToDestination <= 4000) {
					let newDestinationTile: { tileX: number, tileY: number } | null = null;

					if (overworldMap.tiles[destinationTile.tileX][destinationTile.tileY].tileType === OverworldMapTileType.Path) {
						let possibleNewDestinations: { tileX: number, tileY: number }[] = [];
						if (destinationTile.tileX > 0 && reachableTilesMap[(destinationTile.tileX - 1) + "_" + destinationTile.tileY])
							possibleNewDestinations.push({ tileX: destinationTile.tileX - 1, tileY: destinationTile.tileY });
						if (destinationTile.tileX + 1 < overworldMap.widthInTiles && reachableTilesMap[(destinationTile.tileX + 1) + "_" + destinationTile.tileY])
							possibleNewDestinations.push({ tileX: destinationTile.tileX + 1, tileY: destinationTile.tileY });
						if (destinationTile.tileY > 0 && reachableTilesMap[destinationTile.tileX + "_" + (destinationTile.tileY - 1)])
							possibleNewDestinations.push({ tileX: destinationTile.tileX, tileY: destinationTile.tileY - 1 });
						if (destinationTile.tileY + 1 < overworldMap.heightInTiles && reachableTilesMap[destinationTile.tileX + "_" + (destinationTile.tileY + 1)])
							possibleNewDestinations.push({ tileX: destinationTile.tileX, tileY: destinationTile.tileY + 1 });

						if (possibleNewDestinations.length === 2) {
							for (let possibleNewDestination of possibleNewDestinations) {
								if (possibleNewDestination.tileX !== playerTileX || possibleNewDestination.tileY !== playerTileY) {
									newDestinationTile = possibleNewDestination;
								}
							}
						}
					}

					playerTileX = destinationTile.tileX;
					playerTileY = destinationTile.tileY;
					playerXMibi = destinationXMibi;
					playerYMibi = destinationYMibi;
					destinationTile = newDestinationTile;
				} else {
					if (destinationXMibi > playerXMibi)
						playerXMibi += 4000;
					else if (destinationXMibi < playerXMibi)
						playerXMibi -= 4000;
					else if (destinationYMibi > playerYMibi)
						playerYMibi += 4000;
					else if (destinationYMibi < playerYMibi)
						playerYMibi -= 4000;
					else
						throw new Error("Unreachable");
				}
			}

			if (keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)
					|| keyboardInput.isPressed(Key.Space) && !previousKeyboardInput.isPressed(Key.Space)
					|| keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter)) {

				let playerTile = overworldMap.tiles[playerTileX][playerTileY];

				if (destinationTile === null && playerTile.tileType === OverworldMapTileType.Level) {

					soundOutput.playSound(GameSound.Click, 100);

					return LevelStartFrame.getFrame(globalState, sessionState, playerTile.level!, thisFrame);
				}
			}

			if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc)) {

				soundOutput.playSound(GameSound.Click, 100);

				return OverworldPauseMenuFrame.getFrame(globalState, sessionState, thisFrame);
			}

			animationFrameCounter++;

			return thisFrame;
		};

		let render = function (displayOutput: IDisplayOutput) {

			let isMoving = destinationTile !== null;

			OverworldMapRenderer.render(
				playerXMibi,
				playerYMibi,
				isMoving,
				animationFrameCounter,
				overworldMap,
				[...sessionState.completedLevels],
				displayOutput);
		};

		return {
			getNextFrame,
			render,
			getClickUrl: function () { return null; },
			getCompletedAchievements: function () { return null; }
		};
	};

	return {
		getFrame
	};
})());
