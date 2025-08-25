export interface Category {
  id: number,
  name: string,
}

export interface Product {
    id: number,
    category_id: number,
    name: string,
    price: number,
}

export interface Drink {
    id: number,
    category_id: number,
    name: string,
    price: number[],
}

export interface Discount {
  id: number,
  name: string,
  value: number,
}
