import ExpoModulesCore
import Expo
import ExpoAppleAuthentication
import EXApplication
import ExpoAsset
import EXConstants
import ExpoDevice
import ExpoFileSystem
import ExpoFont
import ExpoHaptics
import ExpoImage
import ExpoImagePicker
import ExpoKeepAwake
import ExpoLinearGradient
import ExpoLinking
import ExpoLocation
import ExpoMediaLibrary
import EXNotifications
import ExpoHead
import ExpoSplashScreen
import ExpoSymbols
import ExpoSystemUI
import ExpoWebBrowser
#if EXPO_CONFIGURATION_DEBUG
import EXDevLauncher
import EXDevMenu
#endif

@objc(ExpoModulesProvider)
public class ExpoModulesProvider: ModulesProvider {
  public override func getModuleClasses() -> [AnyModule.Type] {
    #if EXPO_CONFIGURATION_DEBUG
    return [
      ExpoFetchModule.self,
      AppleAuthenticationModule.self,
      ApplicationModule.self,
      AssetModule.self,
      ConstantsModule.self,
      DeviceModule.self,
      FileSystemModule.self,
      FileSystemLegacyModule.self,
      FontLoaderModule.self,
      FontUtilsModule.self,
      HapticsModule.self,
      ImageModule.self,
      ImagePickerModule.self,
      KeepAwakeModule.self,
      LinearGradientModule.self,
      ExpoLinkingModule.self,
      LocationModule.self,
      MediaLibraryModule.self,
      MediaLibraryNextModule.self,
      BackgroundModule.self,
      BadgeModule.self,
      CategoriesModule.self,
      EmitterModule.self,
      HandlerModule.self,
      PermissionsModule.self,
      PresentationModule.self,
      PushTokenModule.self,
      SchedulerModule.self,
      ServerRegistrationModule.self,
      ExpoHeadModule.self,
      LinkPreviewNativeModule.self,
      SplashScreenModule.self,
      SymbolModule.self,
      ExpoSystemUIModule.self,
      WebBrowserModule.self,
      DevMenuModule.self,
      DevMenuInternalModule.self,
      DevMenuPreferences.self,
      LiveActivityModule.self,
    ]
    #else
    return [
      ExpoFetchModule.self,
      AppleAuthenticationModule.self,
      ApplicationModule.self,
      AssetModule.self,
      ConstantsModule.self,
      DeviceModule.self,
      FileSystemModule.self,
      FileSystemLegacyModule.self,
      FontLoaderModule.self,
      FontUtilsModule.self,
      HapticsModule.self,
      ImageModule.self,
      ImagePickerModule.self,
      KeepAwakeModule.self,
      LinearGradientModule.self,
      ExpoLinkingModule.self,
      LocationModule.self,
      MediaLibraryModule.self,
      MediaLibraryNextModule.self,
      BackgroundModule.self,
      BadgeModule.self,
      CategoriesModule.self,
      EmitterModule.self,
      HandlerModule.self,
      PermissionsModule.self,
      PresentationModule.self,
      PushTokenModule.self,
      SchedulerModule.self,
      ServerRegistrationModule.self,
      ExpoHeadModule.self,
      LinkPreviewNativeModule.self,
      SplashScreenModule.self,
      SymbolModule.self,
      ExpoSystemUIModule.self,
      WebBrowserModule.self,
      LiveActivityModule.self,
    ]
    #endif
  }

  public override func getAppDelegateSubscribers() -> [ExpoAppDelegateSubscriber.Type] {
    #if EXPO_CONFIGURATION_DEBUG
    return [
      FileSystemBackgroundSessionHandler.self,
      LinkingAppDelegateSubscriber.self,
      NotificationsAppDelegateSubscriber.self,
      ExpoHeadAppDelegateSubscriber.self,
      SplashScreenAppDelegateSubscriber.self,
      ExpoDevLauncherAppDelegateSubscriber.self
    ]
    #else
    return [
      FileSystemBackgroundSessionHandler.self,
      LinkingAppDelegateSubscriber.self,
      NotificationsAppDelegateSubscriber.self,
      ExpoHeadAppDelegateSubscriber.self,
      SplashScreenAppDelegateSubscriber.self
    ]
    #endif
  }

  public override func getReactDelegateHandlers() -> [ExpoReactDelegateHandlerTupleType] {
    #if EXPO_CONFIGURATION_DEBUG
    return [
      (packageName: "expo-dev-launcher", handler: ExpoDevLauncherReactDelegateHandler.self),
      (packageName: "expo-dev-menu", handler: ExpoDevMenuReactDelegateHandler.self)
    ]
    #else
    return [
    ]
    #endif
  }

  public override func getAppCodeSignEntitlements() -> AppCodeSignEntitlements {
    return AppCodeSignEntitlements.from(json: #"{}"#)
  }
}
