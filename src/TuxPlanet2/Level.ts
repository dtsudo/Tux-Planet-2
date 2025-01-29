
const enum Level {
	Level1,
	Level2
}

let LevelUtil = {
	getLevelIdFromLevel: function (level: Level): number {
		switch (level) {
			case Level.Level1: return 1;
			case Level.Level2: return 2;
		}
	},

	getLevelFromLevelId: function (levelId: number): Level {

		if (levelId === 1) return Level.Level1;
		if (levelId === 2) return Level.Level2;

		throw new Error("Unrecognized levelId");
	},

	getFinalLevel: function (): Level {
		return Level.Level2;
	}
};
