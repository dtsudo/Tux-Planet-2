
let CreditsFrame_Sound = {
	render: function (displayOutput: IDisplayOutput, width: number, height: number, buildType: BuildType): void {

		let text = "Sound effects created by: \n"
			+ "* Basto \n"
			+ "* Kenney \n"
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
