
const enum GameMusic {
	ChiptuneLevel1,
	ChiptuneLevel3,
	ForestTop,
	MainTheme
}

let GameMusicUtil = {
	getMusic: function (): GameMusic[] {
		return [
			GameMusic.ChiptuneLevel1,
			GameMusic.ChiptuneLevel3,
			GameMusic.ForestTop,
			GameMusic.MainTheme
		];
	},

	getMusicInfo: function (music: GameMusic): { filename: string, volume: number } {
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
					filename: "SpringSpring/ForestTop.ogg",
					volume: 0.60
				};
			case GameMusic.MainTheme:
				return {
					filename: "wansti/theme.ogg",
					volume: 0.10
				};
		}
	}
};
