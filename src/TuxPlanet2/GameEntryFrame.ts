
let GameEntryFrame = {
	getFirstFrame: function (buildType: BuildType, debugMode: boolean): IFrame {

		let versionInfo: Version = VersionInfo.getCurrentVersion();

		if (versionInfo.version === "1.01")
			SavedDataMigration_ToV1_01.migrateAllDataFromOlderVersionsToV1_01IfNeeded();
		else
			throw new Error("Unrecognized version");

		let globalState: GlobalState = {
			buildType: buildType,
			debugMode: debugMode,
			saveAndLoadData: SaveAndLoadDataUtil.getSaveAndLoadData()
		};

		return InitialLoadingScreenFrame.getFrame(globalState);
	}
};
