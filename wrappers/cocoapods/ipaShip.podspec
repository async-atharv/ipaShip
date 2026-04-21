Pod::Spec.new do |spec|
  spec.name         = 'ipaShip'
  spec.version      = '1.3.0'
  spec.summary      = 'AI-powered App Store review audit for iOS projects.'
  spec.homepage     = 'https://github.com/async-atharv/ipaShip'
  spec.license      = { :type => 'MIT' }
  spec.author       = { 'async-atharv' => '' }
  spec.source       = { :git => 'https://github.com/async-atharv/ipaShip.git', :tag => spec.version.to_s }
  spec.preserve_paths = '*'
  
  spec.script_phase = {
    :name => 'Run ipaShip Audit',
    :script => 'npx --yes @async-atharv/ipaship --dir "${SRCROOT}" --platform ios --mode both',
    :execution_position => :after_compile
  }
end