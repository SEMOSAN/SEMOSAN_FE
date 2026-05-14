import {
  ConfigPlugin,
  withInfoPlist,
  withEntitlementsPlist,
  withXcodeProject,
  IOSConfig,
} from '@expo/config-plugins';
import * as path from 'path';
import * as fs from 'fs';

const WIDGET_TARGET = 'SemosanWidget';
const WIDGET_SOURCE_DIR = 'SemosanWidget';
const SWIFT_FILES = [
  'SemosanWidgetBundle.swift',
  'SemosanLiveActivity.swift',
  'SemosanLiveActivityAttributes.swift',
];

// ── Step 1: 메인 앱 Info.plist에 NSSupportsLiveActivities 추가 ──
const withLiveActivityInfoPlist: ConfigPlugin = (config) =>
  withInfoPlist(config, (mod) => {
    mod.modResults.NSSupportsLiveActivities = true;
    mod.modResults.NSSupportsLiveActivitiesFrequentUpdates = true;
    return mod;
  });

// ── Step 2: 메인 앱 Entitlements 설정 ──
const withLiveActivityEntitlements: ConfigPlugin = (config) =>
  withEntitlementsPlist(config, (mod) => {
    // Live Activities는 별도 entitlement 불필요.
    // App Groups가 필요할 경우 여기에 추가.
    return mod;
  });

// ── Step 3: Xcode 프로젝트에 Widget Extension 타깃 추가 ──
const withWidgetExtensionTarget: ConfigPlugin = (config) =>
  withXcodeProject(config, (mod) => {
    const xcodeProject = mod.modResults;
    const bundleId = mod.ios?.bundleIdentifier ?? 'com.example.app';
    const projectRoot = mod.modRequest.projectRoot;
    const iosRoot = path.join(projectRoot, 'ios');

    // 이미 타깃이 존재하면 스킵
    const targets = xcodeProject.pbxNativeTargetSection();
    const alreadyAdded = Object.values(targets as Record<string, any>).some(
      (t) => typeof t === 'object' && t?.name === WIDGET_TARGET
    );
    if (alreadyAdded) return mod;

    // Widget Extension 소스 파일들을 ios/SemosanWidget/으로 복사
    const srcDir = path.join(projectRoot, 'ios', WIDGET_SOURCE_DIR);
    if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

    // project.pbxproj에 타깃 추가
    const target = xcodeProject.addTarget(
      WIDGET_TARGET,
      'app_extension',
      WIDGET_SOURCE_DIR,
      `${bundleId}.${WIDGET_TARGET}`
    );

    // PBX 그룹 생성
    const groupKey = xcodeProject.pbxCreateGroup(WIDGET_TARGET, WIDGET_SOURCE_DIR);

    // Swift 소스 파일 추가
    for (const file of SWIFT_FILES) {
      xcodeProject.addSourceFile(
        path.join(WIDGET_SOURCE_DIR, file),
        { target: target.uuid },
        groupKey
      );
    }

    // Info.plist 추가
    xcodeProject.addFile(
      path.join(WIDGET_SOURCE_DIR, 'Info.plist'),
      groupKey,
      { target: target.uuid }
    );

    // WidgetKit 프레임워크 연결
    xcodeProject.addFramework('WidgetKit.framework', {
      target: target.uuid,
      embed: false,
    });
    xcodeProject.addFramework('SwiftUI.framework', {
      target: target.uuid,
      embed: false,
    });

    // 빌드 설정 적용
    const buildConfigs = xcodeProject.pbxXCBuildConfigurationSection() as Record<string, any>;
    for (const key of Object.keys(buildConfigs)) {
      const cfg = buildConfigs[key];
      if (
        typeof cfg !== 'object' ||
        cfg?.buildSettings?.PRODUCT_NAME !== `"${WIDGET_TARGET}"` &&
        cfg?.buildSettings?.PRODUCT_NAME !== WIDGET_TARGET
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

// ── 최종 플러그인 (세 단계 합성) ──
const withLiveActivity: ConfigPlugin = (config) => {
  config = withLiveActivityInfoPlist(config);
  config = withLiveActivityEntitlements(config);
  config = withWidgetExtensionTarget(config);
  return config;
};

export default withLiveActivity;
