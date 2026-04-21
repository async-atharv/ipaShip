import 'dart:io';

void main(List<String> arguments) async {
  var process = await Process.start('npx', ['--yes', '@async-atharv/ipaship', ...arguments], 
      mode: ProcessStartMode.inheritStdio);
  exitCode = await process.exitCode;
}
