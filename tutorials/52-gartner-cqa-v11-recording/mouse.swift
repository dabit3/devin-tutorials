// Human-like mouse daemon. stdin lines: "move x y ms" | "click" | "down" | "up" | "scroll dy ms" | "pos"
import Foundation
import CoreGraphics
func cur() -> CGPoint { CGEvent(source: nil)!.location }
func post(_ t: CGEventType, _ p: CGPoint) { CGEvent(mouseEventSource: nil, mouseType: t, mouseCursorPosition: p, mouseButton: .left)?.post(tap: .cghidEventTap) }
var down = false
func ease(_ t: Double) -> Double { t < 0.5 ? 4*t*t*t : 1 - pow(-2*t + 2, 3)/2 }
func move(_ x: Double, _ y: Double, _ ms: Double) {
  let a = cur(); let dx = x - a.x, dy = y - a.y
  let dist = hypot(dx, dy); if dist < 1 { return }
  // bowed path: control point offset perpendicular, random side
  let bow = Double.random(in: 0.04...0.12) * dist * (Bool.random() ? 1 : -1)
  let cx = a.x + dx*0.5 - dy/dist*bow, cy = a.y + dy*0.5 + dx/dist*bow
  let steps = max(12, Int(ms / 8))
  // slight overshoot for long moves
  let over = dist > 300 ? Double.random(in: 0.01...0.03) : 0
  let tx = x + dx*over, ty = y + dy*over
  for i in 1...steps {
    let t = ease(Double(i)/Double(steps))
    let px = (1-t)*(1-t)*a.x + 2*(1-t)*t*cx + t*t*tx
    let py = (1-t)*(1-t)*a.y + 2*(1-t)*t*cy + t*t*ty
    post(down ? .leftMouseDragged : .mouseMoved, CGPoint(x: px, y: py))
    usleep(useconds_t(ms*1000/Double(steps)))
  }
  if over > 0 { for i in 1...10 { let t = Double(i)/10; post(down ? .leftMouseDragged : .mouseMoved, CGPoint(x: tx + (x-tx)*t, y: ty + (y-ty)*t)); usleep(12000) } }
}
while let line = readLine() {
  let f = line.split(separator: " ").map(String.init); if f.isEmpty { continue }
  switch f[0] {
  case "move": move(Double(f[1])!, Double(f[2])!, Double(f.count > 3 ? f[3] : "600")!)
  case "warp": CGWarpMouseCursorPosition(CGPoint(x: Double(f[1])!, y: Double(f[2])!)); post(.mouseMoved, CGPoint(x: Double(f[1])!, y: Double(f[2])!))
  case "click": let p = cur(); post(.leftMouseDown, p); usleep(useconds_t(Int.random(in: 60000...110000))); post(.leftMouseUp, p)
  case "down": down = true; post(.leftMouseDown, cur())
  case "up": down = false; post(.leftMouseUp, cur())
  case "scroll":
    let total = Int(f[1])!, ms = Double(f.count > 2 ? f[2] : "700")!; let n = max(8, Int(ms/16)); var done = 0
    for i in 1...n { let t = ease(Double(i)/Double(n)); let want = Int(Double(total)*t); let d = want - done; done = want
      if d != 0 { CGEvent(scrollWheelEvent2Source: nil, units: .pixel, wheelCount: 1, wheel1: Int32(-d), wheel2: 0, wheel3: 0)?.post(tap: .cghidEventTap) }
      usleep(useconds_t(ms*1000/Double(n))) }
  case "type":
    let text = line.dropFirst(5)
    for ch in text { let u = Array(String(ch).utf16)
      for d in [true, false] { let e = CGEvent(keyboardEventSource: nil, virtualKey: 0, keyDown: d); e?.flags = []; e?.keyboardSetUnicodeString(stringLength: u.count, unicodeString: u); e?.post(tap: .cghidEventTap) }
      usleep(useconds_t(Int.random(in: 45000...140000) + (ch == " " ? 40000 : 0))) }
  case "key":
    let code = CGKeyCode(Int(f[1])!); var flags: CGEventFlags = []  // flags set explicitly on every event so Cmd never sticks
    if f.count > 2 && f[2].contains("cmd") { flags.insert(.maskCommand) }
    for d in [true, false] { let e = CGEvent(keyboardEventSource: nil, virtualKey: code, keyDown: d); e?.flags = flags; e?.post(tap: .cghidEventTap) }
  case "pos": let p = cur(); print(p.x, p.y)
  default: break
  }
  print("ok"); fflush(stdout)
}
