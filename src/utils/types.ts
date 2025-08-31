export interface Status {
    isError: boolean,
    isSuccess: boolean,
}

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
    size: number,
    price: number[],
    discount?: DiscountAPI,
}

export interface PurchaseAPI {
    id: number,
    size: number,
    discount_id?: number,
}

export interface LineAPI {
    name: string,
    size: number,
    price: number[],
    discount_name?: string,
    discount_value?: number,
}

export interface RefundAPI {
    manager_id: string,
    manager_name: string,
}

export interface ReceiptAPI {
    id: number,
    timestamp: string,
    user_id: string,
    user_name: string,
    lines: LineAPI[],
    payment: string,
    refund?: RefundAPI,
}

interface SaleAPI {
    cost: number,
    discount?: number,
}

export interface ReportAPI {
    user_id: string,
    user_name: string,
    date: string,
    timestamp: string,
    voids: SaleAPI[],
    refunds: SaleAPI[],
    sales_cash: SaleAPI[],
    sales_not_cash: SaleAPI[],
    tax: number,
}

export interface CompilationAPI {
  voids: [number, number],
  refunds: [number, number],
  sales_cash: [number, number],
  sales_not_cash: [number, number],
  discounts: [number, number],
  tax: number,
}
