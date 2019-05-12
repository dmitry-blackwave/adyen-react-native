import {NativeEventEmitter, NativeModules} from 'react-native';

const Adyen = NativeModules.Adyen || NativeModules.AdyenReactNative;
const events = new NativeEventEmitter(Adyen);

export default {
    /**
     * The Quick integration of the SDK provides UI components for payment method selection, entering payment method details (credit card entry form, iDEAL issuer selection, etc.).
     * @returns {*}
     */
    startPayment() {
        return Adyen.startPayment();
    },
    /**
     * Generating StartPaymentParameters
     * @param string encodedToken
     * @returns {*}
     */
    confirmPayment(encodedToken) {
        this._validateParam(encodedToken, 'confirmPayment', 'string');

        return Adyen.confirmPayment(encodedToken);
    },
    /**
     *
     * @param string encodedToken
     * @returns {*}
     */
    createPaymentSession(encodedToken) {
        this._validateParam(encodedToken, 'createPaymentSession', 'string');

        return Adyen.createPaymentSession(encodedToken);
    },
    /**
     * Starting payment proccess.
     * @returns {*}
     */
    initPayment() {
        return Adyen.initPayment();
    },
    /**
     * Native event. Calling when CheckoutController calls delegate in the native call.
     * It calling with token and returnUrl (can be empty, no worries)
     * @param {function(string token, string returnUrl)} mOnRequestPaymentSession
     */
    onRequestPaymentSession(mOnRequestPaymentSession) {
        this._validateParam(mOnRequestPaymentSession, 'onRequestPaymentSession', 'function');
        events.addListener('onRequestPaymentSession', (response) => {
            console.log(response);
            mOnRequestPaymentSession(response['token'], response['returnUrl']);
        });
    },
    /**
     * After successfully payment, added payload data for confirmation payments
     * @param {function(number code, string payloadData)} mOnPaymentResult
     */
    onPaymentResult(mOnPaymentResult) {
        this._validateParam(mOnPaymentResult, 'onPaymentResult', 'function');
        events.addListener('onPaymentResult', (response) => {
            mOnPaymentResult(response['code'], response['payload']);
        });
    },
    /**
     * If payment was cancelled or something else. Calling instead of onPaymentResult event.
     * @param {function(number code, string message)} mOnError
     */
    onError(mOnError) {
        this._validateParam(mOnError, 'onError', 'function');
        events.addListener('onError', (response) => {
            mOnRequestPaymentSession(response['code'], response['message']);
        });
    },
    /**
     * //TODO custom integration
     * @param {function(preferred, other, number count)} mOnSelectPaymentMethod
     */
    onSelectPaymentMethod(mOnSelectPaymentMethod) {
        this._validateParam(mOnSelectPaymentMethod, 'onSelectPaymentMethod', 'function');
        events.addListener('onSelectPaymentMethod', (response) => {
            mOnSelectPaymentMethod(response['preferred'], response['other'], response['count']);
        });
    },
    /**
     * @param {*} param
     * @param string methodName
     * @param string requiredType
     * @private
     */
    _validateParam(param, methodName, requiredType) {
        if (typeof param !== requiredType) {
            throw new Error(`Error: Adyen.${methodName}() requires a ${requiredType === 'function' ? 'callback function' : requiredType} but got a ${typeof param}`);
        }
    },
    events
};
