package com.dblackwave.adyen;

import android.app.Activity;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.util.Log;

import com.adyen.checkout.core.CheckoutException;
import com.adyen.checkout.core.PaymentHandler;
import com.adyen.checkout.core.PaymentMethodHandler;
import com.adyen.checkout.core.PaymentReference;
import com.adyen.checkout.core.PaymentResult;
import com.adyen.checkout.core.StartPaymentParameters;
import com.adyen.checkout.core.handler.StartPaymentParametersHandler;
import com.adyen.checkout.core.model.PaymentMethod;
import com.adyen.checkout.core.model.PaymentSession;
import com.adyen.checkout.ui.CheckoutController;
import com.adyen.checkout.ui.CheckoutSetupParameters;
import com.adyen.checkout.ui.CheckoutSetupParametersHandler;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

public class AdyenModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private PaymentMethodHandler paymentMethodHandler;

    private PaymentReference paymentReference;

    private PaymentHandler mPaymentHandler;

    private Callback mPaymentResult;

    private Callback mPaymentException;

    private static final int REQUEST_CODE_CHECKOUT = 1;

    public AdyenModule(ReactApplicationContext context) {
        super(context);
        this.getReactApplicationContext().addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "Adyen";
    }

    @ReactMethod
    public void startPayment() {
        CheckoutController.startPayment(getCurrentActivity(), new CheckoutSetupParametersHandler() {
            @Override
            public void onRequestPaymentSession(@NonNull CheckoutSetupParameters checkoutSetupParameters) {
                Log.d("Debug", "Request payment session");
                WritableMap params = Arguments.createMap();
                params.putString("token", checkoutSetupParameters.getSdkToken());
                params.putString("returnUrl", checkoutSetupParameters.getReturnUrl());
                sendEvent(getReactApplicationContext(), "onRequestPaymentSession", params);
            }

            @Override
            public void onError(@NonNull CheckoutException error) {
                WritableMap params = Arguments.createMap();
                params.putInt("code", error.hashCode());
                params.putString("message", error.getMessage());
                sendEvent(getReactApplicationContext(), "onError", params);
                Log.d("Debug", error.getMessage());
            }
        });
    }

    @ReactMethod
    public void confirmPayment(final String encodedPaymentSession) {
        this.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    CheckoutController.handlePaymentSessionResponse(getCurrentActivity(), encodedPaymentSession, new StartPaymentParametersHandler() {
                        @Override
                        public void onPaymentInitialized(@NonNull StartPaymentParameters startPaymentParameters) {
                            paymentMethodHandler = CheckoutController.getCheckoutHandler(startPaymentParameters);
                            paymentMethodHandler.handlePaymentMethodDetails(getCurrentActivity(), REQUEST_CODE_CHECKOUT);
                        }

                        @Override
                        public void onError(@NonNull CheckoutException error) {
                            Log.d("CheckoutException", error.getMessage());
                        }
                    });
                } catch (Exception e) {
                    Log.d("Exception", e.toString());
                }
            }
        });
    }

    @ReactMethod
    public void createPaymentSession(final String encodedPaymentSession, final Callback onReadyForPayment) {
        this.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    CheckoutController.handlePaymentSessionResponse(getCurrentActivity(), encodedPaymentSession, new StartPaymentParametersHandler() {
                        @Override
                        public void onPaymentInitialized(@NonNull StartPaymentParameters startPaymentParameters) {
                            paymentReference = startPaymentParameters.getPaymentReference();
                            mPaymentHandler = paymentReference.getPaymentHandler(getCurrentActivity());
                            WritableMap jsonPayment = preparePaymentSession(startPaymentParameters.getPaymentSession());
                            onReadyForPayment.invoke(jsonPayment);
                        }

                        @Override
                        public void onError(@NonNull CheckoutException error) {
                            Log.d("CheckoutException", error.getMessage());
                        }
                    });
                } catch (Exception e) {
                    Log.d("Exception", e.toString());
                }
            }
        });
    }

    private WritableMap preparePaymentSession(PaymentSession paymentSession) {
        WritableMap jsonPayment = new WritableNativeMap();
        jsonPayment.putString("countryCode", paymentSession.getPayment().getCountryCode());

        WritableMap jsonAmount = new WritableNativeMap();
        jsonAmount.putInt("value", (int) paymentSession.getPayment().getAmount().getValue());
        jsonAmount.putString("currency", paymentSession.getPayment().getAmount().getCurrency());
        jsonPayment.putMap("amount", jsonAmount);

        WritableMap jsonPaymentSession = new WritableNativeMap();
        jsonPaymentSession.putMap("payment", jsonPayment);

        WritableArray jsonPaymentMethodsArray = new WritableNativeArray();
        for (PaymentMethod method : paymentSession.getPaymentMethods()) {
            WritableMap jsonPaymentMethods = new WritableNativeMap();
            jsonPaymentMethods.putString("name", method.getName());
            jsonPaymentMethods.putString("type", method.getType());
            jsonPaymentMethodsArray.pushMap(jsonPaymentMethods);
        }

        jsonPaymentSession.putArray("paymentMethods", jsonPaymentMethodsArray);
        if (paymentSession.getOneClickPaymentMethods() != null) {
            WritableArray jsonPaymentMethodsOneClickArray = new WritableNativeArray();
            for (PaymentMethod method : paymentSession.getOneClickPaymentMethods()) {
                WritableMap jsonPaymentMethodsOneClick = new WritableNativeMap();
                jsonPaymentMethodsOneClick.putString("name", method.getName());
                jsonPaymentMethodsOneClick.putString("type", method.getType());
                jsonPaymentMethodsOneClickArray.pushMap(jsonPaymentMethodsOneClick);
            }

            jsonPaymentSession.putArray("oneClickPaymentMethods", jsonPaymentMethodsOneClickArray);
        }

        return jsonPaymentSession;
    }

    @Override
    public void onNewIntent(final Intent Intent) {
    }

    @Override
    public void onActivityResult(final Activity activity, final int requestCode, final int resultCode, final Intent data) {
        if (requestCode == REQUEST_CODE_CHECKOUT) {
            if (resultCode == PaymentMethodHandler.RESULT_CODE_OK) {
                PaymentResult paymentResult = PaymentMethodHandler.Util.getPaymentResult(data);
                WritableMap params = Arguments.createMap();
                params.putInt("code", resultCode);
                params.putString("payload", paymentResult.getPayload());
                this.sendEvent(getReactApplicationContext(), "onPaymentResult", params);
            } else {
                CheckoutException checkoutException = PaymentMethodHandler.Util.getCheckoutException(data);
                WritableMap params = Arguments.createMap();
                params.putInt("code", resultCode);
                params.putString("message", "exception");
                this.sendEvent(getReactApplicationContext(), "onError", params);
            }
        }
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}