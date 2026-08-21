export interface PaymentType {
  id: string;
  name: string;
  active: boolean;
  sortOrder: number;
}

export interface PaymentTypeInput {
  name: string;
  active: boolean;
  sortOrder: number;
}
