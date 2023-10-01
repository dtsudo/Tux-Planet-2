
// REVIEW ME

let Enemy_Bullet_Noone2: { getEnemy: (xMibi: number, yMibi: number, directionScaled: number, rotatesClockwise: boolean, displayAngleScaled: number, difficulty: Difficulty, enemyId: number) => IEnemy } = {} as any;

((function () {
	let getEnemy = function (
		xMibi: number,
		yMibi: number,
		xSpeed: number,
		ySpeed: number,
		rotatesClockwise: boolean,
		displayAngleScaled: number,
		screenWipeCountdown: number | null,
		enemyId: number): IEnemy {

		let thisEnemyArray: IEnemy[] | null = null;

		let processFrame = function (thisObj: IEnemy, enemyMapping: { [index: number]: IEnemy }, rngSeed: number, nextEnemyId: number) {

			xMibi += xSpeed;
			yMibi += ySpeed;

			let x = xMibi >> 10;
			let y = yMibi >> 10;

			if (x < -50 || x > GlobalConstants.WINDOW_WIDTH + 50 || y < -50 || y > GlobalConstants.WINDOW_HEIGHT + 50)
				return {
					enemies: [],
					nextEnemyId: nextEnemyId,
					newRngSeed: rngSeed
				};

			displayAngleScaled += 3 * 128;
			if (displayAngleScaled >= 360 * 128)
				displayAngleScaled -= 360 * 128;

			if (screenWipeCountdown !== null) {
				screenWipeCountdown--;
				if (screenWipeCountdown <= 0) {
					let poof = Enemy_Background_Poof.getEnemy(xMibi, yMibi, 3 * 128 * 2, nextEnemyId++);
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
				xMibi: xMibi - 16 * 1024,
				yMibi: yMibi - 16 * 1024,
				widthMibi: 32 * 1024,
				heightMibi: 32 * 1024
			};

			return [hitbox];
		};

		let getDamageboxes = function () {
			return null;
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, rotatesClockwise, displayAngleScaled, screenWipeCountdown, enemyId);
		};

		let render = function (displayOutput: IDisplayOutput) {
			displayOutput.drawImageRotatedClockwise(
				GameImage.Noone,
				0,
				0,
				16,
				16,
				(xMibi >> 10) - 8 * 3,
				(yMibi >> 10) - 8 * 3,
				displayAngleScaled,
				3 * 128);

			let nextX = xMibi + DTMath.cosineScaled(-displayAngleScaled) * 16 * 3;
			let nextY = yMibi + DTMath.sineScaled(-displayAngleScaled) * 16 * 3;

			displayOutput.drawImageRotatedClockwise(
				GameImage.CyraDoll,
				0,
				0,
				16,
				16,
				(nextX >> 10) - 8 * 3,
				(nextY >> 10) - 8 * 3,
				displayAngleScaled,
				3 * 128);

			nextX = nextX + DTMath.cosineScaled(-displayAngleScaled) * 16 * 3;
			nextY = nextY + DTMath.sineScaled(-displayAngleScaled) * 16 * 3;

			displayOutput.drawImageRotatedClockwise(
				GameImage.DashieDoll,
				0,
				0,
				16,
				16,
				(nextX >> 10) - 8 * 3,
				(nextY >> 10) - 8 * 3,
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

	Enemy_Bullet_Noone2.getEnemy = function (xMibi: number, yMibi: number, directionScaled: number, rotatesClockwise: boolean, displayAngleScaled: number, difficulty: Difficulty, enemyId: number): IEnemy {

		let speed: number;

		switch (difficulty) {
			case Difficulty.Easy: speed = 3; break;
			case Difficulty.Normal: speed = 4; break;
			case Difficulty.Hard: speed = 5; break;
		}

		let xSpeed = DTMath.cosineScaled(directionScaled) * speed;
		let ySpeed = DTMath.sineScaled(directionScaled) * speed;

		return getEnemy(xMibi, yMibi, xSpeed, ySpeed, rotatesClockwise, displayAngleScaled, null, enemyId);
	};
})());
