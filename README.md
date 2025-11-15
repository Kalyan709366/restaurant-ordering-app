🍽️ Restaurant Ordering Web App

A full-stack restaurant ordering system built with Next.js 14, Supabase, and Bootstrap 5.
Customers can browse the menu, add items to cart, and place orders.
Admins can manage menu items, inventory, and update order statuses.

🚀 Live Deployment (Vercel)

Your application is deployed on Vercel:

open your Vercel project and click "Open in Browser"
https://vercel.com/kalyan709366s-projects/restaurant-ordering-app


📂 GitHub Repository
https://github.com/Kalyan709366/restaurant-ordering-app

🔐 Admin Login
Use these credentials to test the admin panel:

Email: admin@example.com
Password: YourStrongPassword123


Admin Portal:
https://localhost:3000/admin/login 

🧪 How to Run Locally
1️⃣ Clone the repository
git clone https://github.com/Kalyan709366/restaurant-ordering-app
cd restaurant-ordering-app

2️⃣ Install dependencies
npm install

3️⃣ Add environment variables

Create a file named .env.local in the project root and add:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4️⃣ Run the development server
npm run dev


Application runs at:

http://localhost:3000

🛠️ Tech Stack

Next.js 14 (App Router)

Supabase (Database, Auth, Storage, Realtime)

Bootstrap 5

React Hooks

TypeScript

📌 Main Features
👤 User Side

Browse menu items

Add items to cart

Submit orders

Track live order status

🛠️ Admin Side

Admin login

Add/edit menu items with image upload

Inventory management

Map ingredients to menu items

View incoming orders

Update order status

Order history

📁 Project Structure
/app
  /menu
  /cart
  /submit-order
  /order-status/[id]
  /admin
    /login
    /menu
    /inventory
    /orders
    /history
/lib
  supabase.ts

