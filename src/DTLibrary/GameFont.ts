
const enum GameFont {
	SimpleFont
}

let GameFontUtil = {
	getFontNames: function (): GameFont[] {
		return [
			GameFont.SimpleFont
		];
	},

	getFontFilename: function (font: GameFont): string {
		switch (font) {
			case GameFont.SimpleFont: return "Metaflop/dtsimplefont.woff";
		}
	}
};
