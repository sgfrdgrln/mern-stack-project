const asyncHandler = require('express-async-handler');
const exceljs = require('exceljs');
const Commission = require('../models/Commission');

class ExcelController {
  // CREATE
  static addCommissionList = asyncHandler(async (req, res) => {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const workbook = new exceljs.Workbook();
      await workbook.xlsx.load(file.buffer);

      const worksheet = workbook.getWorksheet(1); // Assuming the data is in the first worksheet

      const commissionData = [];

      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 1) { // Skip header row
          const amount = row.getCell(13).value;
          const tcp = row.getCell(14).value;
          const vatPercentage = row.getCell(15).value; // Assuming vat as percentage
          const vat_amount = row.getCell(16).value;
          const nsp = row.getCell(17).value;
          const miscPercent = row.getCell(18).value;
          const miscAmount = row.getCell(19).value;
          const paymentNoMisc = row.getCell(20).value;

          commissionData.push({
            amount: ExcelController.sanitizeValue(amount),
            tcp: ExcelController.sanitizeValue(tcp),
            vat: ExcelController.sanitizeValue(vatPercentage), // Store percentage as string
            vat_amount: ExcelController.sanitizeValue(vat_amount),
            nsp: ExcelController.sanitizeValue(nsp),
            miscPercent: ExcelController.sanitizeValue(miscPercent),
            miscAmount: ExcelController.sanitizeValue(miscAmount),
            paymentNoMisc: ExcelController.sanitizeValue(paymentNoMisc),
          });
        }
      });

      await Commission.create(commissionData);

      res.status(200).json({ message: 'Commission data added successfully' });
      console.log('Commission data added successfully')
    } catch (error) {
      console.error('Error importing commission data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  static sanitizeValue = (value) => {
    const formatNumber = (num) => {
      if (typeof num === 'number') {
        return num.toFixed(2); // Convert number to fixed decimal format
      }
      return num; // Return as is if not a number
    };
  
    if (typeof value === 'object' && value !== null) {
      if (value.error === '#N/A') {
        return -1; // Handle special case for '#N/A'
      } else if (value.result !== undefined) {
        // Assuming value.result might be a percentage string like '12%'
        // Convert percentage string to numeric value (e.g., '12%' -> 0.12)
        const percentageValue = parseFloat(value.result);
        if (!isNaN(percentageValue)) {
          return formatNumber(percentageValue);
        } else {
          return null; // Handle invalid percentage format
        }
      }
      return null; // Handle other object cases if necessary
    }
  
    if (typeof value === 'string') {
      // Check if the value is a percentage string like '12%'
      if (value.endsWith('%')) {
        const percentageValue = parseFloat(value) / 100;
        if (!isNaN(percentageValue)) {
          return formatNumber(percentageValue);
        } else {
          return null; // Handle invalid percentage format
        }
      }
    }
  
    // For other cases (non-object, non-string), return as is or handle accordingly
    return value !== null ? formatNumber(value) : null;
  };
  
}

module.exports = ExcelController;
