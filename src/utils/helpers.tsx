export function convertPrice (price: number) {
  const dollars = Math.floor (price / 1_00);
  const cents = price % 1_00;
  const centsPadded = `${cents}`.padStart (2, "0");

  return `$${dollars},${centsPadded}`;
}

export function calculatePrice (price: number, discount?: number) {
  if (discount) {
    let priceNew = price;

    priceNew *= (100 - discount) / 100;
    priceNew = Math.ceil (priceNew);
    return priceNew;
  } else {
    return price;
  }
}
