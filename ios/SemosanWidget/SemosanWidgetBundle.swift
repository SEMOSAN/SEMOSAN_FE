import CoreText
import SwiftUI
import WidgetKit

@main
struct SemosanWidgetBundle: WidgetBundle {
    init() {
        if let url = Bundle.main.url(forResource: "Lexend-SemiBold", withExtension: "ttf"),
           let provider = CGDataProvider(url: url as CFURL),
           let cgFont = CGFont(provider) {
            var error: Unmanaged<CFError>?
            CTFontManagerRegisterGraphicsFont(cgFont, &error)
        }
    }

    var body: some Widget {
        SemosanLiveActivity()
    }
}
