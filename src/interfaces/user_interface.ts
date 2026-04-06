export interface UserAttributes {
  user_id?: number
  username: string
  email: string
  password: string
  role: "Admin" | "Service Provider" | "Customer"

  phone?: string | null
  is_verified?: boolean
  verification_token?: string | null
  verification_token_expiry?: Date | null
  refresh_token?: string | null

  reset_password_token: string | null
  reset_password_expiry: Date | null


  created_at?: Date
  updated_at?: Date
}