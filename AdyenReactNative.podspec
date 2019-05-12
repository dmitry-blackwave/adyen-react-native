require 'json'
package = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|

  s.name         = "AdyenReactNative"
  s.version      = package["version"]
  s.summary      = package["description"]

  s.homepage     = "https://github.com/dmitry-blackwave/adyen-react-native#readme"
  s.license      = "MIT"
  s.author       = { "author" => "dmitry@belov.dev" }

  s.platform       = :ios, "9.0"
  s.source         = { :git => "https://github.com/author/AdyenReactNative.git" }
  s.source_files   = "./*.{h,m,swift}"
  s.requires_arc   = true

  s.dependency "Adyen"

end
