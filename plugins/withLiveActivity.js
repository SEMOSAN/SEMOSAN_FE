const {
  withInfoPlist,
  withEntitlementsPlist,
  withXcodeProject,
} = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

const WIDGET_TARGET = 'SemosanWidget';
const WIDGET_SOURCE_DIR = 'SemosanWidget';
const SWIFT_FILES = [
  'SemosanWidgetBundle.swift',
  'SemosanLiveActivity.swift',
  'SemosanLiveActivityAttributes.swift',
];
const RESOURCE_FILES = [
  'Assets.xcassets',
  'Lexend-SemiBold.ttf',
];

const withLiveActivityInfoPlist = (config) =>
  withInfoPlist(config, (mod) => {
    mod.modResults.NSSupportsLiveActivities = true;
    mod.modResults.NSSupportsLiveActivitiesFrequentUpdates = true;
    return mod;
  });

const withLiveActivityEntitlements = (config) =>
  withEntitlementsPlist(config, (mod) => {
    return mod;
  });

function generateUUID() {
  return 'XXXXXXXXXXXXXXXXXXXXXXXX'.replace(/X/g, () =>
    Math.floor(Math.random() * 16).toString(16).toUpperCase()
  );
}

const withWidgetExtensionTarget = (config) =>
  withXcodeProject(config, (mod) => {
    const xcodeProject = mod.modResults;
    const bundleId = mod.ios?.bundleIdentifier ?? 'com.example.app';
    const projectRoot = mod.modRequest.projectRoot;

    const targets = xcodeProject.pbxNativeTargetSection();
    const alreadyAdded = Object.values(targets).some(
      (t) => typeof t === 'object' && t?.name === WIDGET_TARGET
    );
    if (alreadyAdded) return mod;

    const srcDir = path.join(projectRoot, 'ios', WIDGET_SOURCE_DIR);
    if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

    const target = xcodeProject.addTarget(
      WIDGET_TARGET,
      'app_extension',
      WIDGET_SOURCE_DIR,
      `${bundleId}.${WIDGET_TARGET}`
    );

    const groupKey = xcodeProject.pbxCreateGroup(WIDGET_TARGET, WIDGET_SOURCE_DIR);

    const pbxBuildFileSection = xcodeProject.hash.project.objects['PBXBuildFile'];
    const pbxFileRefSection = xcodeProject.hash.project.objects['PBXFileReference'];
    const nativeTarget = xcodeProject.pbxNativeTargetSection()[target.uuid];

    // --- Create a Sources build phase for the widget target ---
    const sourcesPhaseUUID = generateUUID();
    const pbxSourcesSection = xcodeProject.hash.project.objects['PBXSourcesBuildPhase'] || {};
    xcodeProject.hash.project.objects['PBXSourcesBuildPhase'] = pbxSourcesSection;

    const swiftBuildFileRefs = [];
    for (const file of SWIFT_FILES) {
      const filePath = path.join(WIDGET_SOURCE_DIR, file);
      const fileRefUUID = generateUUID();
      const buildFileUUID = generateUUID();

      pbxFileRefSection[fileRefUUID] = {
        isa: 'PBXFileReference',
        explicitFileType: 'undefined',
        fileEncoding: 4,
        includeInIndex: 0,
        lastKnownFileType: 'sourcecode.swift',
        name: `"${file}"`,
        path: `"${filePath}"`,
        sourceTree: '"<group>"',
      };
      pbxFileRefSection[`${fileRefUUID}_comment`] = file;

      pbxBuildFileSection[buildFileUUID] = {
        isa: 'PBXBuildFile',
        fileRef: fileRefUUID,
        fileRef_comment: file,
      };
      pbxBuildFileSection[`${buildFileUUID}_comment`] = `${file} in Sources`;

      swiftBuildFileRefs.push({ value: buildFileUUID, comment: `${file} in Sources` });

      const group = xcodeProject.pbxGroupByName(WIDGET_TARGET);
      if (group) group.children.push({ value: fileRefUUID, comment: file });
    }

    pbxSourcesSection[sourcesPhaseUUID] = {
      isa: 'PBXSourcesBuildPhase',
      buildActionMask: 2147483647,
      files: swiftBuildFileRefs,
      runOnlyForDeploymentPostprocessing: 0,
    };
    pbxSourcesSection[`${sourcesPhaseUUID}_comment`] = 'Sources';

    // Prepend Sources phase to widget target's buildPhases
    if (nativeTarget.buildPhases) {
      nativeTarget.buildPhases.unshift({ value: sourcesPhaseUUID, comment: 'Sources' });
    }

    // --- Add Info.plist file reference ---
    xcodeProject.addFile(
      path.join(WIDGET_SOURCE_DIR, 'Info.plist'),
      groupKey,
      { target: target.uuid }
    );

    // --- Add Resources build phase with Assets + font ---
    const resourcesPhaseUUID = generateUUID();
    const pbxResourcesSection = xcodeProject.hash.project.objects['PBXResourcesBuildPhase'] || {};
    xcodeProject.hash.project.objects['PBXResourcesBuildPhase'] = pbxResourcesSection;

    const resourceFiles = [];
    for (const resFile of RESOURCE_FILES) {
      const filePath = path.join(WIDGET_SOURCE_DIR, resFile);
      const fileRefUUID = generateUUID();
      const buildFileUUID = generateUUID();
      const isAsset = resFile.endsWith('.xcassets');

      pbxFileRefSection[fileRefUUID] = {
        isa: 'PBXFileReference',
        lastKnownFileType: isAsset ? 'folder.assetcatalog' : 'file',
        name: `"${resFile}"`,
        path: `"${filePath}"`,
        sourceTree: '"<group>"',
      };
      pbxFileRefSection[`${fileRefUUID}_comment`] = resFile;

      pbxBuildFileSection[buildFileUUID] = {
        isa: 'PBXBuildFile',
        fileRef: fileRefUUID,
        fileRef_comment: resFile,
      };
      pbxBuildFileSection[`${buildFileUUID}_comment`] = `${resFile} in Resources`;

      resourceFiles.push({ value: buildFileUUID, comment: `${resFile} in Resources` });

      const group = xcodeProject.pbxGroupByName(WIDGET_TARGET);
      if (group) group.children.push({ value: fileRefUUID, comment: resFile });
    }

    pbxResourcesSection[resourcesPhaseUUID] = {
      isa: 'PBXResourcesBuildPhase',
      buildActionMask: 2147483647,
      files: resourceFiles,
      runOnlyForDeploymentPostprocessing: 0,
    };
    pbxResourcesSection[`${resourcesPhaseUUID}_comment`] = 'Resources';

    // Attach Resources phase to widget target
    if (nativeTarget.buildPhases) {
      nativeTarget.buildPhases.push({ value: resourcesPhaseUUID, comment: 'Resources' });
    }

    // --- Frameworks ---
    xcodeProject.addFramework('WidgetKit.framework', {
      target: target.uuid,
      embed: false,
    });
    xcodeProject.addFramework('SwiftUI.framework', {
      target: target.uuid,
      embed: false,
    });

    // --- Build settings ---
    const buildConfigs = xcodeProject.pbxXCBuildConfigurationSection();
    for (const key of Object.keys(buildConfigs)) {
      const cfg = buildConfigs[key];
      if (
        typeof cfg !== 'object' ||
        (cfg?.buildSettings?.PRODUCT_NAME !== `"${WIDGET_TARGET}"` &&
          cfg?.buildSettings?.PRODUCT_NAME !== WIDGET_TARGET)
      ) continue;

      cfg.buildSettings = {
        ...cfg.buildSettings,
        SWIFT_VERSION: '5.0',
        IPHONEOS_DEPLOYMENT_TARGET: '16.2',
        PRODUCT_BUNDLE_IDENTIFIER: `${bundleId}.${WIDGET_TARGET}`,
        SKIP_INSTALL: 'YES',
        CODE_SIGN_STYLE: 'Automatic',
        TARGETED_DEVICE_FAMILY: '"1,2"',
      };
    }

    return mod;
  });

