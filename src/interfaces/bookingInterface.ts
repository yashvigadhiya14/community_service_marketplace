export interface BookingAttributes{
  booking_id?:number;
  customer_id?:number;
  service_id?:number;

  booking_date:string;
  booking_time?:string;

booking_status?: "pending" | "confirmed" | "completed" | "cancelled";  billing_name:string;
  billing_email:string;
  billing_phone:string;
  billing_address:string;

  total_amount:number;

  created_at?:Date;
  updated_at?:Date;
  deleted_at?:Date | null;

}