export interface Category {
  id: string;
  name: string;
  active: boolean;
  sortOrder: number;
}

export interface CategoryInput {
  name: string;
  active: boolean;
  sortOrder: number;
}
