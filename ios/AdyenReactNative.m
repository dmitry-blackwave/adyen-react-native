#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(AdyenReactNative, NSObject)
    RCT_EXTERN_METHOD(startPayment)
    RCT_EXTERN_METHOD(confirmPayment:(NSString)encodedToken)
    RCT_EXTERN_METHOD(initPayment)
@end
