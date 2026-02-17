
export const PRICING = {
    proMonthly: 229,
    oldMonthly: 399, // Eskiden 399'du indirimli 199 gibi gösteriliyor
    proYearly: 2290,
    currency: "TRY",
    symbol: "₺",
};

export const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: PRICING.currency,
        maximumFractionDigits: 0,
    }).format(amount).replace('TRY', '').trim() + PRICING.symbol;
};

export const monthlyLabel = () => `${PRICING.proMonthly}${PRICING.symbol}/ay`;
export const yearlyLabel = () => `${PRICING.proYearly}${PRICING.symbol}/yıl`;