// Post-process: move widget Swift files out of main app's Sources phase
const withFixWidgetSources = (config) =>
  withXcodeProject(config, (mod) => {
    const xcodeProject = mod.modResults;
    const pbxBuildFileSection = xcodeProject.hash.project.objects['PBXBuildFile'];
    const pbxSourcesSection = xcodeProject.hash.project.objects['PBXSourcesBuildPhase'];

    if (!pbxSourcesSection) return mod;

    // Collect build file UUIDs that reference widget Swift files
    const widgetSwiftBuildFileUUIDs = new Set();
    for (const [uuid, entry] of Object.entries(pbxBuildFileSection)) {
      if (uuid.endsWith('_comment')) continue;
      if (typeof entry !== 'object') continue;
      const comment = pbxBuildFileSection[`${uuid}_comment`] || '';
      if (SWIFT_FILES.some((f) => comment.includes(f))) {
        widgetSwiftBuildFileUUIDs.add(uuid);
      }
    }

    // Find main app target's Sources phase (the one without widget files that was there first)
    // and widget target's Sources phase
    const targets = xcodeProject.pbxNativeTargetSection();
    let mainSourcesUUID = null;
    let widgetSourcesUUID = null;

    for (const [tUUID, target] of Object.entries(targets)) {
      if (tUUID.endsWith('_comment') || typeof target !== 'object') continue;
      const isWidget = target.name === WIDGET_TARGET || target.name === `"${WIDGET_TARGET}"`;
      for (const phaseRef of target.buildPhases || []) {
        const phaseUUID = typeof phaseRef === 'string' ? phaseRef : phaseRef.value;
        if (pbxSourcesSection[phaseUUID]) {
          if (isWidget) widgetSourcesUUID = phaseUUID;
          else if (!isWidget && !mainSourcesUUID) mainSourcesUUID = phaseUUID;
        }
      }
    }

    if (!mainSourcesUUID || !widgetSourcesUUID) return mod;

    const mainPhase = pbxSourcesSection[mainSourcesUUID];
    const widgetPhase = pbxSourcesSection[widgetSourcesUUID];

    // Remove widget files from main Sources, add to widget Sources (if not already there)
    const toMove = [];
    mainPhase.files = (mainPhase.files || []).filter((ref) => {
      const uuid = typeof ref === 'string' ? ref : ref.value;
      if (widgetSwiftBuildFileUUIDs.has(uuid)) {
        toMove.push(ref);
        return false;
      }
      return true;
    });

    const existingInWidget = new Set(
      (widgetPhase.files || []).map((r) => (typeof r === 'string' ? r : r.value))
    );
    for (const ref of toMove) {
      const uuid = typeof ref === 'string' ? ref : ref.value;
      if (!existingInWidget.has(uuid)) {
        widgetPhase.files = widgetPhase.files || [];
        widgetPhase.files.push(ref);
      }
    }

    return mod;
  });

const withLiveActivity = (config) => {
  config = withLiveActivityInfoPlist(config);
  config = withLiveActivityEntitlements(config);
  config = withWidgetExtensionTarget(config);
  config = withFixWidgetSources(config);
  return config;
};

module.exports = withLiveActivity;
