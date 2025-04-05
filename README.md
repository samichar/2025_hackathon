# 2025_hackathon
# 🧠 Legal Case API

This is a simple Express backend that fetches legal case data from the CourtListener API and returns simplified results for a frontend app.

## 🚀 How to Run

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/legal-api.git
cd legal-api

npm install
npm install express cors node-fetch@2 dotenv

node server.js
curl "http://localhost:3000/api/cases?search=employment"
