import { taxRate } from "@/utils/consts";
import { LineAPI } from "@/utils/types";

export function convertDecimal (number: number) {
  const units = Math.floor (number / 1_00);
  const decimals = number % 1_00;
  const decimalsPadded = `${decimals}`.padStart (2, "0");

  return `${units},${decimalsPadded}`;
}

export function calculatePrice (price: number, discount?: number) {
    if (discount) {
        let priceDiscounted = price;

        priceDiscounted *= (100 - discount) / 100;
        priceDiscounted = Math.ceil (priceDiscounted);
        return priceDiscounted;
    } else {
        return price;
    }
}

export function calculateSubtotal (purchases: LineAPI[]) {
    let subtotal: number = 0;

    purchases.forEach ((p) => subtotal += calculatePrice (p.price[p.size], p.discount_value));

    return subtotal;
};


export function calculateTax (purchases: LineAPI[]) {
    const subtotal = calculateSubtotal (purchases);
    let tax = subtotal;

    tax *= taxRate / 100_00;
    tax = Math.ceil (tax);
    return tax;
};
