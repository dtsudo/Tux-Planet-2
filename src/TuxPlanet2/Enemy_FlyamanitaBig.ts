
let Enemy_FlyamanitaBig: { getEnemy: ({ yMibi, enemyId }: { yMibi: number, enemyId: number }) => IEnemy } = {} as any;

((function () {

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			xSpeed: number,
			hp: number,
			attackCooldown: number,
			frameCounter: number,
			screenWipeCountdown: number | null,
			enemyId: number): IEnemy {

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput }) {

			let ATTACK_COOLDOWN: number;
			switch (difficulty) {
				case Difficulty.Easy: ATTACK_COOLDOWN = 50; break;
				case Difficulty.Normal: ATTACK_COOLDOWN = 17; break;
				case Difficulty.Hard: ATTACK_COOLDOWN = 11; break;
			}

			let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

			xMibi -= xSpeed;

			xSpeed -= 40;

			if (xSpeed <= 0)
				xSpeed = 0;

			if (xSpeed > 0) {
				if (difficulty === Difficulty.Hard)
					attackCooldown = rng.nextInt(ATTACK_COOLDOWN);
			}

			if (hp <= 0 || frameCounter >= 600 || screenWipeCountdown !== null && screenWipeCountdown <= 0) {
				let explode = Enemy_Background_Explode.getEnemy({
					xMibi: xMibi,
					yMibi: yMibi,
					displayAngleScaled: rng.nextInt(360 * 128),
					scalingFactorScaled: 128 * 3 * 3,
					renderOnTop: false,
					enemyId: nextEnemyId++
				});
				return {
					enemies: [explode],
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed()
				};
			}

			let enemies = [thisObj];

			if (xSpeed === 0) {
				attackCooldown--;
				if (attackCooldown <= 0 && screenWipeCountdown === null) {
					attackCooldown = ATTACK_COOLDOWN;

					soundOutput.playSound(GameSound.EnemyShoot, 100);

					enemies.push(Enemy_Bullet_Freezewave.getEnemy({
						xMibi: xMibi,
						yMibi: yMibi,
						playerState: playerState,
						difficulty: difficulty,
						enemyId: nextEnemyId++
					}));
				}
			}

			if (screenWipeCountdown !== null)
				screenWipeCountdown--;

			frameCounter++;

			return {
				enemies: enemies,
				nextEnemyId: nextEnemyId,
				newRngSeed: rng.getSeed()
			};
		};

		let getHitboxes = function () {
			let hitbox: Hitbox = {
				xMibi: xMibi - 3 * 8 * 3 * 1024,
				yMibi: yMibi - 3 * 8 * 3 * 1024,
				widthMibi: 3 * 16 * 3 * 1024,
				heightMibi: 3 * 16 * 3 * 1024
			};
			return [hitbox];
		};

		let getDamageboxes = function () {
			let hitbox: Hitbox = {
				xMibi: xMibi - 3 * 8 * 3 * 1024,
				yMibi: yMibi - 3 * 8 * 3 * 1024,
				widthMibi: 3 * 16 * 3 * 1024,
				heightMibi: 3 * 16 * 3 * 1024
			};
			return [hitbox];
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCounter / 10) % 4;

			displayOutput.drawImageRotatedClockwise(
				GameImage.FlyAmanita,
				spriteNum * 20,
				0,
				20,
				20,
				(xMibi >> 10) - 3 * 3 * 10,
				(yMibi >> 10) - 3 * 3 * 10,
				0,
				128 * 3 * 3);
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, yMibi, xSpeed, hp, attackCooldown, frameCounter, screenWipeCountdown, enemyId);
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
			onScreenWipe: onScreenWipe,
			render: render
		};
	};

	Enemy_FlyamanitaBig.getEnemy = function ({ yMibi, enemyId }: { yMibi: number, enemyId: number }): IEnemy {

		let hp = 250;

		let xSpeed = 5000;

		return getEnemy((GlobalConstants.WINDOW_WIDTH + 100) << 10, yMibi, xSpeed, hp, 0, 0, null, enemyId);
	};
})());
