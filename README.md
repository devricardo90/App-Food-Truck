# 🚀 FoodTruck Platform

A full-stack ordering platform for food trucks operating at events, including a mobile app for customers, an admin panel, and a central API.

---

## 📸 Preview

![Mobile App](./docs/images/mobile.png)
![Admin Panel](./docs/images/admin.png)

---

## 🌐 Live Demo

👉 https://your-app-link.com

---

## 🔐 Demo Access

Email: demo@foodtruck.com  
Password: 123456  

---

## ⚙️ Tech Stack

- React Native (Expo)
- Next.js
- NestJS
- Prisma
- PostgreSQL
- TypeScript
- Turborepo (monorepo architecture)

---

## 🎯 Core Features

- Browse food trucks at events
- Build and place orders
- Payment flow integration (MVP simulated or real)
- Real-time order lifecycle
- Admin panel for food truck operations

---

## 🔄 Order Lifecycle (MVP)

1. Customer selects a food truck  
2. Builds an order  
3. Pays  
4. Order is confirmed  
5. Food truck prepares the order  
6. Customer is notified  
7. Pickup  

---

## 🧠 What I Learned

- Designing scalable monorepo architecture  
- Building APIs with NestJS and Prisma  
- Structuring real-world order flows  
- Managing state and UX in mobile apps  
- Integrating frontend and backend systems  

---

## 📁 Project Structure

```bash
apps/
  admin/
  api/
  mobile/

packages/
  api-client/
  config/
  schemas/
  types/
  utils/

🚀 How to Run
pnpm install
pnpm dev
📌 Notes

This project follows a structured development protocol with strong focus on:

consistency
scalability
production-ready architecture
📄 Documentation

Detailed documentation available in:

docs/product/mvp.md
docs/flows/order-flow.md
docs/architecture/
🟢 Status

MVP in progress with validated architecture and core flows implemented.
