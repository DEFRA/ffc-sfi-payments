Feature: Process Incoming First Payment Request

    As a payment service
    I want process a payment request and add the correct payment quarters
    so that D365 can pay the customer on time everytime.

    - If no payment history exists, published to the AP ledger.
    - Update account code to reflect the right ledger [AccountCodeAP, AccountCodeARIrr, AccountCodeARAdm]
    - If no previous payment exists for FRN, agreementNumber and marketingYear combination, paymentRequestNumber should be set to 1.
    Scenario: First payment request is set to 1 and accountCode mapped to correct ledger
        Given a payment request is received
        When the payment request is completed
        Then the completed payment request should contain:
            | paymentRequestNumber | 1      |
            | accountCode          | SOS710 |
