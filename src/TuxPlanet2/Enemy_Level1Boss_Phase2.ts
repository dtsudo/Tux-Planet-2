
// REVIEW ME

let Enemy_Level1Boss_Phase2: { getEnemy: (xMibi: number, yMibi: number, xSpeed: number, ySpeed: number, frameCounter: number, enemyId: number) => IEnemy } = {} as any;

((function () {

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			xSpeed: number,
			ySpeed: number,
			frameCounter: number,
			attackCooldown1: number,
			attackCooldown2: number,
			hp: number,
			transitionToPhase3Counter: number | null,
			enemyId: number): IEnemy {

		let processFrame: processFrameFunction = function (thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput): EnemyProcessFrameResult {

			let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

			xMibi += xSpeed;
			yMibi += ySpeed;

			if (playerState.yMibi - yMibi >= 1024 * 20) {
				if (ySpeed < 1000)
					ySpeed += 30;
			}

			if (playerState.yMibi - yMibi <= -1024 * 20) {
				if (ySpeed > -1000)
					ySpeed -= 30;
			}

			let enemies = [thisObj];

			let ATTACK_COOLDOWN_1: number;

			switch (difficulty) {
				case Difficulty.Easy: ATTACK_COOLDOWN_1 = 50; break;
				case Difficulty.Normal: ATTACK_COOLDOWN_1 = 30; break;
				case Difficulty.Hard: ATTACK_COOLDOWN_1 = 12; break;
			}

			attackCooldown1--;
			if (attackCooldown1 <= 0 && transitionToPhase3Counter === null) {
				attackCooldown1 = ATTACK_COOLDOWN_1;
				soundOutput.playSound(GameSound.EnemyShoot, 100);

				let increment: number;

				switch (difficulty) {
					case Difficulty.Easy:
						increment = 30 * 128;
						break;
					case Difficulty.Normal:
						increment = 15 * 128;
						break;
					case Difficulty.Hard:
						increment = 10 * 128;
						break;
				}

				for (let i = rng.nextInt(increment); i < 360 * 128; i += increment) {
					enemies.push(Enemy_Bullet_Iceball.getEnemy(
						xMibi,
						yMibi,
						i,
						difficulty,
						nextEnemyId++));
				}

			}

			let ATTACK_COOLDOWN_2: number;

			switch (difficulty) {
				case Difficulty.Easy: ATTACK_COOLDOWN_2 = 118; break;
				case Difficulty.Normal: ATTACK_COOLDOWN_2 = 80; break;
				case Difficulty.Hard: ATTACK_COOLDOWN_2 = 35; break;
			}

			attackCooldown2--;
			if (attackCooldown2 <= 0 && transitionToPhase3Counter === null) {
				attackCooldown2 = ATTACK_COOLDOWN_2;
				soundOutput.playSound(GameSound.EnemyShoot, 100);

				enemies.push(Enemy_Bullet_Freezewave.getEnemy(xMibi, yMibi, playerState, difficulty, nextEnemyId++));

				let initialAngleScaled = DTMath.arcTangentScaled(playerState.xMibi - xMibi, playerState.yMibi - yMibi);
				enemies.push(Enemy_Bullet_Homing.getEnemy(xMibi, yMibi, initialAngleScaled + 50 * 128, nextEnemyId++));
				enemies.push(Enemy_Bullet_Homing.getEnemy(xMibi, yMibi, initialAngleScaled - 50 * 128, nextEnemyId++));
			}

			if (hp <= 0 && transitionToPhase3Counter === null) {
				transitionToPhase3Counter = 0;
			}

			if (transitionToPhase3Counter !== null)
				transitionToPhase3Counter++;

			if (transitionToPhase3Counter !== null && transitionToPhase3Counter >= 120) {
				let phase3Boss = Enemy_Level1Boss_Phase3.getEnemy(
					xMibi,
					yMibi,
					xSpeed,
					ySpeed,
					frameCounter,
					nextEnemyId++);
				return {
					enemies: [phase3Boss],
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed()
				};
			}

			frameCounter++;

			let returnVal: EnemyProcessFrameResult = {
				enemies: enemies,
				nextEnemyId: nextEnemyId,
				newRngSeed: rng.getSeed(),
				musicToPlay: GameMusic.ChiptuneLevel3,
				bossHealthDisplayValue: Math.round(hp * 100 / 500)
			};

			if (transitionToPhase3Counter !== null && transitionToPhase3Counter === 2)
				returnVal.shouldScreenWipe = true;

			if (transitionToPhase3Counter !== null && transitionToPhase3Counter === 60)
				returnVal.shouldCreateAutoSavestate = true;

			return returnVal;
		};

		let getHitboxes = function () {
			return null;
		};

		let getDamageboxes = function () {
			let damagebox: Hitbox = {
				xMibi: xMibi - 48 * 1024,
				yMibi: yMibi - 48 * 1024,
				widthMibi: 32 * 3 * 1024,
				heightMibi: 32 * 3 * 1024
			};
			return [damagebox];
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCounter / 10) % 4;

			displayOutput.drawImageRotatedClockwise(
				GameImage.OwlBrown,
				32 + spriteNum * 32,
				0,
				32,
				32,
				(xMibi >> 10) - 48,
				(yMibi >> 10) - 48,
				0,
				128 * 3);
		};

		let getSnapshot = function (thisObj: IEnemy): IEnemy {
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, frameCounter, attackCooldown1, attackCooldown2, hp, transitionToPhase3Counter, enemyId);
		};

		let onCollideWithPlayerBullet = function (): boolean {
			hp--;
			return true;
		};

		let onScreenWipe = function (countdown: number) {
		};

		return {
			getSnapshot: getSnapshot,
			enemyId: enemyId,
			isBullet: false,
			isBackground: false,
			processFrame: processFrame,
			getHitboxes: getHitboxes,
			getDamageboxes: getDamageboxes,
			onCollideWithPlayer: function () { return false; },
			onCollideWithPlayerBullet: onCollideWithPlayerBullet,
			onScreenWipe,
			render: render
		};
	};

	Enemy_Level1Boss_Phase2.getEnemy = function (xMibi: number, yMibi: number, xSpeed: number, ySpeed: number, frameCounter: number, enemyId: number): IEnemy {
		let initialHp = 500;

		// TODO: remove
		//initialHp = 50;

		return getEnemy(xMibi, yMibi, xSpeed, ySpeed, frameCounter, 0, 120, initialHp, null, enemyId);
	};
})());
