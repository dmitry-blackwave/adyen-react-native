import Foundation
import Adyen

@objc(AdyenRN)
class AdyenRN: RCTEventEmitter, PaymentRequestDelegate {
    
    var checkoutController: CheckoutController?
    
    var onRequestPaymentSession: RCTResponseSenderBlock?
    
    var onError: RCTResponseSenderBlock?
    
    var mPaymentResult: RCTResponseSenderBlock?
    
    var mPaymentException: RCTResponseSenderBlock?
    
    var mObserverNetworkingState: RCTResponseSenderBlock?
    
    var mObserverPaymentSession: RCTResponseSenderBlock?
    
    var mObserverPaymentResult: RCTResponseSenderBlock?
    
    var mObserverRedirectDetails: RCTResponseSenderBlock?
    
    var mObserverAdditionalDetails: RCTResponseSenderBlock?
    
    var mObserverException: RCTResponseSenderBlock?
    
    @objc func onObserverNetworkingState(mObserverNetworkingState: RCTResponseSenderBlock) {
        self.mObserverNetworkingState = mObserverNetworkingState
    }
    
    @objc func onObserverPaymentSession(mObserverPaymentSession: RCTResponseSenderBlock) {
        self.mObserverPaymentSession = mObserverPaymentSession
    }
    
    @objc func onObserverPaymentResult(mObserverPaymentResult: RCTResponseSenderBlock) {
        self.mObserverPaymentResult = mObserverPaymentResult
    }
    
    @objc func onObserverRedirectDetails(mObserverRedirectDetails: RCTResponseSenderBlock) {
        self.mObserverRedirectDetails = mObserverRedirectDetails
    }
    
    @objc func onObserverAdditionalDetails(mObserverAdditionalDetails: RCTResponseSenderBlock) {
        self.mObserverAdditionalDetails = mObserverAdditionalDetails
    }
    
    @objc func onObserverException(mObserverException: RCTResponseSenderBlock) {
        self.mObserverException = mObserverException
    }
    
    @objc func startPayment(requestPaymentSession: RCTResponseSenderBlock, onError:RCTResponseSenderBlock) {
        checkoutController = CheckoutController(presentingViewController: self, delegate: self)
        checkoutController?.start()
        self.onRequestPaymentSession = requestPaymentSession
        self.onError = onError
    }
    
    func requestPaymentSession(withToken token: String, for checkoutController: CheckoutController, responseHandler: @escaping (String) -> Void) {
        self.onRequestPaymentSession(token, nil)
    }
    
    func didFinish(with result: Result<PaymentResult>, for checkoutController: CheckoutController) {
        var isSuccess = false
        var isCancelled = false
        
        switch result {
        case let .success(paymentResult):
            self.sendEvent(withName: "onRequestPaymentSession", body: (paymentResult.status == .received || paymentResult.status == .authorised))
        case let .failure(error):
            switch error {
            case PaymentController.Error.cancelled:
                self.sendEvent(withName: "onError", body: PaymentController.Error.cancelled)
            default:
                break
            }
        }
    }
    
    func preparePaymentSession(paymentSession:PaymentSession) -> Dictionary {
        let preparedDictionary = [
            "payment": [
                "countryCode": paymentSession.payment.countryCode
            ]
        ]
    }
}
