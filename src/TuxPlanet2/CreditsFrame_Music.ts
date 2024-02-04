
let CreditsFrame_Music = {
	render: function (displayOutput: IDisplayOutput, width: number, height: number, buildType: BuildType): void {

		let text = "Music track authors: \n"
			+ "* Juhani Junkala \n"
			+ "* Spring Spring \n"
			+ "* wansti \n"
			+ "\n"
			+ "See the source code for more information (including licensing \n"
			+ "details).";

		displayOutput.drawText(
			10,
			height - 10,
			text,
			GameFont.SimpleFont,
			27,
			black);
	}
};
