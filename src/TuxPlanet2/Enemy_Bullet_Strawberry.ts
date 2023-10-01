
// REVIEW ME

let Enemy_Bullet_Strawberry: { getEnemy: (xMibi: number, yMibi: number, angleScaled: number, difficulty: Difficulty, enemyId: number) => IEnemy } = {} as any;

((function () {
	let getEnemy = function (
		xMibi: number,
		yMibi: number,
		xSpeed: number,
		ySpeed: number,
		displayAngleScaled: number,
		frameCounter: number,
		screenWipeCountdown: number | null,
		enemyId: number): IEnemy {

		let thisEnemyArray: IEnemy[] | null = null;

		let processFrame: processFrameFunction = function (thisObj, enemyMapping, rngSeed, nextEnemyId, playerState, soundOutput) {

			xMibi += xSpeed;
			yMibi += ySpeed;

			frameCounter++;

			let x = xMibi >> 10;
			let y = yMibi >> 10;

			if (x < -50 || x > GlobalConstants.WINDOW_WIDTH + 50 || y < -50 || y > GlobalConstants.WINDOW_HEIGHT + 50)
				return {
					enemies: [],
					nextEnemyId: nextEnemyId,
					newRngSeed: rngSeed
				};

			if (screenWipeCountdown !== null) {
				screenWipeCountdown--;

				if (screenWipeCountdown <= 0) {
					let poof = Enemy_Background_Poof.getEnemy(xMibi, yMibi, 3 * 128, nextEnemyId++);
					return {
						enemies: [poof],
						nextEnemyId,
						newRngSeed: rngSeed
					};
				}
			}

			if (thisEnemyArray === null)
				thisEnemyArray = [thisObj];

			return {
				enemies: thisEnemyArray,
				nextEnemyId: nextEnemyId,
				newRngSeed: rngSeed,
				shouldEndLevel: false
			};
		};

		let getHitboxes = function () {
			// 30 x 36
			let hitbox: Hitbox = {
				xMibi: xMibi - 10 * 1024,
				yMibi: yMibi - 10 * 1024,
				widthMibi: 20 * 1024,
				heightMibi: 20 * 1024
			};

			return [hitbox];
		};

		let getDamageboxes = function () {
			return null;
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, displayAngleScaled, frameCounter, screenWipeCountdown, enemyId);
		};

		let render = function (displayOutput: IDisplayOutput) {
			displayOutput.drawImageRotatedClockwise(
				GameImage.Strawberry,
				0,
				0,
				10,
				12,
				(xMibi >> 10) - 5 * 3,
				(yMibi >> 10) - 6 * 3,
				displayAngleScaled,
				3 * 128);
		};

		let onScreenWipe = function (countdown: number) {
			screenWipeCountdown = countdown;
		};

		return {
			getSnapshot,
			enemyId,
			isBullet: true,
			isBackground: false,
			processFrame,
			getHitboxes,
			getDamageboxes,
			onCollideWithPlayer: function () { return true; },
			onCollideWithPlayerBullet: function () { return false; },
			onScreenWipe,
			render
		};
	};

	Enemy_Bullet_Strawberry.getEnemy = function (xMibi: number, yMibi: number, angleScaled: number, difficulty: Difficulty, enemyId: number): IEnemy {

		let speed: number;

		switch (difficulty) {
			case Difficulty.Easy: speed = 4; break;
			case Difficulty.Normal: speed = 4; break;
			case Difficulty.Hard: speed = 4; break;
		}

		let xSpeed = speed * DTMath.cosineScaled(angleScaled);
		let ySpeed = speed * DTMath.sineScaled(angleScaled);

		// 0 => -90
		// 30 => -120
		let displayAngleScaled = -angleScaled - 90 * 128;

		return getEnemy(xMibi, yMibi, xSpeed, ySpeed, displayAngleScaled, 0, null, enemyId);
	};
})());
