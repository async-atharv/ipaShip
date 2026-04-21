import Foundation

let arguments = Array(ProcessInfo.processInfo.arguments.dropFirst())
let task = Process()
task.executableURL = URL(fileURLWithPath: "/usr/bin/env")
var args = ["npx", "--yes", "@async-atharv/ipaship"]
args.append(contentsOf: arguments)
task.arguments = args
task.standardInput = FileHandle.standardInput
task.standardOutput = FileHandle.standardOutput
task.standardError = FileHandle.standardError

do {
    try task.run()
    task.waitUntilExit()
    exit(task.terminationStatus)
} catch {
    print("Error running ipaship: \(error)")
    exit(1)
}