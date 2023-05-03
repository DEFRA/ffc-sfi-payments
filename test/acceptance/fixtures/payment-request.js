const request = {
  sourceSystem: 'SFI',
  batch: 'SITISFI0001_AP_2022110909115624.dat',
  deliveryBody: 'RP00',
  invoiceNumber: 'S000000100000001V001',
  frn: '1000000001',
  marketingYear: 2022,
  paymentRequestNumber: 1,
  agreementNumber: '00000001',
  contractNumber: '00000001',
  currency: 'GBP',
  schedule: 'Q4',
  dueDate: '01/12/2021',
  value: 200000,
  correlationId: '5a83dacb-f34a-4968-bcf2-93cc6c8fe021',
  invoiceLines: [
    {
      schemeCode: '80101',
      accountCode: 'SOS273',
      fundCode: 'DRD10',
      description: 'G00 - Gross value of claim',
      value: 200000,
      convergence: false
    }
  ],
  schemeId: 1,
  ledger: 'AP'
}
module.exports = request
