plugins {
    kotlin("jvm") version "1.9.22"
    application
}

group = "io.github.async-atharv"
version = "1.3.0"

repositories {
    mavenCentral()
}

application {
    mainClass.set("com.ipaship.MainKt")
}

tasks.jar {
    manifest {
        attributes["Main-Class"] = "com.ipaship.MainKt"
    }
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}
