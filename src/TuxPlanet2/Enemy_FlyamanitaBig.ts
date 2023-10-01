
// REVIEW ME

let Enemy_FlyamanitaBig: { getEnemy: (yMibi: number, enemyId: number, rng: IDTDeterministicRandom) => IEnemy } = {} as any;

((function () {

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			xSpeed: number,
			hp: number,
			attackCooldown1: number,
			attackCooldown2: number,
			frameCounter: number,
			screenWipeCountdown: number | null,
			enemyId: number): IEnemy {

		let processFrame: processFrameFunction = function (thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput) {

			let ATTACK_COOLDOWN_1: number;
			switch (difficulty) {
				case Difficulty.Easy: ATTACK_COOLDOWN_1 = 50; break;
				case Difficulty.Normal: ATTACK_COOLDOWN_1 = 17; break;
				case Difficulty.Hard: ATTACK_COOLDOWN_1 = 11; break;
			}

			let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

			xMibi -= xSpeed;

			xSpeed -= 40;

			if (xSpeed > 0 && xSpeed <= 40) {
				if (difficulty === Difficulty.Hard)
					attackCooldown1 = rng.nextInt(ATTACK_COOLDOWN_1);
			}

			if (xSpeed <= 0)
				xSpeed = 0;

			if (hp <= 0 || frameCounter >= 600 || screenWipeCountdown !== null && screenWipeCountdown <= 0) {
				let explode = Enemy_Background_Explode.getEnemy(xMibi, yMibi, 128 * 3 * 3, rng.nextInt(360 * 128), nextEnemyId);
				nextEnemyId++;
				return {
					enemies: [explode],
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed(),
					shouldEndLevel: false
				};
			}

			let enemies = [thisObj];

			if (xSpeed === 0) {
				attackCooldown1--;
				if (attackCooldown1 <= 0 && screenWipeCountdown === null) {
					attackCooldown1 = ATTACK_COOLDOWN_1;

					soundOutput.playSound(GameSound.EnemyShoot, 100);

					enemies.push(Enemy_Bullet_Freezewave.getEnemy(
						xMibi,
						yMibi,
						playerState,
						difficulty,
						nextEnemyId));
					nextEnemyId++;
				}
			}

			// TODO: attackCooldown2

			if (screenWipeCountdown !== null)
				screenWipeCountdown--;

			frameCounter++;

			return {
				enemies: enemies,
				nextEnemyId: nextEnemyId,
				newRngSeed: rng.getSeed(),
				shouldEndLevel: false
			};
		};

		let getHitboxes = function () {
			return [{
				xMibi: xMibi - 24 * 1024 * 3,
				yMibi: yMibi - 24 * 1024 * 3,
				widthMibi: 48 * 1024 * 3,
				heightMibi: 48 * 1024 * 3
			}];
		};

		let getDamageboxes = function () {
			return [{
				xMibi: xMibi - 24 * 1024 * 3,
				yMibi: yMibi - 24 * 1024 * 3,
				widthMibi: 48 * 1024 * 3,
				heightMibi: 48 * 1024 * 3
			}];
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCounter / 10) % 4;

			displayOutput.drawImageRotatedClockwise(
				GameImage.FlyAmanita,
				spriteNum * 20,
				0,
				20,
				20,
				(xMibi >> 10) - 90,
				(yMibi >> 10) - 90,
				0,
				128 * 3 * 3);
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, yMibi, xSpeed, hp, attackCooldown1, attackCooldown2, frameCounter, screenWipeCountdown, enemyId);
		};

		let onCollideWithPlayerBullet = function (): boolean {
			hp--;
			return true;
		};

		let onScreenWipe = function (countdown: number) {
			screenWipeCountdown = countdown;
		};

		return {
			getSnapshot: getSnapshot,
			enemyId: enemyId,
			isBullet: false,
			isBackground: false,
			processFrame: processFrame,
			getHitboxes: getHitboxes,
			getDamageboxes: getDamageboxes,
			onCollideWithPlayer: function () { return true; },
			onCollideWithPlayerBullet: onCollideWithPlayerBullet,
			onScreenWipe,
			render: render
		};
	};

	Enemy_FlyamanitaBig.getEnemy = function (yMibi: number, enemyId: number, rng: IDTDeterministicRandom): IEnemy {

		let hp = 250;

		let xSpeed = 5000;

		return getEnemy((GlobalConstants.WINDOW_WIDTH + 100) << 10, yMibi, xSpeed, hp, 0, 0, 0, null, enemyId);
	};
})());
