export interface ServiceCategoryAttributes {
  service_category_id: number;
  service_category_name: string;
  description?: string;
  status: "active" | "inactive";
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}