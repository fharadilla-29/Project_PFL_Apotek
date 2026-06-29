import axios from "axios"

const API_URL = "https://kicqotolpkahgggculpw.supabase.co/rest/v1/orders"
const API_KEY = "sb_publishable_SpCBeSP1_os03DMxcVzYYg_jE7ox9R6"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

// Map baris Supabase (snake_case) -> bentuk yang dipakai komponen
const toClient = (row) => ({
    id: row.id,
    customerName: row.customer_name,
    status: row.status,
    totalPrice: row.total_price,
    date: row.order_date,
})

export const ordersAPI = {
    async fetchOrders() {
        const response = await axios.get(`${API_URL}?order=order_date.desc`, { headers })
        return response.data.map(toClient)
    },

    async createOrder(data) {
        // data: { id, customerName, status, totalPrice, date }
        const payload = {
            id: data.id,
            customer_name: data.customerName,
            status: data.status,
            total_price: data.totalPrice,
            order_date: data.date,
        }
        const response = await axios.post(API_URL, payload, {
            headers: { ...headers, Prefer: "return=representation" },
        })
        return (response.data || []).map(toClient)
    },

    // Perbarui sebagian field order (mis. status) berdasarkan id
    async updateOrder(id, fields) {
        const payload = {}
        if (fields.status !== undefined)       payload.status = fields.status
        if (fields.customerName !== undefined) payload.customer_name = fields.customerName
        if (fields.totalPrice !== undefined)   payload.total_price = fields.totalPrice
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, payload, {
            headers: { ...headers, Prefer: "return=representation" },
        })
        return (response.data || []).map(toClient)
    },
}