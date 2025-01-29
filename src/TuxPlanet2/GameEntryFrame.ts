
let GameEntryFrame = {
	getFirstFrame: function (buildType: BuildType, debugMode: boolean): IFrame {

		let versionInfo: Version = VersionInfo.getCurrentVersion();

		if (versionInfo.version === "1.02")
			SavedDataMigration_ToV1_02.migrateAllDataFromOlderVersionsToV1_02IfNeeded();
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
