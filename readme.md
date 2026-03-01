
# 🚀 QuoteIt Backend

RESTful API service that provides quote resources for the QuoteIt mobile application.

---

## 📖 Description

**QuoteIt Backend** is a Node.js-based RESTful API that powers the QuoteIt app.  
It provides random quotes, quotes by tags, tag management, and quote creation features using Google Firestore as the database.

---

## ⚙️ Tech Stack

- Node.js  
- RESTful API Architecture  
- Firebase Firestore  
- Express.js (or similar framework)  
- Environment-based configuration  

---

## ✨ Features

- Provide random quotes  
- Fetch random quotes by specific tag  
- List available tags  
- Add new tags  
- Add new quotes  
- API key-based authentication  
- Health check endpoint  

---

## 📂 Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- npm
- Firebase project with Firestore enabled

### Steps

1. Clone the repository:
   ```bash
   git clone <your-repository-url>

2. Install dependencies:
	  ```bash
    npm install
3. Configure environment variables in a `.env` file:
	```bash
	PORT=4000
	API_KEY=your_api_key_here
	FIREBASE_PROJECT_ID=your_project_id
4. Start the development server:
	```bash
	npm start dev
The server will start on:
```bash
	http://localhost:4000
```
## ▶️ API Usage

All endpoints require an `x-api-key` header for authentication.
### ➕ Add Quote
```bash
curl --request POST \
  --url http://127.0.0.1:5001/quoteit-backend/us-central1/quote \
  --header 'content-type: application/json' \
  --header 'YOUR_API_KEY' \
  --data '{
    "author": "prawin",
    "quote": "dass",
    "slugs": ["motivational"]
  }'
 ```
### ➕ Add Tag
```bash
curl --request POST \
  --url http://localhost:4000/tag \
  --header 'content-type: application/x-www-form-urlencoded' \
  --header 'x-api-key: YOUR_API_KEY' \
  --data 'tag=hi there' \
  --data 'slug=motivation' \
  --data 'img=lajdsla'
```
### 📋 Get All Tags
```bash
curl --request GET \
  --url http://localhost:4000/tags \
  --header 'x-api-key: YOUR_API_KEY'

```
### ➕ Add Quote
```bash
curl --request POST \
  --url http://127.0.0.1:5001/quoteit-backend/us-central1/quote \
  --header 'content-type: application/json' \
  --header 'YOUR_API_KEY' \
  --data '{
    "author": "prawin",
    "quote": "dass",
    "slugs": ["motivational"]
  }'
```
### 🎲 Get Random Quote
```bash
curl --request GET \
  --url http://localhost:4000/random \
  --header 'x-api-key: YOUR_API_KEY'
```
### 🏷️ Get Random Quote by Tag
```bash
curl --request GET \
  --url 'http://127.0.0.1:5001/quoteit-backend/us-central1/random?slug=motivational' \
  --header 'x-api-key: YOUR_API_KEY'
  ```

### ❤️ Health Check
```bash
curl --request GET \
  --url http://localhost:4000/health
```

## ☁️ Deployment

The backend is deployed on AWS Elastic Beanstalk:
```code
http://quoteIt-env-1.eba-mecyfpmd.ap-south-1.elasticbeanstalk.com

## 👨‍💻 Author

**Prawin**

## 📜 License

This project is licensed under the MIT License.

You are free to use, modify, and distribute this software with proper attribution.