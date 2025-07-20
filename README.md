# Oxeir AI Resume Builder Backend

## 🚀 Setup Instructions

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd Backend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the `Backend` directory:
     ```
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     ```

4. **Start the server**
   ```sh
   npm start
   # or
   npx nodemon index.js
   ```

5. **Access Swagger API docs**
   - Open [http://localhost:5000/api-docs](http://localhost:5000/api-docs) in your browser.

---

## 🤖 AI Logic (Brief)

- **Resume Keyword Extraction:**
  - Uses the `natural` NLP library to tokenize and stem resume text and job descriptions.
  - Extracted keywords are stored and used for AI-powered matching.

- **AI Matching & Fit %:**
  - When an employer searches, the backend compares job description keywords and required skills to each candidate’s profile.
  - Calculates a fit percentage based on skill overlap and keyword overlap (weighted formula).

---

## ✨ Key Features

- **Candidate Search Engine:**
  - Deep filtering by skills, location, availability, courses, experience, and more.
  - AI-powered fit scoring and resume keyword matching.

- **Employer Tools:**
  - Save and reuse search filters
  - Shortlist candidates
  - Schedule interviews
  - Bulk message shortlisted candidates
  - Export search results and shortlist to CSV/PDF

- **Security & Access Control:**
  - Only verified employers can access candidate search, profiles, and export features.
  - JWT-based authentication for all protected endpoints.

- **API Documentation:**
  - Interactive Swagger UI at `/api-docs` for easy testing and integration.

---

For more details, see the code and Swagger docs! 