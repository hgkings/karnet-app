
import { calculateProAccounting } from '../utils/pro-accounting';
import { ProductInput } from '../types';

const baseInput = {
    marketplace: 'trendyol',
    product_name: 'Test',
    monthly_sales_volume: 1,
    product_cost: 0,
    sale_price: 0,
    commission_pct: 0,
    shipping_cost: 0,
    packaging_cost: 0,
    ad_cost_per_sale: 0,
    return_rate_pct: 0,
    vat_pct: 20,
    other_cost: 0,
    payout_delay_days: 0,
    // PRO fields
    sale_price_includes_vat: true,
    product_cost_includes_vat: true,
    accounting_mode: 'pro',
} as ProductInput;

function runTests() {
    console.log('--- Running PRO Calculation Tests ---');

    console.log('Test 1: VAT Included (Sale=500, VAT=20%)');
    const t1 = calculateProAccounting({ ...baseInput, sale_price: 500, vat_pct: 20, sale_price_includes_vat: true });
    // Expected: Net = 500 / 1.2 = 416.666... , VAT = 500 - 416.66... = 83.333...
    console.log(`Net Sales: ${t1.sale_price_excl_vat.toFixed(2)} (Expected: 416.67)`);
    console.log(`VAT Amount: ${t1.vat_amount.toFixed(2)} (Expected: 83.33)`);

    console.log('\nTest 2: VAT Excluded (Sale=100, VAT=20%)');
    const t2 = calculateProAccounting({ ...baseInput, sale_price: 100, vat_pct: 20, sale_price_includes_vat: false });
    // Expected: Net = 100, VAT = 20
    console.log(`Net Sales: ${t2.sale_price_excl_vat.toFixed(2)} (Expected: 100.00)`);
    console.log(`VAT Amount: ${t2.vat_amount.toFixed(2)} (Expected: 20.00)`);

    console.log('\nTest 3: Commission on Net Sales (Sale=120 (inc VAT), VAT=20%, Comm=10%)');
    // Net Sales = 100. Commission = 10% of 100 = 10.
    const t3 = calculateProAccounting({
        ...baseInput,
        sale_price: 120,
        vat_pct: 20,
        sale_price_includes_vat: true,
        commission_pct: 10
    });
    console.log(`Commission: ${t3.commission_amount.toFixed(2)} (Expected: 10.00)`);

    console.log('\nTest 4: Net Cost Separation (Cost=120 (inc VAT), VAT=20%)');
    // We can't see Net Cost in result directly but we can verify Total Unit Cost if other expenses 0.
    // Net Cost = 100. Total Cost = 100.
    const t4 = calculateProAccounting({
        ...baseInput,
        product_cost: 120,
        product_cost_includes_vat: true,
        vat_pct: 20
    });
    console.log(`Unit Var Cost: ${t4.unit_variable_cost.toFixed(2)} (Expected: 100.00)`);

    console.log('--- Tests Completed ---');
}

runTests();
