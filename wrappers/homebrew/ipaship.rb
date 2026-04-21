class Ipaship < Formula
  desc "AI-powered App Store review audit for Flutter projects"
  homepage "https://github.com/async-atharv/ipaShip"
  url "https://github.com/async-atharv/ipaShip/archive/refs/tags/v1.3.0.tar.gz"
  sha256 "0000000000000000000000000000000000000000000000000000000000000000" # Update this sha256 on release
  license "MIT"

  depends_on "node"

  def install
    # Install the CLI using npx creating a wrapper
    bin.install "src/index.js" => "ipaship"
    libexec.install Dir["*"]
    bin.env_script_all_files(libexec/"bin", :NODE_PATH => libexec/"lib/node_modules")
  end

  test do
    system "#{bin}/ipaship", "--version"
  end
end