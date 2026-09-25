const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const skills = [
  {
    id: 1,
    name: 'Python',
    category: 'Programming',
    owner: 'Aditi',
    level: 'Advanced',
    availability: 'Weekends'
  },
  {
    id: 2,
    name: 'Graphic Design',
    category: 'Design',
    owner: 'Rahul',
    level: 'Intermediate',
    availability: 'Evenings'
  }
];

let nextSkillId = 3;

const requests = [];

let nextRequestId = 1;

// --------------------------------------------------
// HOME PAGE
// --------------------------------------------------
app.get('/', (req, res) => {

  const search = req.query.search || '';
  const category = req.query.category || '';
  const level = req.query.level || '';

  const filteredSkills = skills.filter((skill) => {

    const matchesSearch =
      skill.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      !category || skill.category === category;

    const matchesLevel =
      !level || skill.level === level;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const skillCards = filteredSkills.map((skill) => `
    <div class="skill-card">
      <div class="skill-top">
        <div>
          <h3>${skill.name}</h3>
          <span class="category">${skill.category}</span>
        </div>
        <span class="level">${skill.level}</span>
      </div>

      <div class="skill-info">
        <p><strong>👤 Offered by:</strong> ${skill.owner}</p>
        <p><strong>🕒 Available:</strong> ${skill.availability}</p>
      </div>

      <form method="POST" action="/requests" class="request-form">
        <input
          type="hidden"
          name="skillId"
          value="${skill.id}"
        >

        <input
          type="text"
          name="studentName"
          placeholder="Your name"
          required
        >

        <textarea
          name="message"
          placeholder="Why do you want to learn this skill?"
          required
        ></textarea>

        <button type="submit">
          📩 Request to Learn
        </button>
      </form>
    </div>
  `).join('');

  const requestRows = requests.length
    ? requests.map((request) => `
        <tr>
          <td>${request.studentName}</td>
          <td>${request.skillName}</td>
          <td>${request.message}</td>
         <td>
          <span class="status ${request.status.toLowerCase()}">
            ${request.status}
          </span>

          ${
            request.status === 'Pending'
              ? `
                <div class="request-actions">

                  <form method="POST" action="/requests/${request.id}/status">
                    <input
                      type="hidden"
                      name="status"
                      value="Accepted"
                    >
                    <button type="submit" class="accept-btn">
                      ✅ Accept
                    </button>
                  </form>

                  <form method="POST" action="/requests/${request.id}/status">
                    <input
                      type="hidden"
                      name="status"
                      value="Rejected"
                    >
                    <button type="submit" class="reject-btn">
                      ❌ Reject
                    </button>
                  </form>

                </div>
              `
              : ''
          }
        </td>
        </tr>
      `).join('')
    : `
      <tr>
        <td colspan="4" class="empty">
          No learning requests yet.
        </td>
      </tr>
    `;

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Student Skill Exchange</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      background: #f4f7fb;
      color: #1f2937;
      line-height: 1.5;
    }

    /* NAVBAR */

    .navbar {
      background: #111827;
      color: white;
      padding: 18px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar h1 {
      font-size: 22px;
    }

    .navbar p {
      color: #9ca3af;
      font-size: 13px;
    }

    /* MAIN CONTAINER */

    .container {
      max-width: 1200px;
      margin: 30px auto;
      padding: 0 20px;
    }

    /* HERO */

    .hero {
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      color: white;
      padding: 40px;
      border-radius: 18px;
      margin-bottom: 25px;
      box-shadow: 0 10px 30px rgba(37, 99, 235, 0.2);
    }

    .hero h2 {
      font-size: 34px;
      margin-bottom: 10px;
    }

    .hero p {
      color: #dbeafe;
      max-width: 700px;
      font-size: 16px;
    }

    .hero-buttons {
      margin-top: 20px;
    }

    .hero-button {
      display: inline-block;
      background: white;
      color: #2563eb;
      padding: 10px 18px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      margin-right: 8px;
    }

    /* STATS */

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      margin-bottom: 25px;
    }

    .stat-card {
      background: white;
      padding: 22px;
      border-radius: 14px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
    }

    .stat-icon {
      font-size: 25px;
      margin-bottom: 8px;
    }

    .stat-card h3 {
      font-size: 28px;
      color: #2563eb;
    }

    .stat-card p {
      color: #6b7280;
      margin-top: 3px;
    }

    /* SECTION */

    .section {
      background: white;
      padding: 25px;
      border-radius: 14px;
      margin-bottom: 25px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }

    .section-header {
      margin-bottom: 20px;
    }

    .section-header h2 {
      margin-bottom: 5px;
    }

    .section-header p {
      color: #6b7280;
      font-size: 14px;
    }

    /* SKILLS */

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 18px;
    }

    .skill-card {
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 20px;
      background: #ffffff;
      transition: 0.2s ease;
    }

    .skill-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border-color: #bfdbfe;
    }

    .skill-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 15px;
    }

    .skill-card h3 {
      color: #111827;
      font-size: 20px;
      margin-bottom: 5px;
    }

    .category {
      display: inline-block;
      font-size: 12px;
      color: #2563eb;
      background: #eff6ff;
      padding: 4px 9px;
      border-radius: 20px;
    }

    .level {
      background: #f3f4f6;
      color: #374151;
      padding: 5px 9px;
      border-radius: 20px;
      font-size: 12px;
      white-space: nowrap;
    }

    .skill-info {
      margin-bottom: 15px;
    }

    .skill-info p {
      color: #6b7280;
      font-size: 14px;
      margin: 6px 0;
    }

    /* SEARCH & FILTER */

      .search-box {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr auto;
        gap: 10px;
        margin-bottom: 20px;
        padding: 15px;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
      }

      .search-box button {
        white-space: nowrap;
      }

      @media (max-width: 700px) {
        .search-box {
          grid-template-columns: 1fr;
        }
      }
    
    /* FORMS */

    .request-form {
      display: grid;
      gap: 10px;
      border-top: 1px solid #e5e7eb;
      padding-top: 15px;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 11px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
    }

    input:focus,
    select:focus,
    textarea:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    textarea {
      min-height: 75px;
      resize: vertical;
    }

    button {
      background: #2563eb;
      color: white;
      border: none;
      padding: 11px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: 0.2s;
    }

    button:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    /* ADD SKILL */

    .add-skill-form {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .add-skill-form button {
      grid-column: 1 / -1;
    }

    /* REQUEST ACTIONS */

      .request-actions {
        display: flex;
        gap: 8px;
        margin-top: 10px;
      }

      .request-actions form {
        display: inline;
      }

      .request-actions button {
        padding: 7px 10px;
        font-size: 12px;
      }

      .accept-btn {
        background: #16a34a;
      }

      .accept-btn:hover {
        background: #15803d;
      }

      .reject-btn {
        background: #dc2626;
      }

      .reject-btn:hover {
        background: #b91c1c;
      }

    /* REQUEST TABLE */

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 700px;
    }

    th,
    td {
      text-align: left;
      padding: 13px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }

    th {
      background: #f9fafb;
      color: #374151;
    }

    .status {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }

    .pending {
      background: #fef3c7;
      color: #92400e;
    }

    .accepted {
      background: #dcfce7;
      color: #166534;
    }

    .rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    .empty {
      text-align: center;
      color: #6b7280;
      padding: 25px;
    }

    /* FOOTER */

    .commit {
      text-align: center;
      padding: 25px;
      color: #6b7280;
      font-size: 13px;
    }

    .commit span {
      font-family: monospace;
      background: #e5e7eb;
      padding: 3px 7px;
      border-radius: 5px;
    }

    /* RESPONSIVE */

    @media (max-width: 700px) {
      .navbar {
        padding: 15px 20px;
      }

      .navbar p {
        display: none;
      }

      .hero {
        padding: 28px 22px;
      }

      .hero h2 {
        font-size: 26px;
      }

      .stats {
        grid-template-columns: 1fr;
      }

      .add-skill-form {
        grid-template-columns: 1fr;
      }

      .add-skill-form button {
        grid-column: auto;
      }

      .skills-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>

<body>

  <!-- NAVBAR -->

  <nav class="navbar">
    <h1>🎓 Student Skill Exchange</h1>
    <p>Learn • Teach • Connect</p>
  </nav>

  <main class="container">

    <!-- HERO -->

    <section class="hero">
      <h2>Share Skills. Learn Together. 🚀</h2>

      <p>
        Student Skill Exchange is a platform where students can
        share their skills and connect with other students who want
        to learn.
      </p>

      <div class="hero-buttons">
        <a href="#skills" class="hero-button">
          Explore Skills
        </a>

        <a href="#add-skill" class="hero-button">
          Offer a Skill
        </a>
      </div>
    </section>

    <!-- STATISTICS -->

    <section class="stats">

      <div class="stat-card">
        <div class="stat-icon">💡</div>
        <h3>${skills.length}</h3>
        <p>Skills Available</p>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <h3>${new Set(skills.map((skill) => skill.category)).size}</h3>
        <p>Skill Categories</p>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📩</div>
        <h3>${requests.length}</h3>
        <p>Learning Requests</p>
      </div>

    </section>

    <!-- AVAILABLE SKILLS -->

    <section class="section" id="skills">

           <div class="section-header">
        <h2>🌟 Available Skills</h2>

        <p>
          Explore skills offered by fellow students and send a
          learning request.
        </p>
      </div>

      <form method="GET" action="/" class="search-box">

        <input
          type="text"
          name="search"
          placeholder="🔍 Search skill..."
          value="${search}"
        >

        <select name="category">

          <option value="">All Categories</option>

          ${[...new Set(skills.map((skill) => skill.category))]
            .map((cat) => `
              <option
                value="${cat}"
                ${category === cat ? 'selected' : ''}
              >
                ${cat}
              </option>
            `)
            .join('')}

        </select>

        <select name="level">

          <option value="">All Levels</option>

          <option
            value="Beginner"
            ${level === 'Beginner' ? 'selected' : ''}
          >
            Beginner
          </option>

          <option
            value="Intermediate"
            ${level === 'Intermediate' ? 'selected' : ''}
          >
            Intermediate
          </option>

          <option
            value="Advanced"
            ${level === 'Advanced' ? 'selected' : ''}
          >
            Advanced
          </option>

        </select>

        <button type="submit">
          🔍 Search
        </button>

      </form>

      <div class="skills-grid">

        ${skillCards}

      </div>

    </section>

    <!-- ADD SKILL -->

    <section class="section" id="add-skill">

      <div class="section-header">
        <h2>➕ Offer Your Skill</h2>

        <p>
          Share something you know and help another student learn.
        </p>
      </div>

      <form method="POST" action="/skills" class="add-skill-form">

        <input
          type="text"
          name="name"
          placeholder="Skill name (e.g. Python)"
          required
        >

        <input
          type="text"
          name="category"
          placeholder="Category (e.g. Programming)"
          required
        >

        <input
          type="text"
          name="owner"
          placeholder="Your name"
          required
        >

        <select name="level" required>
          <option value="">Select skill level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <input
          type="text"
          name="availability"
          placeholder="Availability (e.g. Weekends)"
          required
        >

        <button type="submit">
          ➕ Add Skill
        </button>

      </form>

    </section>

    <!-- LEARNING REQUESTS -->

    <section class="section">

      <div class="section-header">
        <h2>📋 Learning Requests</h2>

        <p>
          Recent requests submitted by students.
        </p>
      </div>

      <div class="table-wrapper">

        <table>

          <thead>
            <tr>
              <th>Student</th>
              <th>Skill</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            ${requestRows}

          </tbody>

        </table>

      </div>

    </section>

  </main>

  <!-- FOOTER -->

  <footer class="commit">

    Student Skill Exchange • MIT-WPU

    <br>

    Running commit:
    <span>
      ${process.env.RENDER_GIT_COMMIT || 'local'}
    </span>

  </footer>

</body>
</html>
  `);
});


// --------------------------------------------------
// ADD NEW SKILL
// --------------------------------------------------

app.post('/skills', (req, res) => {

  const {
    name,
    category,
    owner,
    level,
    availability
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !category ||
    !owner ||
    !level ||
    !availability
  ) {
    return res.status(400).send(
      'All skill fields are required'
    );
  }

  const newSkill = {
    id: nextSkillId++,
    name: name.trim(),
    category: category.trim(),
    owner: owner.trim(),
    level: level.trim(),
    availability: availability.trim()
  };

  skills.push(newSkill);

  return res.redirect('/');
});

// --------------------------------------------------
// CREATE LEARNING REQUEST
// --------------------------------------------------

app.post('/requests', (req, res) => {

  const {
    skillId,
    studentName,
    message
  } = req.body;

  const skill = skills.find(
    (item) => item.id === Number(skillId)
  );

  if (!skill || !studentName || !message) {
    return res.status(400).send(
      'Valid skill, student name and message are required'
    );
  }

  const newRequest = {
    id: nextRequestId++,
    skillId: skill.id,
    skillName: skill.name,
    studentName: studentName.trim(),
    message: message.trim(),
    status: 'Pending'
  };

  requests.push(newRequest);

  return res.redirect('/');
});


// --------------------------------------------------
// UPDATE REQUEST STATUS
// --------------------------------------------------

app.post('/requests/:id/status', (req, res) => {

  const requestId = Number(req.params.id);

  const {
    status
  } = req.body;

  const allowedStatuses = [
    'Pending',
    'Accepted',
    'Rejected',
    'Completed'
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).send(
      'Invalid request status'
    );
  }

  const request = requests.find(
    (item) => item.id === requestId
  );

  if (!request) {
    return res.status(404).send(
      'Learning request not found'
    );
  }

  request.status = status;

  return res.redirect('/');
});


// --------------------------------------------------
// API - SKILLS
// --------------------------------------------------

app.get('/api/skills', (req, res) => {
  res.json(skills);
});


// --------------------------------------------------
// API - REQUESTS
// --------------------------------------------------

app.get('/api/requests', (req, res) => {
  res.json(requests);
});


// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get('/health', (req, res) => {

  res.json({
    status: 'ok'
  });

});


// --------------------------------------------------
// EXPORT
// --------------------------------------------------

module.exports = {
  app,
  skills,
  requests
};