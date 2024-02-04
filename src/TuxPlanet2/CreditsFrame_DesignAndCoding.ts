
let CreditsFrame_DesignAndCoding = {
	render: function (displayOutput: IDisplayOutput, width: number, height: number, buildType: BuildType): void {

		let text: string;

		switch (buildType) {
			case BuildType.WebStandalone:
			case BuildType.WebEmbedded:
				text = "Design and coding by dtsudo. \n"
					+ "\n"
					+ "This game is a fangame of SuperTux and SuperTux Advance. \n"
					+ "\n"
					+ "This game is open source, licensed under GPL 3.0. \n"
					+ "(Code dependencies and images/font/sound/music licensed under \n"
					+ "other open source licenses.) \n"
					+ "\n"
					+ "See the source code for more information (including licensing \n"
					+ "details).";
				break;
			case BuildType.Electron:
				text = "Design and coding by dtsudo. \n"
					+ "\n"
					+ "This game is a fangame of SuperTux and SuperTux Advance. \n"
					+ "\n"
					+ "This game is open source, licensed under GPL 3.0. \n"
					+ "(Code dependencies and images/font/sound/music licensed under \n"
					+ "other open source licenses.) \n"
					+ "\n"
					+ "This game uses the Electron framework (https://www.electronjs.org) \n"
					+ "\n"
					+ "See the source code for more information (including licensing \n"
					+ "details).";
				break;
		}

		displayOutput.drawText(
			10,
			height - 10,
			text,
			GameFont.SimpleFont,
			27,
			black);
	}
};
