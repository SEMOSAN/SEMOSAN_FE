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

    // 폰트 파일 복사 (assets/fonts → ios/SemosanWidget)
    const fontSrc = path.join(projectRoot, 'assets', 'fonts', 'Lexend-SemiBold.ttf');
    const fontDst = path.join(srcDir, 'Lexend-SemiBold.ttf');
    if (fs.existsSync(fontSrc) && !fs.existsSync(fontDst)) {
      fs.copyFileSync(fontSrc, fontDst);
    }

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

const LIVE_ACTIVITY_MODULE_SWIFT = `import ActivityKit
import ExpoModulesCore

// MARK: - Darwin notification bridge (file-level globals for C callback access)

private var _pauseHandler: (() -> Void)?
private var _resumeHandler: (() -> Void)?

private func _darwinPauseCallback(
    _ center: CFNotificationCenter?,
    _ observer: UnsafeMutableRawPointer?,
    _ name: CFNotificationName?,
    _ object: UnsafeRawPointer?,
    _ userInfo: CFDictionary?
) {
    DispatchQueue.main.async { _pauseHandler?() }
}

private func _darwinResumeCallback(
    _ center: CFNotificationCenter?,
    _ observer: UnsafeMutableRawPointer?,
    _ name: CFNotificationName?,
    _ object: UnsafeRawPointer?,
    _ userInfo: CFDictionary?
) {
    DispatchQueue.main.async { _resumeHandler?() }
}

// MARK: - Module

public class LiveActivityModule: Module {
    private var widgetIsRunningOverride: Bool? = nil
    private var widgetOverrideExpiry: Date = .distantPast

    public func definition() -> ModuleDefinition {
        Name("LiveActivityModule")

        Events("onLiveActivityControl")

        OnCreate {
            _pauseHandler = { [weak self] in
                self?.widgetIsRunningOverride = false
                self?.widgetOverrideExpiry = Date().addingTimeInterval(3.0)
                self?.sendEvent("onLiveActivityControl", ["action": "pause"])
            }
            _resumeHandler = { [weak self] in
                self?.widgetIsRunningOverride = true
                self?.widgetOverrideExpiry = Date().addingTimeInterval(3.0)
                self?.sendEvent("onLiveActivityControl", ["action": "resume"])
            }

            let darwinCenter = CFNotificationCenterGetDarwinNotifyCenter()
            let ptr = Unmanaged.passUnretained(self).toOpaque()

            CFNotificationCenterAddObserver(
                darwinCenter, ptr, _darwinPauseCallback,
                "com.tastyhiking.semosanapp.liveactivity.pause" as CFString,
                nil, .deliverImmediately
            )
            CFNotificationCenterAddObserver(
                darwinCenter, ptr, _darwinResumeCallback,
                "com.tastyhiking.semosanapp.liveactivity.resume" as CFString,
                nil, .deliverImmediately
            )

            if #available(iOS 16.2, *) {
                Task {
                    for activity in Activity<SemosanLiveActivityAttributes>.activities {
                        await activity.end(.none, dismissalPolicy: .immediate)
                    }
                }
            }
        }

        AsyncFunction("startActivity") { (params: [String: Any]) async throws -> String in
            guard #available(iOS 16.2, *) else {
                throw Exception(name: "UNSUPPORTED", description: "Live Activities require iOS 16.2+")
            }
            guard ActivityAuthorizationInfo().areActivitiesEnabled else {
                throw Exception(name: "LIVE_ACTIVITY_DISABLED", description: "Live Activities are not enabled on this device")
            }

            for activity in Activity<SemosanLiveActivityAttributes>.activities {
                await activity.end(.none, dismissalPolicy: .immediate)
            }
            try? await Task.sleep(nanoseconds: 300_000_000)

            let modeStr = params["mode"] as? String ?? "free"
            let mode: SemosanLiveActivityAttributes.Mode = modeStr == "course" ? .course : .free

            let attributes = SemosanLiveActivityAttributes(mode: mode)
            let initialState = SemosanLiveActivityAttributes.ContentState(
                elapsedSeconds: 0,
                isRunning: true,
                timerStartEpoch: params["timerStartEpoch"] as? Double ?? Date().timeIntervalSince1970 * 1000,
                remainingMinutes: params["remainingMinutes"] as? Int ?? 0,
                remainingMeters: params["remainingMeters"] as? Int ?? 0,
                progress: params["progress"] as? Double ?? 0.0
            )

            let activity = try Activity<SemosanLiveActivityAttributes>.request(
                attributes: attributes,
                content: .init(state: initialState, staleDate: nil),
                pushType: nil
            )
            return activity.id
        }

        AsyncFunction("updateActivity") { (params: [String: Any]) async throws in
            guard #available(iOS 16.2, *) else { return }
            guard let activity = Activity<SemosanLiveActivityAttributes>.activities.first else {
                throw Exception(name: "LIVE_ACTIVITY_NOT_FOUND", description: "No active Live Activity found")
            }

            let jsIsRunning = params["isRunning"] as? Bool ?? true
            var actualIsRunning = jsIsRunning

            if let override = self.widgetIsRunningOverride, Date() < self.widgetOverrideExpiry {
                actualIsRunning = override
                if jsIsRunning == override {
                    self.widgetIsRunningOverride = nil
                }
            } else {
                self.widgetIsRunningOverride = nil
            }

            let newState = SemosanLiveActivityAttributes.ContentState(
                elapsedSeconds: params["elapsedSeconds"] as? Int ?? 0,
                isRunning: actualIsRunning,
                timerStartEpoch: params["timerStartEpoch"] as? Double,
                remainingMinutes: params["remainingMinutes"] as? Int ?? 0,
                remainingMeters: params["remainingMeters"] as? Int ?? 0,
                progress: params["progress"] as? Double ?? 0.0
            )
            await activity.update(.init(state: newState, staleDate: nil))
        }

        AsyncFunction("stopActivity") { () async throws in
            guard #available(iOS 16.2, *) else { return }
            guard let activity = Activity<SemosanLiveActivityAttributes>.activities.first else {
                return
            }
            await activity.end(.none, dismissalPolicy: .immediate)
        }
    }
}
`;

