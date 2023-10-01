
const enum GameSound {
	Click,
	Cut,
	PlayerShoot,
	StandardDeath,
	EnemyShoot
}

let GameSoundUtil = {
	getSounds: function (): GameSound[] {
		return [
			GameSound.Click,
			GameSound.Cut,
			GameSound.PlayerShoot,
			GameSound.StandardDeath,
			GameSound.EnemyShoot
		];
	},

	getSoundInfo: function (sound: GameSound) {
		switch (sound) {
			case GameSound.Click:
				return {
					filename: "Kenney/click3_Modified.wav",
					volume: 0.3
				};
			case GameSound.Cut:
				return {
					filename: "Basto/cut.ogg",
					volume: 0.5
				};
			case GameSound.PlayerShoot:
				return {
					filename: "Kenney/PlayerShoot_Modified.ogg",
					volume: 0.2
				};
			case GameSound.StandardDeath:
				return {
					filename: "Kenney/StandardDeath.ogg",
					volume: 0.3
				};
			case GameSound.EnemyShoot:
				return {
					filename: "Kenney/EnemyShoot_Modified.ogg",
					volume: 1.0
				};
		}
	}
};
