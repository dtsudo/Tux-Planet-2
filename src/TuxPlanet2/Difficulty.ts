
const enum Difficulty {
	Easy,
	Normal,
	Hard
}

let DifficultyUtil = {
	getDifficultyIdFromDifficulty: function (difficulty: Difficulty): number {
		switch (difficulty) {
			case Difficulty.Easy: return 1;
			case Difficulty.Normal: return 2;
			case Difficulty.Hard: return 3;
		}
	},

	getDifficultyFromDifficultyId: function (difficultyId: number): Difficulty {

		if (difficultyId === 1) return Difficulty.Easy;
		if (difficultyId === 2) return Difficulty.Normal;
		if (difficultyId === 3) return Difficulty.Hard;

		throw new Error("Unrecognized difficultyId");
	}
};
