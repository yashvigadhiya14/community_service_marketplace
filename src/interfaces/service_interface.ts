export interface ServiceAttributes {
    service_id?: number
    provider_id?: number
    category_id?: number
    title: string
    service_description: string
    price: number
    location: string
    availability?: string
    city: string
    status?: "active" | "inactive"

};