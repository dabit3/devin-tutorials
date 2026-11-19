import Foundation
import CoreGraphics
let desc = CGVirtualDisplayDescriptor()
desc.queue = DispatchQueue.main
desc.name = "Film 4K"
desc.maxPixelsWide = 3840
desc.maxPixelsHigh = 2160
desc.sizeInMillimeters = CGSize(width: 597, height: 336)
desc.productID = 0x1234; desc.vendorID = 0x3456; desc.serialNum = 0x0001
desc.terminationHandler = { _, _ in print("terminated") }
let disp = CGVirtualDisplay(descriptor: desc)!
let s = CGVirtualDisplaySettings()
s.hiDPI = 1
s.modes = [CGVirtualDisplayMode(width: 1920, height: 1080, refreshRate: 60), CGVirtualDisplayMode(width: 3840, height: 2160, refreshRate: 60)]
print("apply", disp.apply(s), "id", disp.displayID)
DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
  let id = disp.displayID
  if let m = CGDisplayCopyDisplayMode(id) { print("mode", m.width, m.height, m.pixelWidth, m.pixelHeight) }
  print("bounds", CGDisplayBounds(id))
  fflush(stdout)
}
RunLoop.main.run()
