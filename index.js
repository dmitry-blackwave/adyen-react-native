import {NativeEventEmitter, NativeModules} from 'react-native';

const Adyen = NativeModules.Adyen || NativeModules.AdyenReactNative;
const events = new NativeEventEmitter(Adyen);
let onRequestPaymentSessionListener;
let onPaymentResultListener;
let onErrorListener;
let onSelectPaymentMethodListener;

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
     *
     * @param {String} encodedToken
     *
     * @returns {*}
     */
    confirmPayment(encodedToken) {
        this._validateParam(encodedToken, 'confirmPayment', 'string');

        return Adyen.confirmPayment(encodedToken);
    },
    /**
     * @param {String} encodedToken
     * @returns {*}
     */
    createPaymentSession(encodedToken) {
        this._validateParam(encodedToken, 'createPaymentSession', 'string');

        return Adyen.createPaymentSession(encodedToken);
    },
    /**
     * Starting payment process.
     * @returns {*}
     */
    initPayment() {
        return Adyen.initPayment();
    },
    /**
     * @callback mOnRequestPaymentSession
     * @param {String} token
     * @param {String} returnUrl
     */
    /**
     * Native event. Calling when CheckoutController calls delegate in the native call.
     * It calling with token and returnUrl (can be empty, no worries)
     * @param {mOnRequestPaymentSession} mOnRequestPaymentSession
     */
    onRequestPaymentSession(mOnRequestPaymentSession) {
        this._validateParam(mOnRequestPaymentSession, 'onRequestPaymentSession', 'function');
        onRequestPaymentSessionListener = events.addListener('onRequestPaymentSession', (response) => {
            mOnRequestPaymentSession(response['token'], response['returnUrl']);
        });
    },
    /**
     * @callback mOnPaymentResult
     * @param {Number} code
     * @param {String} payload
     */
    /**
     * After successfully payment, added payload data for confirmation payments
     * @param {mOnPaymentResult} mOnPaymentResult
     */
    onPaymentResult(mOnPaymentResult) {
        this._validateParam(mOnPaymentResult, 'onPaymentResult', 'function');
        onPaymentResultListener = events.addListener('onPaymentResult', (response) => {
            mOnPaymentResult(response['code'], response['payload']);
        });
    },
    /**
     * @callback mOnError
     * @param {Number} code
     * @param {String} message
     */
    /**
     * If payment was cancelled or something else. Calling instead of onPaymentResult event.
     * @param {mOnError} mOnError
     */
    onError(mOnError) {
        this._validateParam(mOnError, 'onError', 'function');
        onErrorListener = events.addListener('onError', (response) => {
            mOnError(response['code'], response['message']);
        });
    },
    /**
     * @callback mOnSelectPaymentMethod
     * @param {Array<>} preferred
     * @param {Array<>} other
     * @param {number} count
     */
    /**
     * //TODO custom integration
     * @param {mOnSelectPaymentMethod} mOnSelectPaymentMethod
     */
    onSelectPaymentMethod(mOnSelectPaymentMethod) {
        this._validateParam(mOnSelectPaymentMethod, 'onSelectPaymentMethod', 'function');
        onSelectPaymentMethodListener = events.addListener('onSelectPaymentMethodListener;', (response) => {
            mOnSelectPaymentMethod(response['preferred'], response['other'], response['count']);
        });
    },
    /**
     * @param {*} param
     * @param {String} methodName
     * @param {String} requiredType
     * @private
     */
    _validateParam(param, methodName, requiredType) {
        if (typeof param !== requiredType) {
            throw new Error(`Error: Adyen.${methodName}() requires a ${requiredType === 'function' ? 'callback function' : requiredType} but got a ${typeof param}`);
        }
    },
    events,
    removeListeners(){
        if(null != onRequestPaymentSessionListener)   
            onRequestPaymentSessionListener.remove();
        if(null != onPaymentResultListener)
            onPaymentResultListener.remove();
        if(null != onErrorListener)
            onErrorListener.remove();
        if(null != onSelectPaymentMethodListener)
            onSelectPaymentMethodListener.remove();
    }
};