const withLiveActivityNativeModule = (config) =>
  withXcodeProject(config, (mod) => {
    const xcodeProject = mod.modResults;
    const projectRoot = mod.modRequest.projectRoot;
    const appName = mod.modRequest.projectName ?? 'semosan';
    const targetDir = path.join(projectRoot, 'ios', appName);

    // 파일 쓰기
    fs.writeFileSync(
      path.join(targetDir, 'LiveActivityModule.swift'),
      LIVE_ACTIVITY_MODULE_SWIFT,
      'utf8'
    );
    fs.writeFileSync(
      path.join(targetDir, 'LiveActivityModule.m'),
      '// Replaced by Expo Module (LiveActivityModule.swift)\n',
      'utf8'
    );

    // 이미 추가됐으면 스킵
    const alreadyAdded = Object.values(
      xcodeProject.hash.project.objects['PBXFileReference'] || {}
    ).some((ref) => typeof ref === 'object' && ref?.path?.includes('LiveActivityModule.swift'));
    if (alreadyAdded) return mod;

    // 메인 앱 타겟 UUID 찾기
    const targets = xcodeProject.pbxNativeTargetSection();
    let mainTargetUUID = null;
    for (const [uuid, target] of Object.entries(targets)) {
      if (uuid.endsWith('_comment') || typeof target !== 'object') continue;
      if (target.name === appName || target.name === `"${appName}"`) {
        mainTargetUUID = uuid;
        break;
      }
    }
    if (!mainTargetUUID) return mod;

    // PBX 섹션 직접 조작으로 파일 등록
    const pbxFileRefSection = xcodeProject.hash.project.objects['PBXFileReference'] || {};
    const pbxBuildFileSection = xcodeProject.hash.project.objects['PBXBuildFile'] || {};
    const pbxSourcesSection = xcodeProject.hash.project.objects['PBXSourcesBuildPhase'] || {};

    const fileRefUUID = generateUUID();
    const buildFileUUID = generateUUID();
    const filePath = `${appName}/LiveActivityModule.swift`;

    pbxFileRefSection[fileRefUUID] = {
      isa: 'PBXFileReference',
      lastKnownFileType: 'sourcecode.swift',
      name: '"LiveActivityModule.swift"',
      path: `"${filePath}"`,
      sourceTree: '"<group>"',
    };
    pbxFileRefSection[`${fileRefUUID}_comment`] = 'LiveActivityModule.swift';

    pbxBuildFileSection[buildFileUUID] = {
      isa: 'PBXBuildFile',
      fileRef: fileRefUUID,
      fileRef_comment: 'LiveActivityModule.swift',
    };
    pbxBuildFileSection[`${buildFileUUID}_comment`] = 'LiveActivityModule.swift in Sources';

    // 메인 타겟의 Sources 빌드 페이즈에 추가
    for (const [phaseUUID, phase] of Object.entries(pbxSourcesSection)) {
      if (phaseUUID.endsWith('_comment') || typeof phase !== 'object') continue;
      const target = xcodeProject.pbxNativeTargetSection()[mainTargetUUID];
      const isMainPhase = (target?.buildPhases || []).some(
        (ref) => (typeof ref === 'string' ? ref : ref.value) === phaseUUID
      );
      if (!isMainPhase) continue;
      phase.files = phase.files || [];
      phase.files.push({ value: buildFileUUID, comment: 'LiveActivityModule.swift in Sources' });
      break;
    }

    return mod;
  });

const withLiveActivity = (config) => {
  config = withLiveActivityInfoPlist(config);
  config = withLiveActivityEntitlements(config);
  config = withWidgetExtensionTarget(config);
  config = withFixWidgetSources(config);
  config = withLiveActivityNativeModule(config);
  return config;
};

module.exports = withLiveActivity;
