export interface SubcategoryAPI {
  id: number,
  name: string,
}

export interface ProductAPI {
  id: number,
  subcategory_id: number,
  name: string,
  price: number[],
}

export interface DiscountAPI {
  id: number,
  name: string,
  value: number,
}

export interface Purchase {
  id: number,
  name: string,
  price: number,
  discount?: DiscountAPI,
}

export interface PurchaseAPI {
  id: number,
  price: number,
  discount_id?: number,
}

export interface LineAPI {
    name: string,
    price: number,
    discount_name?: string,
    discount_value?: number,
}

export interface ReceiptAPI {
    id: number,
    timestamp: string,
    user_id: string,
    user_name: string,
    lines: LineAPI[],
    payment: string,
}

export interface Status {
  isError: boolean,
  isSuccess: boolean,
}
