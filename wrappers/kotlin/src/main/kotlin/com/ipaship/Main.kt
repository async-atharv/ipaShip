package com.ipaship

fun main(args: Array<String>) {
    try {
        val command = mutableListOf("npx", "--yes", "@async-atharv/ipaship")
        command.addAll(args)

        val process = ProcessBuilder(command)
            .inheritIO()
            .start()

        val exitCode = process.waitFor()
        kotlin.system.exitProcess(exitCode)
    } catch (e: Exception) {
        System.err.println("Error running ipaShip: ${e.message}")
        kotlin.system.exitProcess(1)
    }
}
