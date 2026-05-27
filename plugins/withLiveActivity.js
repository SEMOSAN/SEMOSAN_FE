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

    for (const file of SWIFT_FILES) {
      xcodeProject.addSourceFile(
        path.join(WIDGET_SOURCE_DIR, file),
        { target: target.uuid },
        groupKey
      );
    }

    xcodeProject.addFile(
      path.join(WIDGET_SOURCE_DIR, 'Info.plist'),
      groupKey,
      { target: target.uuid }
    );

    xcodeProject.addFramework('WidgetKit.framework', {
      target: target.uuid,
      embed: false,
    });
    xcodeProject.addFramework('SwiftUI.framework', {
      target: target.uuid,
      embed: false,
    });

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

const withLiveActivity = (config) => {
  config = withLiveActivityInfoPlist(config);
  config = withLiveActivityEntitlements(config);
  config = withWidgetExtensionTarget(config);
  return config;
};

module.exports = withLiveActivity;
