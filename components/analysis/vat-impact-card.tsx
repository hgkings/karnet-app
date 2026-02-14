'use client';

import { ProductInput } from '@/types';
import { formatCurrency } from '@/components/shared/format';
import { Receipt } from 'lucide-react';
import { n } from '@/utils/calculations';

interface VatImpactCardProps {
    input: ProductInput;
    vatAmount: number;
}

export function VatImpactCard({ input, vatAmount }: VatImpactCardProps) {
    const salePrice = n(input.sale_price);
    const isVatIncluded = input.sale_price_includes_vat !== false;

    // Guard against NaN
    const displayVat = Number.isFinite(vatAmount) ? vatAmount : 0;

    // Calculate Net Price
    // If VAT included: Net = Price - VAT
    // If VAT excluded: Net = Price
    const netPrice = isVatIncluded
        ? (Number.isFinite(salePrice - displayVat) ? (salePrice - displayVat) : 0)
        : salePrice;

    // Formatting helper to handle 0 as valid but NaN/null as '-'
    const fmt = (val: number) => {
        if (!Number.isFinite(val)) return '—';
        return formatCurrency(val);
    };

    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-muted-foreground">Vergi Etkisi (Birim KDV)</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                        {fmt(Math.abs(displayVat))}
                    </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2">
                    <Receipt className="h-5 w-5 text-primary" />
                </div>
            </div>

            <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">KDV Hariç Satış:</span>
                    <span className="font-medium text-foreground">{fmt(netPrice)}</span>
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                    {isVatIncluded
                        ? `Birim fiyat KDV dahil kabul edilerek ayrıştırıldı (%${input.vat_pct}).`
                        : `Birim fiyat KDV hariç kabul edilerek hesaplandı (%${input.vat_pct}).`
                    }
                </p>
            </div>
        </div>
    );
}
