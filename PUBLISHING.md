# Publishing & Install Guide for ipaShip

Complete commands for building, installing, and publishing `ipaShip` across **every supported language and package manager**.

> **Important:** The core NPM package must be published first — all wrappers invoke it via `npx`.

---

## 1. Node.js / NPM (Core Package)

### Install
```bash
npm install -g @async-atharv/ipaship
```

### Verify
```bash
ipaShip --version
which ipaShip-mcp
```

### Publish
```bash
npm login
npm publish --access public
```

### Use
```bash
ipaShip init
ipaShip --dir ./my-flutter-app
ipaShip --dir ./ --platform ios --mode store --provider gemini --key YOUR_KEY
```

**View on the web:** [https://www.npmjs.com/package/@async-atharv/ipaship](https://www.npmjs.com/package/@async-atharv/ipaship)

---

## 2. Python / PyPI

### Install (from local wrapper)
```bash
cd wrappers/python
pip install .
```

### Install (from PyPI — after publishing)
```bash
pip install ipaship
```

### Use
```bash
ipaship --dir ./ --platform ios --mode store
```

### Build & Publish to PyPI
```bash
cd wrappers/python
pip install twine wheel setuptools
python setup.py sdist bdist_wheel
twine upload dist/*
```

**View on the web:** [https://pypi.org/project/ipaship/](https://pypi.org/project/ipaship/)

---

## 3. Go / pkg.go.dev

### Install (from local)
```bash
cd wrappers/go
go build -o ipaship .
./ipaship --dir ./my-flutter-app
```

### Install (from GitHub — after tagging)
```bash
go install github.com/async-atharv/ipaShip/wrappers/go@latest
```

### Use
```bash
ipaship --dir ./ --platform android --mode both
```

### Publish
```bash
git tag wrappers/go/v1.3.0
git push origin wrappers/go/v1.3.0
GOPROXY=proxy.golang.org go list -m github.com/async-atharv/ipaShip/wrappers/go@v1.3.0
```

**View on the web:** [https://pkg.go.dev/github.com/async-atharv/ipaShip/wrappers/go](https://pkg.go.dev/github.com/async-atharv/ipaShip/wrappers/go)

---

## 4. Rust / Crates.io

### Install (from local)
```bash
cargo install --path ./wrappers/rust
```

### Install (from crates.io — after publishing)
```bash
cargo install ipaship
```

### Use
```bash
ipaship --dir ./ --platform ios --mode store
```

### Build & Publish
```bash
cd wrappers/rust
cargo login <your-crates-io-token>
cargo publish
```

**View on the web:** [https://crates.io/crates/ipaship](https://crates.io/crates/ipaship)

---

## 5. Dart & Flutter / pub.dev

### Install (from local)
```bash
cd wrappers/dart
dart pub get
dart run bin/ipaship.dart --dir ./my-flutter-app
```

### Install (from pub.dev — after publishing)
```bash
dart pub global activate ipaship
```

### Use
```bash
ipaship --dir ./ --platform both --mode both
```

### Publish
```bash
cd wrappers/dart
dart pub publish --dry-run    # verify first
dart pub publish              # opens OAuth link
```

**View on the web:** [https://pub.dev/packages/ipaship](https://pub.dev/packages/ipaship)

---

## 6. Swift / Swift Package Manager

### Install (from local)
```bash
cd wrappers/swift
swift build -c release
.build/release/ipaship --dir ./my-flutter-app
```

### Add to an Xcode project
In Xcode → File → Add Package Dependencies → Enter:
```
https://github.com/async-atharv/ipaShip.git
```

### Use
```bash
.build/release/ipaship --dir ./ --platform ios --mode store
```

### Publish
```bash
git tag 1.3.0
git push origin 1.3.0
```

**View on the web:** Users install via GitHub URL. Swift Package Index may auto-index it.

---

## 7. Objective-C / CocoaPods

### Install
```bash
cd wrappers/cocoapods
pod spec lint ipaShip.podspec
```

Add to your `Podfile`:
```ruby
pod 'ipaShip', '~> 1.3.0'
```

Then:
```bash
pod install
```

### Publish to CocoaPods Trunk
```bash
pod trunk register your@email.com 'Your Name'
pod trunk push ipaShip.podspec
```

**View on the web:** [https://cocoapods.org/pods/ipaShip](https://cocoapods.org/pods/ipaShip)

---

## 8. .NET / C# / NuGet

### Install (from local)
```bash
cd wrappers/csharp
dotnet build
dotnet run -- --dir ./my-flutter-app
```

### Install as global tool (after publishing)
```bash
dotnet tool install -g ipaship
```

### Use
```bash
ipaship --dir ./ --platform ios --mode both
```

### Build & Publish
```bash
cd wrappers/csharp
dotnet pack -c Release
dotnet nuget push bin/Release/ipaship.1.3.0.nupkg \
  --api-key <YOUR_NUGET_API_KEY> \
  --source https://api.nuget.org/v3/index.json
```

**View on the web:** [https://www.nuget.org/packages/ipaship/](https://www.nuget.org/packages/ipaship/)

---

## 9. Ruby / RubyGems

### Install (from local)
```bash
cd wrappers/ruby
gem build ipaship.gemspec
gem install ipaship-1.3.0.gem
```

### Install (from RubyGems — after publishing)
```bash
gem install ipaship
```

### Use
```bash
ipaship --dir ./ --platform both --mode both
```

### Publish
```bash
cd wrappers/ruby
gem build ipaship.gemspec
gem push ipaship-1.3.0.gem
```

**View on the web:** [https://rubygems.org/gems/ipaship](https://rubygems.org/gems/ipaship)

---

## 10. Homebrew / macOS & Linux

### Install (from local formula)
```bash
brew install --build-from-source ./wrappers/homebrew/ipaship.rb
```

### Install (from custom tap — after publishing)
```bash
brew tap async-atharv/ipaShip
brew install ipaship
```

### Use
```bash
ipaship --dir ./ --platform ios
```

### Publish
1. Create a GitHub repo: `async-atharv/homebrew-ipaShip`
2. Copy `wrappers/homebrew/ipaship.rb` into it
3. Users can then run:
```bash
brew tap async-atharv/ipaShip
brew install ipaship
```

**View on the web:** Your tap repository on GitHub.

---

## 11. PHP / Composer / Packagist

### Install (from local)
```bash
# Add to composer.json repositories:
# { "type": "path", "url": "wrappers/php" }
composer require async-atharv/ipaship
```

### Use
```bash
vendor/bin/ipaship --dir ./ --platform ios
```

### Publish to Packagist
1. Push code to GitHub
2. Visit [https://packagist.org/](https://packagist.org/)
3. Log in → Submit → Enter your GitHub repo URL

**View on the web:** [https://packagist.org/packages/async-atharv/ipaship](https://packagist.org/packages/async-atharv/ipaship)

---

## 12. Java / Maven Central

### Build (from local)
```bash
cd wrappers/java
mvn clean package
java -jar target/ipaship-1.3.0.jar --dir ./my-flutter-app
```

### Install (from Maven Central — after publishing)
Add to your `pom.xml`:
```xml
<dependency>
    <groupId>io.github.async-atharv</groupId>
    <artifactId>ipaship</artifactId>
    <version>1.3.0</version>
</dependency>
```

### Use
```bash
java -jar ipaship-1.3.0.jar --dir ./ --platform ios --mode store
```

### Publish to Maven Central
```bash
cd wrappers/java
# 1. Set up ~/.m2/settings.xml with Sonatype OSSRH credentials
# 2. Sign with GPG
mvn clean deploy -P release
```

Requirements:
- Sonatype OSSRH account: [https://issues.sonatype.org](https://issues.sonatype.org)
- GPG key for JAR signing
- `settings.xml` with credentials

**View on the web:** [https://central.sonatype.com/artifact/io.github.async-atharv/ipaship](https://central.sonatype.com/artifact/io.github.async-atharv/ipaship)

---

## 13. Kotlin / Gradle (Maven Central)

### Build (from local)
```bash
cd wrappers/kotlin
gradle build
java -jar build/libs/ipaship-1.3.0.jar --dir ./my-flutter-app
```

### Use
```bash
java -jar build/libs/ipaship-1.3.0.jar --dir ./ --platform android --mode both
```

### Add to Gradle project
```kotlin
dependencies {
    implementation("io.github.async-atharv:ipaship:1.3.0")
}
```

### Publish
```bash
cd wrappers/kotlin
gradle publish   # requires Maven Central credentials in gradle.properties
```

**View on the web:** Same as Java — [https://central.sonatype.com/artifact/io.github.async-atharv/ipaship](https://central.sonatype.com/artifact/io.github.async-atharv/ipaship)

---

## 14. C / CMake

### Build & Install
```bash
cd wrappers/c
mkdir build && cd build
cmake ..
make
sudo make install    # installs to /usr/local/bin/ipaship
```

### Use
```bash
ipaship --dir ./ --platform ios --mode store --provider gemini --key YOUR_KEY
```

### Build (single command, no CMake)
```bash
gcc -o ipaship wrappers/c/main.c
./ipaship --dir ./
```

There is no central C package registry — distribute the binary or source alongside your project.

---

## 15. C++ / CMake

### Build & Install
```bash
cd wrappers/cpp
mkdir build && cd build
cmake ..
make
sudo make install    # installs to /usr/local/bin/ipaship
```

### Use
```bash
ipaship --dir ./ --platform both --mode both --provider claude --key YOUR_KEY
```

### Build (single command, no CMake)
```bash
g++ -std=c++17 -o ipaship wrappers/cpp/main.cpp
./ipaship --dir ./
```

There is no central C++ package registry — distribute the binary or source alongside your project. Can also be distributed via [vcpkg](https://vcpkg.io) or [Conan](https://conan.io) if needed.

---

## 16. Docker

### Build
```bash
docker build -t ipaship .
```

### Use
```bash
# Audit a local project
docker run --rm \
  -v $(pwd):/app \
  -e GEMINI_API_KEY=your-key \
  ipaship --dir /app --platform ios --mode both --provider gemini --key \$GEMINI_API_KEY

# Docker Compose
GEMINI_API_KEY=your-key docker compose run audit
```

### Publish to Docker Hub
```bash
docker login
docker tag ipaship asyncatharv/ipaship:1.3.0
docker tag ipaship asyncatharv/ipaship:latest
docker push asyncatharv/ipaship:1.3.0
docker push asyncatharv/ipaship:latest
```

**View on the web:** [https://hub.docker.com/r/asyncatharv/ipaship](https://hub.docker.com/r/asyncatharv/ipaship)

---

## 17. Shell Script / curl

### Install (one-liner)
```bash
curl -fsSL https://raw.githubusercontent.com/async-atharv/ipaShip/main/scripts/install.sh | bash
```

### CI Setup (installs Node + ipaShip)
```bash
curl -fsSL https://raw.githubusercontent.com/async-atharv/ipaShip/main/scripts/ci-setup.sh | bash
```

### Run Audit
```bash
./scripts/run-audit.sh --dir ./ --provider gemini --key YOUR_KEY
```

### Uninstall
```bash
./scripts/uninstall.sh
```

---

## Quick Reference Table

| Language | Install Command | Package Registry |
|----------|----------------|-----------------|
| **npm** | `npm i -g @async-atharv/ipaship` | [npmjs.com](https://www.npmjs.com/package/@async-atharv/ipaship) |
| **Python** | `pip install ipaship` | [pypi.org](https://pypi.org/project/ipaship/) |
| **Go** | `go install github.com/async-atharv/ipaShip/wrappers/go@latest` | [pkg.go.dev](https://pkg.go.dev/github.com/async-atharv/ipaShip/wrappers/go) |
| **Rust** | `cargo install ipaship` | [crates.io](https://crates.io/crates/ipaship) |
| **Dart** | `dart pub global activate ipaship` | [pub.dev](https://pub.dev/packages/ipaship) |
| **Swift** | `swift build` (via SPM) | GitHub URL |
| **Obj-C** | `pod 'ipaShip'` | [cocoapods.org](https://cocoapods.org/pods/ipaShip) |
| **C#/.NET** | `dotnet tool install -g ipaship` | [nuget.org](https://www.nuget.org/packages/ipaship/) |
| **Ruby** | `gem install ipaship` | [rubygems.org](https://rubygems.org/gems/ipaship) |
| **Homebrew** | `brew install ipaship` | Custom tap |
| **PHP** | `composer require async-atharv/ipaship` | [packagist.org](https://packagist.org/packages/async-atharv/ipaship) |
| **Java** | `mvn clean package` | [Maven Central](https://central.sonatype.com/) |
| **Kotlin** | `gradle build` | [Maven Central](https://central.sonatype.com/) |
| **C** | `gcc -o ipaship main.c` | Source / binary |
| **C++** | `g++ -std=c++17 -o ipaship main.cpp` | Source / binary |
| **Docker** | `docker pull asyncatharv/ipaship` | [Docker Hub](https://hub.docker.com/r/asyncatharv/ipaship) |
| **curl** | `curl -fsSL .../install.sh \| bash` | Raw GitHub |
