
const enum GameMusic {
	ChiptuneLevel1,
	ChiptuneLevel3,
	ForestTop
}

let GameMusicUtil = {
	getMusic: function (): GameMusic[] {
		return [
			GameMusic.ChiptuneLevel1,
			GameMusic.ChiptuneLevel3,
			GameMusic.ForestTop
		];
	},

	getMusicInfo: function (music: GameMusic) {
		switch (music) {
			case GameMusic.ChiptuneLevel1:
				return {
					filename: "JuhaniJunkala/Level1.ogg",
					volume: 0.07
				};
			case GameMusic.ChiptuneLevel3:
				return {
					filename: "JuhaniJunkala/Level3.ogg",
					volume: 0.07
				};
			case GameMusic.ForestTop:
				return {
					filename: "SpringSpring/forest-top.ogg",
					volume: 0.07
				};
		}
	}
};
