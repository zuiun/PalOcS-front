import { LineAPI } from "@/utils/types";

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
  const taxRate = parseInt (process.env.EXPO_PUBLIC_TAX_RATE!);
  let tax = subtotal;

  tax *= taxRate / 100_00;
  tax = Math.ceil (tax);
  return tax;
};
