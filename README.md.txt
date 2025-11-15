# Restaurant Ordering Web App (Next.js + Supabase)

A full-stack restaurant ordering application built using:

- **Next.js (App Router)**
- **Supabase (Auth + Database + Storage + Realtime)**
- **TailwindCSS**
- **TypeScript**

This project includes a public client interface and a protected admin dashboard.

---

## 🚀 Features (According to Project Requirements)

### **Client Side (No Login Required)**
- Menu page (list items with image, name, price)
- Add-to-cart system (Uber Eats style cart)
- Submit order with phone number
- Order status page with:
  - Pending state
  - Approved state with countdown timer
  - Declined state
  - Completed state
- Realtime order status updates using Supabase Realtime

---

### **Admin Side (Login Required)**
- Email/password login powered by Supabase Auth
- Protected admin routes using middleware
- Inventory Management
  - Add inventory items (name, quantity, image upload)
  - Edit/delete items
- Menu Management
  - Add menu items (name, price, image)
  - Map menu items to required inventory items & quantities
  - Delete menu items
- Orders Page
  - View active incoming orders
  - Approve order & set prep time (minutes)
  - Decline order
  - Mark order as completed
  - **Automatically deduct inventory** based on mapping
- Order History Page with totals and timestamps

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TailwindCSS |
| Backend | Supabase Database |
| Auth | Supabase Email/Password |
| Storage | Supabase Storage (images) |
| Realtime | Supabase Realtime |
| Deployment | Vercel |

---

## 🗂 Project Structure

