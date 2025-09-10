// controllers/analyticsController.js
const Transaction = require('../models/Transaction');

const categoryGroups = {
  "Operating Expenses (OPEX)": [
    "Rent or Lease (Office, Warehouse, Retail Space)",
    "Utilities (Electricity, Water, Internet, Gas)",
    "Office Supplies",
    "Maintenance & Repairs",
    "Insurance (General Liability, Property, Workers' Comp)",
  ],
  "Employee-Related Expenses": [
    "Salaries & Wages",
    "Employee Benefits (Health, Dental, Retirement Plans)",
    "Payroll Taxes",
    "Recruitment & Hiring Costs",
    "Training & Development",
  ],
  "Marketing & Advertising": [
    "Online Ads (Google, Facebook, etc.)",
    "Print & Media Advertising",
    "Marketing Agency Fees",
    "Promotional Materials (Flyers, Merchandise)",
    "Website Costs (Hosting, Design, SEO)",
  ],
  "Technology & Software": [
    "Subscriptions (SaaS, Cloud Services)",
    "IT Support Services",
    "Software Licenses (Accounting, CRM, ERP)",
    "Hardware (Laptops, Phones, Servers)",
  ],
  "Travel & Entertainment": [
    "Business Travel (Flights, Hotels, Meals)",
    "Vehicle Expenses (Fuel, Maintenance, Lease)",
    "Meals & Entertainment (Client Dinners, Company Events)",
  ],
  "Professional Services": [
    "Legal Fees",
    "Accounting & Bookkeeping",
    "Consulting Services",
    "Contracted Labor / Freelancers",
  ],
  "Inventory & Cost of Goods Sold (COGS)": [
    "Raw Materials",
    "Manufacturing Costs",
    "Packaging Supplies",
    "Shipping & Freight Inbound",
  ],
  "Depreciation & Amortization": [
    "Depreciation of Equipment, Furniture, etc.",
    "Amortization of Intangible Assets",
  ],
  "Taxes & Licenses": [
    "Business Licenses & Permits",
    "Property Tax",
    "Sales Tax Paid",
    "Corporate Income Tax",
  ],
  "Banking & Financial Fees": [
    "Bank Charges",
    "Loan Interest",
    "Credit Card Fees",
    "Currency Exchange Fees",
  ],
  "Makers": [
    "Maker A",
    "Maker B",
    "Maker C",
  ],
};

async function getAnalytics(req, res) {
  try {
    const transactions = await Transaction.find();

    // categorySales: income by main category
    const categoryMap = {};
    transactions.filter(t => t.type === 'income').forEach(t => {
      let mainCat = 'Other';
      for (const mc in categoryGroups) {
        if (categoryGroups[mc].includes(t.category)) {
          mainCat = mc;
          break;
        }
      }
      categoryMap[mainCat] = (categoryMap[mainCat] || 0) + t.amount;
    });
    const categorySales = Object.entries(categoryMap).map(([category, amount]) => ({ category, amount }));

    // regionProfit: hardcoded for demo (add region to transactions if needed)
    const regionProfit = [
      { region: 'North', profit: Math.random() * 20000 },
      { region: 'South', profit: Math.random() * 20000 },
      { region: 'East', profit: Math.random() * 20000 },
      { region: 'West', profit: Math.random() * 20000 },
    ];

    // makers: expenses where category starts with 'Makers:'
    const makersMap = {};
    transactions.filter(t => t.type === 'expense' && t.category.startsWith('Makers:')).forEach(t => {
      const name = t.category.slice(7);
      if (!makersMap[name]) makersMap[name] = { spend: 0, orders: 0 };
      makersMap[name].spend += t.amount;
      makersMap[name].orders += 1;
    });
    const makers = Object.entries(makersMap).map(([name, { spend, orders }]) => ({ name, spend, orders }));

    res.json({ categorySales, regionProfit, makers });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getAnalytics };
