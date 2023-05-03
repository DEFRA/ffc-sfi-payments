Feature: Dual Accounting

    As a payment service
    I want the EU fund code to be applied to the payment request for FDMR, if applicable
    so that D365 can process the request with the correct fund code

    - EU marketing year is the transition period from EU which ended 31 December 2020
    - DOM10: 
    - DOM00: no payment has been made for a previous Payment Request using an EU fund code
    - DOM01: payment has been made for a previous Payment Request using an EU fund code

    Rule: Replace EU fund code
        Example: For First Payment
            Given an FDMR payment request with <marketing year>
            When the payment request is published
            Then use <domestic fund code> for all invoice lines

            Examples:
                | marketing year | domestic fund code |
                | 2021           | DOM10              |
                | 2020           | DOM10              |
                | 2019           | DOM00              |

        Example: For subsequent payment
            Given an FDMR payment request with marketing year <marketing year> and fund code <fund code>
            And a payment has <stateOfPayment> for payment request
            When a new payment request with fund code <new fund code> is submitted
            Then <fund code> is set to <new fund code> for all invoice lines

            Examples:
                | marketing year | fund code | stateOfPayment | new fund code |
                | 2019           | DOM00     | not been made  | DOM00         |
                | 2020           | DOM01     | been made      | DOM01         |
                | 2021           | EGF00     | not been made  | DOM01         |
