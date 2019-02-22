import { NativeEventEmitter, NativeModules } from 'react-native';

const { Adyen } = NativeModules;
const RNEventEmitter = new NativeEventEmitter(Adyen);

export default {
  /**
   * The Quick integration of the SDK provides UI components for payment method selection, entering payment method details (credit card entry form, iDEAL issuer selection, etc.).
   * @param {function(string sdkToken, string returnUrl)} requestPaymentSession
   * @param {function(string error)} onError
   * @returns {*}
   */
  startPayment(requestPaymentSession, onError) {
    if (typeof requestPaymentSession !== 'function' || typeof onError !== 'function') {
      throw new Error(
          'Error: Adyen.startPayment() requires a callback function but got a ' + (typeof onError !== 'function' ? typeof onError : typeof requestPaymentSession),
      );
    }
    
    return Adyen.startPayment(requestPaymentSession, onError);
  },
  /**
   * Generating StartPaymentParameters
   * @param string encodedToken
   * @param {function(string payload)} onPaymentResult
   * @param {function(int resultCode, string error)} onPaymentException
   * @returns {*}
   */
  confirmPayment(encodedToken, onPaymentResult, onPaymentException) {
    if (typeof onPaymentResult !== 'function' || typeof onPaymentException !== 'function') {
      throw new Error(
          'Error: Adyen.confirmPayment() requires a callback function but got a ' + (typeof onPaymentException !== 'function' ? typeof onPaymentException : typeof onPaymentResult),
      );
    }
    
    if (typeof encodedToken !== 'string') {
      throw new Error('Error: Adyen.confirmPayment() requires a string but got a ' + typeof encodedToken);
    }
    
    return Adyen.confirmPayment(encodedToken, onPaymentResult, onPaymentException);
  },
  /**
   *
   * @param string encodedToken
   * @param {function(array paymentMethods)} onReadyFormPayment
   * @returns {*}
   */
  createPaymentSession(encodedToken, onReadyFormPayment) {
    if (typeof onReadyFormPayment !== 'function') {
      throw new Error('Error: Adyen.confirmPayment() requires a callback function but got a ' + typeof onReadyFormPayment);
    }
    
    if (typeof encodedToken !== 'string') {
      throw new Error('Error: Adyen.confirmPayment() requires a string but got a ' + typeof encodedToken);
    }
    
    return Adyen.createPaymentSession(encodedToken, onReadyFormPayment);
  },
  /**
   * Whether network requests are currently being executed.
   * @param {function(bool isExecutingRequests)} mObserverNetworkingState
   * @returns {*}
   */
  onObserverNetworkingState(mObserverNetworkingState) {
    if (typeof mObserverNetworkingState !== 'function') {
      throw new Error('Error: Adyen.onObserverNetworkingState() requires a callback function but got a ' + typeof mObserverNetworkingState);
    }
    
    return Adyen.onObserverNetworkingState(mObserverNetworkingState);
  },
  /**
   * A {@link PaymentSession} holds all relevant information that is needed to make a payment.
   * @param {function(array paymentMethods)} mObserverPaymentSession
   * @returns {*}
   */
  onObserverPaymentSession(mObserverPaymentSession) {
    if (typeof mObserverPaymentSession !== 'function') {
      throw new Error('Error: Adyen.onObserverPaymentSession() requires a callback function but got a ' + typeof mObserverPaymentSession);
    }
    
    return Adyen.onObserverPaymentSession(mObserverPaymentSession);
  },
  /**
   * The {@link PaymentResult} describes the result of a payment.
   * @param {function(string payLoad, string resultCode)} mObserverPaymentResult
   * @returns {*}
   */
  onObserverPaymentResult(mObserverPaymentResult) {
    if (typeof mObserverPaymentResult !== 'function') {
      throw new Error('Error: Adyen.onObserverPaymentResult() requires a callback function but got a ' + typeof mObserverPaymentResult);
    }
    
    return Adyen.onObserverPaymentResult(mObserverPaymentResult);
  },
  /**
   * Called when a redirect is required to continue with the payment.
   * @param {function(string uri)} mObserverRedirectDetails
   * @returns {*}
   */
  onObserverRedirectDetails(mObserverRedirectDetails) {
    if (typeof mObserverRedirectDetails !== 'function') {
      throw new Error('Error: Adyen.onObserverRedirectDetails() requires a callback function but got a ' + typeof mObserverRedirectDetails);
    }
    
    return Adyen.onObserverRedirectDetails(mObserverRedirectDetails);
  },
  /**
   * Called when additional details are required to continue with the payment.
   * @param {function(string paymentMethodType, array inputDetails)} mObserverAdditionalDetails
   * @returns {*}
   */
  onObserverAdditionalDetails(mObserverAdditionalDetails) {
    if (typeof mObserverAdditionalDetails !== 'function') {
      throw new Error('Error: Adyen.onObserverAdditionalDetails() requires a callback function but got a ' + typeof mObserverAdditionalDetails);
    }
    
    return Adyen.onObserverAdditionalDetails(mObserverAdditionalDetails);
  },
  /**
   * Called when an error occurred during the payment.
   * @param {function(string error)} mObserverException
   * @returns {*}
   */
  onObserverException(mObserverException) {
    if (typeof mObserverException !== 'function') {
      throw new Error('Error: Adyen.onObserverException() requires a callback function but got a ' + typeof mObserverException);
    }
    
    return Adyen.onObserverException(mObserverException);
  },
  RNEventEmitter,
};
