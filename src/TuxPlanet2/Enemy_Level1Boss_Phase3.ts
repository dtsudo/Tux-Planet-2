
// REVIEW ME

let Enemy_Level1Boss_Phase3: { getEnemy: (xMibi: number, yMibi: number, xSpeed: number, ySpeed: number, frameCounter: number, enemyId: number) => IEnemy } = {} as any;

((function () {

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			xSpeed: number,
			ySpeed: number,
			frameCounter: number,
			attackCooldown1: number,
			hp: number,
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
				case Difficulty.Normal: ATTACK_COOLDOWN_1 = 22; break;
				case Difficulty.Hard: ATTACK_COOLDOWN_1 = 4; break;
			}

			attackCooldown1--;
			if (attackCooldown1 <= 0) {
				attackCooldown1 = ATTACK_COOLDOWN_1;
				//soundOutput.playSound(GameSound.EnemyShoot, 100);

				enemies.push(Enemy_Bullet_BouncySnow.getEnemy(
					(100 + rng.nextInt(800)) << 10,
					-128 * (70 + rng.nextInt(40)),
					(50 + rng.nextInt(400)) << 10,
					difficulty,
				nextEnemyId++));
			}


			if (hp <= 0) {
				let deadBoss = Enemy_Level1Boss_Dead.getEnemy(
					xMibi,
					yMibi,
					xSpeed,
					ySpeed,
					frameCounter,
					nextEnemyId++);
				return {
					enemies: [deadBoss],
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
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, frameCounter, attackCooldown1, hp, enemyId);
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

	Enemy_Level1Boss_Phase3.getEnemy = function (xMibi: number, yMibi: number, xSpeed: number, ySpeed: number, frameCounter: number, enemyId: number): IEnemy {
		let initialHp = 500;

		// TODO remove
		//initialHp = 10;

		return getEnemy(xMibi, yMibi, xSpeed, ySpeed, frameCounter, 0, initialHp, enemyId);
	};
})());
