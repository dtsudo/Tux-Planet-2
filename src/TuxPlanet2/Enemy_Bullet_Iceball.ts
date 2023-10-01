
// REVIEW ME

let Enemy_Bullet_Iceball: { getEnemy: (xMibi: number, yMibi: number, angleScaled: number, difficulty: Difficulty, enemyId: number, speedOverride?: number) => IEnemy } = {} as any;

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
			let hitbox: Hitbox = {
				xMibi: xMibi - 6 * 1024,
				yMibi: yMibi - 6 * 1024,
				widthMibi: 13 * 1024,
				heightMibi: 13 * 1024
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
				GameImage.Iceball,
				0,
				0,
				6,
				6,
				(xMibi >> 10) - 3 * 3,
				(yMibi >> 10) - 3 * 3,
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

	Enemy_Bullet_Iceball.getEnemy = function (xMibi: number, yMibi: number, angleScaled: number, difficulty: Difficulty, enemyId: number, speedOverride?: number): IEnemy {

		let xSpeed: number;
		let ySpeed: number;

		if (speedOverride === undefined) {
			let speed: number;
			switch (difficulty) {
				case Difficulty.Easy: speed = 3; break;
				case Difficulty.Normal: speed = 4; break;
				case Difficulty.Hard: speed = 6; break;
			}

			xSpeed = speed * DTMath.cosineScaled(angleScaled);
			ySpeed = speed * DTMath.sineScaled(angleScaled);
		} else {
			xSpeed = (speedOverride * DTMath.cosineScaled(angleScaled)) >> 10;
			ySpeed = (speedOverride * DTMath.sineScaled(angleScaled)) >> 10;
		}



		// 0 => -90
		// 30 => -120
		let displayAngleScaled = -angleScaled - 90 * 128;

		return getEnemy(xMibi, yMibi, xSpeed, ySpeed, displayAngleScaled, 0, null, enemyId);
	};
})());
