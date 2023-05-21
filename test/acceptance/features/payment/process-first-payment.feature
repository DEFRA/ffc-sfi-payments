Feature: Process Incoming First Payment Request

    As a Finance user
    I want process a payment request to be published to the correct ledger
    so that D365 can pay the customer from the correct budget.

    - If no payment history exists, published to the AP ledger.
    - Update account code to reflect the right ledger [AccountCodeAP, AccountCodeARIrr, AccountCodeARAdm]
    - If no previous payment exists for FRN, agreementNumber and marketingYear combination, paymentRequestNumber should be set to 1.

    Scenario: AccountCode mapped to AP ledger
        Given a payment request is received
        When the payment request is completed
        Then the completed payment request should contain:
            | scheme      | SFI                        |
            | ledger      | AP                         |
            | description | G00 - Gross value of claim |
            | accountCode | SOS710                     |
