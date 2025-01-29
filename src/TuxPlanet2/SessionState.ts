
type SessionState = {
	hasStarted: boolean,
	overworldMapSeed: number,
	overworldLocation: { tileX: number, tileY: number },
	completedLevels: Level[],
	lastSelectedDifficulty: Difficulty
}

let SessionStateUtil = {

	generateInitialSessionState: function (): SessionState {
		
		let seed = Math.floor(Math.random() * (1000 * 1000 * 1000));

		let overworldMap: OverworldMap = OverworldMapGeneration.generateOverworldMap(seed);
		let levelLocations = OverworldMapUtil.getLevelLocations(overworldMap);
		let level1Location = levelLocations[Level.Level1]!;

		return {
			hasStarted: false,
			overworldMapSeed: seed,
			overworldLocation: { tileX: level1Location.tileX, tileY: level1Location.tileY },
			completedLevels: [],
			lastSelectedDifficulty: Difficulty.Normal
		};
	},

	clearSessionState: function (sessionState: SessionState): void {
		let newSessionState = SessionStateUtil.generateInitialSessionState();

		sessionState.hasStarted = newSessionState.hasStarted;
		sessionState.overworldMapSeed = newSessionState.overworldMapSeed;
		sessionState.overworldLocation = newSessionState.overworldLocation;
		sessionState.completedLevels = newSessionState.completedLevels;
		sessionState.lastSelectedDifficulty = newSessionState.lastSelectedDifficulty;
	},

	serializeSessionState: function (sessionState: SessionState): number[] {

		let byteListBuilder = ByteListUtil.getByteListBuilder();

		byteListBuilder.addBool(sessionState.hasStarted);

		byteListBuilder.addInt(sessionState.overworldMapSeed);

		byteListBuilder.addInt(sessionState.overworldLocation.tileX);
		byteListBuilder.addInt(sessionState.overworldLocation.tileY);

		let completedLevelIds: number[] = sessionState.completedLevels.map(level => LevelUtil.getLevelIdFromLevel(level));
		byteListBuilder.addIntList(completedLevelIds);

		byteListBuilder.addInt(DifficultyUtil.getDifficultyIdFromDifficulty(sessionState.lastSelectedDifficulty));

		let returnValue: number[] = byteListBuilder.toByteList();
		return returnValue;
	},

	deserializeSessionState: function (serializedSessionState: number[], sessionState: SessionState): void {

		let byteListIterator = ByteListUtil.getByteListIterator(serializedSessionState);

		sessionState.hasStarted = byteListIterator.popBool();

		sessionState.overworldMapSeed = byteListIterator.popInt();

		sessionState.overworldLocation.tileX = byteListIterator.popInt();
		sessionState.overworldLocation.tileY = byteListIterator.popInt();

		let completedLevels: Level[] = byteListIterator.popIntList().map(levelId => LevelUtil.getLevelFromLevelId(levelId));
		sessionState.completedLevels = completedLevels;

		sessionState.lastSelectedDifficulty = DifficultyUtil.getDifficultyFromDifficultyId(byteListIterator.popInt());

		if (byteListIterator.hasNextByte())
			throw new Error("Invalid serializedSessionState");
	}
};
