const { createInvoiceNumber } = require('../../app/invoice-number')

const paymentRequest = {
  sourceSystem: 'SFIP',
  deliveryBody: 'RP00',
  invoiceNumber: 'SFI00000001',
  frn: 1234567890,
  sbi: 123456789,
  paymentRequestNumber: 1,
  agreementNumber: 'SIP00000000000011',
  contractNumber: 'SFIP000001',
  marketingYear: 2022,
  currency: 'GBP',
  schedule: 'M12',
  dueDate: '2021-08-15',
  value: 400.00
}

describe('generate invoice number', () => {
  test('generate invoice number from invoice number', () => {
    const result = createInvoiceNumber(paymentRequest)
    expect(result).toEqual('S00000001SFIP000001V001')
  })

  test('generate invoice number from agreement number', () => {
    paymentRequest.invoiceNumber = ''
    const result = createInvoiceNumber(paymentRequest)
    expect(result).toEqual('S00000011SFIP000001V001')
  })
})
