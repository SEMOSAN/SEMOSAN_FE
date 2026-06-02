import ExpoModulesCore
import Foundation

// AppContext.modulesProvider()는 "semosan.ExpoModulesProvider"를 먼저 찾는다.
// 이 클래스가 메인 앱 모듈(semosan)에 있으면 자동으로 그 이름으로 등록된다.
// Pods 생성 ExpoModulesProvider("ExpoModulesProvider")에 LiveActivityModule을 추가해서 반환.
class ExpoModulesProvider: ModulesProvider {
    override func getModuleClasses() -> [AnyModule.Type] {
        var modules: [AnyModule.Type] = []
        if let podsClass = NSClassFromString("ExpoModulesProvider") as? ModulesProvider.Type,
           podsClass != type(of: self) {
            modules = podsClass.init().getModuleClasses()
        }
        modules.append(LiveActivityModule.self)
        return modules
    }

    override func getAppDelegateSubscribers() -> [ExpoAppDelegateSubscriber.Type] {
        if let podsClass = NSClassFromString("ExpoModulesProvider") as? ModulesProvider.Type,
           podsClass != type(of: self) {
            return podsClass.init().getAppDelegateSubscribers()
        }
        return []
    }

    override func getReactDelegateHandlers() -> [ExpoReactDelegateHandlerTupleType] {
        if let podsClass = NSClassFromString("ExpoModulesProvider") as? ModulesProvider.Type,
           podsClass != type(of: self) {
            return podsClass.init().getReactDelegateHandlers()
        }
        return []
    }

    override func getAppCodeSignEntitlements() -> AppCodeSignEntitlements {
        if let podsClass = NSClassFromString("ExpoModulesProvider") as? ModulesProvider.Type,
           podsClass != type(of: self) {
            return podsClass.init().getAppCodeSignEntitlements()
        }
        return AppCodeSignEntitlements()
    }
}
