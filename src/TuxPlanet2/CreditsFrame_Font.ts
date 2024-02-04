
let CreditsFrame_Font = {
	render: function (displayOutput: IDisplayOutput, width: number, height: number, buildType: BuildType): void {

		let text = "The font used in this game was generated by metaflop and then \n"
			+ "slightly modified by dtsudo. \n"
			+ "https://www.metaflop.com/modulator \n"
			+ "\n"
			+ "The font is licensed under SIL Open Font License v1.1 \n"
			+ "See the source code for more details about the license. \n";

		displayOutput.drawText(
			10,
			height - 10,
			text,
			GameFont.SimpleFont,
			27,
			black);
	}
};
