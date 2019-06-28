# adyen-react-native
With Adyen SDK you can help your shoppers pay with a payment method of their choice, selected from a dynamically generated list of available payment methods. Method availability is based on shoppers’ location, transaction currency, and transaction amount.

To give you as much flexibility as possible, Adyen SDK can be integrated via this library in two ways:

* **Quick integration** – Benefit from a fully optimized out-of-the-box UI with the SDK.
* **Custom integration** – Design your own UI while leveraging the underlying functionality of the SDK.

## Dependencies
* Node.js
* npm
* Android studio, Android SDK and correct PATH/ANDROID_HOME for it.

### MacOS only for creating IOS Builds
* Xcode 10.2+
* Cocoapods (for installing IOS dependencies)

## Getting started

`$ npm install adyen-react-native --save`

### Installation
`$ react-native link adyen-react-native`

### IOS

* Open ios directory in you project and run `pod init`

#### For ios < 10.2

* Edit Podfile with following content
```
  platform :ios, '10.0'
  use_frameworks!
  target 'Your Target Name' do
	  pod 'AdyenReactNative', :path => '../node_modules/adyen-react-native'
  end
		
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      if target.name == 'Adyen'
        target.build_configurations.each do |config|
          config.build_settings['SWIFT_VERSION'] = '4.0'
        end
      end
    end
  end
```

* Run:
`$ pod install`

* Open YourProject.xcworkspace/
* Open Your target > Build Settings and add `$(SRCROOT)/../node_modules/adyen-react-native/ios` to the `Header Search Paths` and `Library Search Paths` sections.

* Click run or use `$ react-native run-ios`

#### For XCode > 10.2
* React native version > 0.59.3
* Edit Podfile with following content
```
  platform :ios, '11.0'
  use_frameworks!
  target 'Your Target Name' do
	  pod 'AdyenReactNative', :path => '../node_modules/adyen-react-native'
  end
```

* Run:
`$ pod install`

* Modify the OS Version for AdyenReactNativeProject to 11.3 to avoid armv7 missing architecture

* Replace the Adyen framework in your nodemodules ios folder with the newly swift 5 compiled version from the Pods to <RNN Project>/node_modules/adyen-react-native/ios like below

![image](https://user-images.githubusercontent.com/5992474/59888148-eaf08000-93e3-11e9-8797-d629580bbf65.png)

Copy Adyen3DS2 from Pods/Adyen3DS2/Frameworks and then Copy from Products Folder Adyen.Framework,AdyenInternal.framework and AdyenInternal.bundle

<img width="878" alt="image" src="https://user-images.githubusercontent.com/5992474/59561614-1b30cb00-9040-11e9-81b0-7597b527fd4b.png">


* Link the project manually

* As per the facebook link below create a empty swift file and create the bridege in your parent RN project,

<img width="1297" alt="image" src="https://user-images.githubusercontent.com/5992474/59561736-2f28fc80-9041-11e9-8230-024c9a890e2e.png">

<img width="794" alt="image" src="https://user-images.githubusercontent.com/5992474/59561748-4cf66180-9041-11e9-9721-d0c46f180457.png">

* Within <YourProject.swift> empty file add the following,
```
import Foundation
import Adyen

@objc class AdyenObjectiveCBridge: NSObject {
  
  @objc(applicationDidOpenURL:)
  static func applicationDidOpen(_ url: URL) -> Bool {
     let adyenHandled = Adyen.applicationDidOpen(url)
     return adyenHandled
  }
}
```
* AppDelegate.m file add the below function
```
.....
#import "<yourProjectName>-Swift.h"
.....
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
  
  BOOL handledAdyen =[AdyenObjectiveCBridge applicationDidOpenURL:url];
  
  return handledAdyen;
}
.....
```
* Open YourProject.xcworkspace/
* Open Your target > Build Settings and add `$(SRCROOT)/../node_modules/adyen-react-native/ios` to the `Header Search Paths` and `Library Search Paths` and `Framework Search Paths`

* Click run or use `$ react-native run-ios`

### Android
 `react-native link react-native-adyen` should install all the dependency

## Quick integration

### Android
![Credit Card](https://user-images.githubusercontent.com/8339684/42883150-0aeec504-8a9b-11e8-9a23-426ce4771481.gif)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![One-Click](https://user-images.githubusercontent.com/8339684/42883151-0badfece-8a9b-11e8-94d9-41320e757b01.gif)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

### IOS
<img src="https://user-images.githubusercontent.com/8394738/43137349-ec92b254-8f4b-11e8-8dc7-9e97c0a5570a.png" width="256px" height="516px" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://user-images.githubusercontent.com/8394738/43137355-ef9fa150-8f4b-11e8-9cf7-b5693302e56c.png" width="256px" height="516px" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://user-images.githubusercontent.com/8394738/43137351-ede41d46-8f4b-11e8-87fb-75f3fb4cc7a5.png" width="256px" height="516px" />


#### Getting started
The Quick integration of the SDK provides UI components for payment method selection, entering payment method details (credit card entry form, iDEAL issuer selection, etc.). To get started, use the `Adyen` class to start the payment:

```import Adyen from adyen-react-native```

Add listeners for library's events

Send `sdkToken` and `returnUrl` to your own server, which then needs to forward this data, among some other parameters, to the Adyen Checkout API. See the [API Explorer](https://docs.adyen.com/api-explorer/#/PaymentSetupAndVerificationService/v32/paymentSession) for more details.

```javascript
Adyen.onRequestPaymentSession((token, returnUrl) => {
    //send request to a server and get paymentSession from an Adyen's server
});
Adyen.onPaymentResult((code, payload) => {
    //confirm payment
});

Adyen.onError((code, error) => {
    //payment was cancelled or something else
});
```

For starting payment proccess call:
```javascript
Adyen.startPayment();
```

##### - Generating StartPaymentParameters
After receiving the payment session data from your own server, use the `Adyen.confirmPayment` to handle the payment session response:

```javascript
Adyen.confirmPayment(response.paymentSession);
```

## Custom integration

#### It will be implement as soon as possible. Thx.

## Samples
* [Quick integration Sample](https://github.com/dmitry-blackwave/adyen-react-native-samples/tree/master/QuickStart)

## See also
 * [Adyen Android SDK GitHub](https://github.com/Adyen/adyen-android)
 * [Android SDK Guide](https://docs.adyen.com/developers/checkout/android-sdk)
 * [Adyen IOS SDK GitHub](https://github.com/Adyen/adyen-ios)
 * [Adyen IOS Complete Documentation](https://docs.adyen.com/developers/checkout/ios)

## License
This repository is open source and available under the MIT license. For more information, see the LICENSE file.
