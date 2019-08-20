import Foundation
import Adyen
import SafariServices

@objc(AdyenReactNative)
class AdyenReactNative: RCTEventEmitter {

    var checkoutController: CheckoutController?
    
    var paymentController: PaymentController?
    
    var adyenResponseHandler: ((String) -> ())?
    
    var selectionHandler: ((PaymentMethod) -> ())?
    
    override func supportedEvents() -> [String]! {
        return [
            "onRequestPaymentSession",
            "onError",
            "onPaymentResult",
            "onSelectPaymentMethod"
        ]
    }
}

extension AdyenReactNative: CheckoutControllerDelegate {
    
    @objc func cancelPayment() {
        checkoutController?.cancel()
    }
    
    @objc func startPayment() {
        checkoutController = CheckoutController(presentingViewController: (UIApplication.shared.delegate?.window??.rootViewController)!, delegate: self)
        checkoutController!.start()
    }
    
    @objc func confirmPayment(_ encodedToken: String) {
        if let handler = self.adyenResponseHandler {
            handler(encodedToken)
        }
    }
    
    func requestPaymentSession(withToken token: String, for checkoutController: CheckoutController, responseHandler: @escaping (String) -> ()) {
        self.adyenResponseHandler = responseHandler
        self.sendEvent(
            withName: "onRequestPaymentSession",
            body: [
                "token": token,
                "returnUrl": "",
                ]
        )
        
    }
    
    func didFinish(with result: Result<PaymentResult>, for checkoutController: CheckoutController) {
        switch result {
        case let .success(paymentResult):
            self.sendEvent(withName: "onPaymentResult", body: ["code": paymentResult.status.rawValue.uppercased(), "payload": paymentResult.payload])
        case let .failure(error):
            switch error {
            case PaymentController.Error.cancelled:
                self.sendEvent(
                    withName: "onError",
                    body: ["code": "CANCELLED", "message": "Payment was cancelled"]
                )
            default:
                self.sendEvent(
                    withName: "onError",
                    body: ["code": "Error", "message": error.localizedDescription]
                )
            }
        }
    }
}

extension AdyenReactNative: PaymentControllerDelegate, SFSafariViewControllerDelegate {
    func redirect(to url: URL, for paymentController: PaymentController) {
        let safariViewController = SFSafariViewController(url: url)
        safariViewController.delegate = self
        UIApplication.shared.keyWindow?.rootViewController?.present(safariViewController, animated: true)
    }
    
    func selectPaymentMethod(from paymentMethods: SectionedPaymentMethods, for paymentController: PaymentController, selectionHandler: @escaping (PaymentMethod) -> ()) {
        print(paymentMethods)
        self.sendEvent(
            withName: "onSelectPaymentMethod",
            body: [
                "preferred": paymentMethods.preferred,
                "other":paymentMethods.other,
                "count":paymentMethods.count
            ]
        )
        self.selectionHandler = selectionHandler
    }
    
    func requestPaymentSession(withToken token: String, for paymentController: PaymentController, responseHandler: @escaping (String) -> ()) {
        
    }
    
    func didFinish(with result: Result<PaymentResult>, for paymentController: PaymentController) {
        
    }
    
    func safariViewControllerDidFinish(_ controller: SFSafariViewController) {
        controller.dismiss(animated: true, completion: nil)
    }
    
    func provideAdditionalDetails(_ additionalDetails: AdditionalPaymentDetails, for paymentMethod: PaymentMethod, detailsHandler: @escaping Completion<[PaymentDetail]>){
        
    }
    
    @objc func initPayment() {
        paymentController = PaymentController(delegate: self)
        paymentController?.start()
    }
    
    @objc func selectPaymentMethod() {
        
    }
}
