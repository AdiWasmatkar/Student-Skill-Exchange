# 🎓 Student Skill Exchange

A dynamic web application that allows students to share their skills and connect with other students who want to learn them.

## 📌 Project Overview

Student Skill Exchange provides a platform where students can:

- Offer their skills
- Discover available skills
- Search for skills
- Send learning requests
- Track learning-request status
- Access JSON APIs
- Check application health

The project also demonstrates automated testing, ESLint, Docker, GitHub Actions CI/CD, and Render deployment.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Application runtime |
| Express.js | Web server and routing |
| HTML/CSS | User interface |
| JavaScript | Application logic |
| Node.js Test Runner | Automated testing |
| ESLint | Code quality |
| Docker | Containerization |
| Git & GitHub | Version control |
| GitHub Actions | CI/CD |
| Render | Cloud deployment |

---

## ✨ Features

### Offer a Skill

Students can add a skill with:

- Skill name
- Category
- Student name
- Skill level
- Availability

### Find a Skill

Students can search available skills using the search box.

### Learning Requests

Students can request to learn an available skill.

Each request contains:

- Student name
- Selected skill
- Message
- Request status

Supported statuses:

- Pending
- Accepted
- Rejected
- Completed

### JSON APIs

Available API routes include:

```text
GET /api/skills
GET /api/requests