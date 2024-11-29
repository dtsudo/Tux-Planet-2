
let Enemy_Background_Instructions: { getEnemy: ({ enemyId }: { enemyId: number }) => IEnemy } = {} as any;

((function () {
	let onCollideFunction = function () { return false; };

	let getEnemy = function (
		xMibi: number,
		enemyId: number): IEnemy {

		let thisEnemyArray: IEnemy[] | null = null;

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput }) {

			xMibi -= 600;

			if (xMibi < -1000 * 1024)
				return {
					enemies: [],
					nextEnemyId: nextEnemyId,
					newRngSeed: rngSeed
				};

			if (thisEnemyArray === null)
				thisEnemyArray = [thisObj];

			return {
				enemies: thisEnemyArray,
				nextEnemyId: nextEnemyId,
				newRngSeed: rngSeed
			};
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, enemyId);
		};

		let render = function (displayOutput: IDisplayOutput) {
			displayOutput.drawRectangle(
				xMibi >> 10,
				50,
				570,
				GlobalConstants.WINDOW_HEIGHT - 100,
				{ r: 0, g: 0, b: 0, alpha: 150 },
				true);

			displayOutput.drawText(
				xMibi >> 10,
				GlobalConstants.WINDOW_HEIGHT - 50,
				" Controls: \n\n Arrow keys to move \n Z to shoot \n\n Shift to slow down time \n\n C to create a save state \n X to load a save state \n\n "
				+ "You only have one life. \n Use save states to overcome tough patterns! \n\n Your hitbox is a single pixel.",
				GameFont.SimpleFont,
				24,
				white);
		};

		return {
			getSnapshot,
			enemyId,
			isBullet: false,
			isBackground: true,
			processFrame,
			getHitboxes: function () { return null; },
			getDamageboxes: function () { return null; },
			onCollideWithPlayer: onCollideFunction,
			onCollideWithPlayerBullet: onCollideFunction,
			onScreenWipe: function () { },
			render
		};
	};

	Enemy_Background_Instructions.getEnemy = function ({ enemyId }: { enemyId: number }): IEnemy {
		return getEnemy(GlobalConstants.WINDOW_WIDTH << 10, enemyId);
	};
})());
