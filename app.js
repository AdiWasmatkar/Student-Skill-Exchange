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
  const search =
    typeof req.query.search === 'string'
      ? req.query.search.trim().toLowerCase()
      : '';

  const filteredSkills = skills.filter((skill) => {
    if (!search) {
      return true;
    }

    return (
      skill.name.toLowerCase().includes(search) ||
      skill.category.toLowerCase().includes(search) ||
      skill.owner.toLowerCase().includes(search)
    );
  });

  const skillCards = filteredSkills
    .map(
      (skill) => `
        <div class="skill-card">

          <div class="skill-icon">
            ${skill.name.charAt(0).toUpperCase()}
          </div>

          <div class="skill-category">
            ${skill.category}
          </div>

          <h3>${skill.name}</h3>

          <p class="skill-owner">
            👤 Offered by <strong>${skill.owner}</strong>
          </p>

          <div class="skill-tags">
            <span class="tag">📈 ${skill.level}</span>
            <span class="tag">🕒 ${skill.availability}</span>
          </div>

          <div class="request-section">

            <h4>Want to learn this?</h4>

            <form method="POST" action="/requests">

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
                placeholder="Why do you want to learn ${skill.name}?"
                required
              ></textarea>

              <button type="submit">
                Request Skill →
              </button>

            </form>

          </div>

        </div>
      `
    )
    .join('');

  const requestCards =
    requests.length === 0
      ? `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>No learning requests yet</h3>
          <p>
            When students request a skill, their requests will appear here.
          </p>
        </div>
      `
      : requests
          .map(
            (request) => `
              <div class="request-card">

                <div class="request-header">

                  <div>
                    <span class="request-label">
                      LEARNING REQUEST
                    </span>

                    <h3>${request.skillName}</h3>
                  </div>

                  <span class="status ${request.status.toLowerCase()}">
                    ${request.status}
                  </span>

                </div>

                <div class="request-details">

                  <div>
                    <span>Student</span>
                    <strong>👤 ${request.studentName}</strong>
                  </div>

                  <div>
                    <span>Message</span>
                    <strong>${request.message}</strong>
                  </div>

                </div>

                <form
                  method="POST"
                  action="/requests/${request.id}/status"
                  class="status-form"
                >

                  <select name="status">

                    <option
                      value="Pending"
                      ${request.status === 'Pending' ? 'selected' : ''}
                    >
                      Pending
                    </option>

                    <option
                      value="Accepted"
                      ${request.status === 'Accepted' ? 'selected' : ''}
                    >
                      Accepted
                    </option>

                    <option
                      value="Rejected"
                      ${request.status === 'Rejected' ? 'selected' : ''}
                    >
                      Rejected
                    </option>

                    <option
                      value="Completed"
                      ${request.status === 'Completed' ? 'selected' : ''}
                    >
                      Completed
                    </option>

                  </select>

                  <button type="submit">
                    Update Status
                  </button>

                </form>

              </div>
            `
          )
          .join('');

  res.send(`
<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Student Skill Exchange</title>

  <style>

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      background: #f6f7fb;

      color: #172033;

      line-height: 1.6;
    }

    /* ---------------- NAVBAR ---------------- */

    .navbar {
      height: 72px;

      display: flex;

      align-items: center;

      justify-content: space-between;

      max-width: 1180px;

      margin: auto;

      padding: 0 25px;
    }

    .brand {
      display: flex;

      align-items: center;

      gap: 10px;

      color: white;

      font-size: 20px;

      font-weight: 800;
    }

    .brand-icon {
      width: 38px;

      height: 38px;

      display: flex;

      align-items: center;

      justify-content: center;

      background: rgba(255,255,255,0.15);

      border-radius: 11px;

      font-size: 20px;
    }

    .nav-pill {
      padding: 8px 15px;

      border-radius: 999px;

      background: rgba(255,255,255,0.13);

      border: 1px solid rgba(255,255,255,0.2);

      color: white;

      font-size: 13px;

      font-weight: 600;
    }

    /* ---------------- HERO ---------------- */

    .hero {
      background:
        radial-gradient(
          circle at top right,
          rgba(255,255,255,0.18),
          transparent 35%
        ),
        linear-gradient(
          135deg,
          #4338ca,
          #6366f1 55%,
          #7c3aed
        );

      color: white;

      padding-bottom: 105px;
    }

    .hero-content {
      max-width: 1180px;

      margin: auto;

      padding: 55px 25px 0;
    }

    .hero-content h1 {
      max-width: 780px;

      font-size: clamp(42px, 6vw, 68px);

      line-height: 1.05;

      letter-spacing: -3px;

      margin-bottom: 22px;
    }

    .hero-content p {
      max-width: 650px;

      font-size: 19px;

      color: rgba(255,255,255,0.84);
    }

    .hero-stats {
      display: flex;

      gap: 15px;

      margin-top: 32px;

      flex-wrap: wrap;
    }

    .hero-stat {
      padding: 10px 16px;

      border-radius: 12px;

      background: rgba(255,255,255,0.12);

      border: 1px solid rgba(255,255,255,0.18);

      font-size: 14px;
    }

    /* ---------------- MAIN ---------------- */

    main {
      max-width: 1180px;

      margin: -55px auto 60px;

      padding: 0 25px;
    }

    .section {
      margin-bottom: 32px;
    }

    .section-card {
      background: white;

      border: 1px solid #e6e8f0;

      border-radius: 22px;

      padding: 28px;

      box-shadow:
        0 15px 45px rgba(30, 41, 59, 0.07);
    }

    .section-heading {
      margin-bottom: 22px;
    }

    .section-heading h2 {
      font-size: 26px;

      letter-spacing: -0.7px;
    }

    .section-heading p {
      margin-top: 4px;

      color: #6b7280;

      font-size: 14px;
    }

    /* ---------------- SEARCH ---------------- */

    .search-container {
      display: flex;

      gap: 10px;
    }

    .search-container input {
      flex: 1;
    }

    /* ---------------- INPUTS ---------------- */

    input,
    textarea,
    select {
      width: 100%;

      border: 1px solid #dcdfea;

      border-radius: 12px;

      padding: 12px 14px;

      font-family: inherit;

      font-size: 14px;

      color: #172033;

      background: white;

      outline: none;

      transition: 0.2s;
    }

    input:focus,
    textarea:focus,
    select:focus {
      border-color: #6366f1;

      box-shadow:
        0 0 0 4px rgba(99,102,241,0.12);
    }

    textarea {
      min-height: 90px;

      resize: vertical;
    }

    button {
      border: none;

      border-radius: 11px;

      padding: 12px 18px;

      background: #4f46e5;

      color: white;

      font-family: inherit;

      font-weight: 700;

      cursor: pointer;

      transition: 0.2s;
    }

    button:hover {
      background: #4338ca;

      transform: translateY(-1px);
    }

    /* ---------------- OFFER FORM ---------------- */

    .offer-grid {
      display: grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      gap: 16px;
    }

    .form-field {
      display: flex;

      flex-direction: column;

      gap: 7px;
    }

    .form-field label {
      font-size: 13px;

      font-weight: 700;

      color: #374151;
    }

    .form-full {
      grid-column: 1 / -1;
    }

    .offer-button {
      margin-top: 5px;
    }

    /* ---------------- SKILLS ---------------- */

    .skills-grid {
      display: grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      gap: 20px;
    }

    .skill-card {
      background: white;

      border: 1px solid #e5e7eb;

      border-radius: 20px;

      padding: 23px;

      transition: 0.25s;

      box-shadow:
        0 8px 25px rgba(15,23,42,0.04);
    }

    .skill-card:hover {
      transform: translateY(-5px);

      box-shadow:
        0 18px 38px rgba(15,23,42,0.1);

      border-color: #c7d2fe;
    }

    .skill-icon {
      width: 48px;

      height: 48px;

      display: flex;

      align-items: center;

      justify-content: center;

      border-radius: 14px;

      background: #eef2ff;

      color: #4f46e5;

      font-size: 21px;

      font-weight: 800;

      margin-bottom: 15px;
    }

    .skill-category {
      color: #6366f1;

      font-size: 12px;

      font-weight: 800;

      text-transform: uppercase;

      letter-spacing: 0.8px;
    }

    .skill-card h3 {
      font-size: 23px;

      margin: 3px 0 5px;

      letter-spacing: -0.5px;
    }

    .skill-owner {
      color: #6b7280;

      font-size: 14px;
    }

    .skill-tags {
      display: flex;

      flex-wrap: wrap;

      gap: 8px;

      margin: 16px 0;
    }

    .tag {
      background: #f1f5f9;

      color: #475569;

      padding: 5px 10px;

      border-radius: 999px;

      font-size: 12px;

      font-weight: 700;
    }

    .request-section {
      border-top: 1px solid #edf0f5;

      padding-top: 18px;

      margin-top: 18px;
    }

    .request-section h4 {
      margin-bottom: 12px;

      font-size: 15px;
    }

    .request-section form {
      display: flex;

      flex-direction: column;

      gap: 10px;
    }

    /* ---------------- REQUESTS ---------------- */

    .requests-list {
      display: grid;

      gap: 15px;
    }

    .request-card {
      border: 1px solid #e5e7eb;

      border-radius: 17px;

      padding: 20px;

      background: #fafbff;
    }

    .request-header {
      display: flex;

      justify-content: space-between;

      align-items: flex-start;

      gap: 15px;
    }

    .request-label {
      font-size: 10px;

      font-weight: 800;

      letter-spacing: 1px;

      color: #6366f1;
    }

    .request-card h3 {
      font-size: 20px;

      margin-top: 3px;
    }

    .status {
      padding: 6px 12px;

      border-radius: 999px;

      font-size: 11px;

      font-weight: 800;
    }

    .status.pending {
      background: #fff7ed;

      color: #c2410c;
    }

    .status.accepted {
      background: #ecfdf5;

      color: #047857;
    }

    .status.rejected {
      background: #fef2f2;

      color: #b91c1c;
    }

    .status.completed {
      background: #eff6ff;

      color: #1d4ed8;
    }

    .request-details {
      display: grid;

      grid-template-columns:
        180px 1fr;

      gap: 15px;

      margin: 18px 0;
    }

    .request-details div {
      display: flex;

      flex-direction: column;

      gap: 3px;
    }

    .request-details span {
      font-size: 11px;

      color: #9ca3af;

      text-transform: uppercase;

      font-weight: 800;

      letter-spacing: 0.5px;
    }

    .request-details strong {
      font-size: 14px;

      font-weight: 600;
    }

    .status-form {
      display: flex;

      gap: 10px;

      max-width: 400px;
    }

    /* ---------------- EMPTY ---------------- */

    .empty-state {
      text-align: center;

      padding: 45px 20px;

      border: 1px dashed #d8dce7;

      border-radius: 17px;

      color: #6b7280;
    }

    .empty-icon {
      font-size: 38px;

      margin-bottom: 8px;
    }

    .empty-state h3 {
      color: #374151;

      margin-bottom: 5px;
    }

    /* ---------------- FOOTER ---------------- */

    footer {
      text-align: center;

      color: #6b7280;

      font-size: 13px;

      padding: 30px 20px 45px;
    }

    .footer-title {
      font-weight: 700;

      color: #374151;

      margin-bottom: 4px;
    }

    .commit {
      font-family: monospace;

      color: #6366f1;

      margin-top: 5px;
    }

    /* ---------------- RESPONSIVE ---------------- */

    @media (max-width: 800px) {

      .skills-grid {
        grid-template-columns: 1fr;
      }

      .offer-grid {
        grid-template-columns: 1fr;
      }

      .form-full {
        grid-column: auto;
      }

      .request-details {
        grid-template-columns: 1fr;
      }

    }

    @media (max-width: 600px) {

      .navbar {
        padding: 0 18px;
      }

      .hero-content {
        padding-left: 20px;

        padding-right: 20px;
      }

      .hero-content h1 {
        font-size: 42px;

        letter-spacing: -2px;
      }

      main {
        padding: 0 15px;
      }

      .section-card {
        padding: 20px;
      }

      .search-container {
        flex-direction: column;
      }

      .request-header {
        flex-direction: column;
      }

      .status-form {
        flex-direction: column;
      }

    }

  </style>

</head>

<body>

  <!-- ================= HERO ================= -->

  <header class="hero">

    <nav class="navbar">

      <div class="brand">

        <div class="brand-icon">
          🎓
        </div>

        Student Skill Exchange

      </div>

      <div class="nav-pill">
        Student Community
      </div>

    </nav>

    <div class="hero-content">

      <h1>
        Share skills.<br>
        Learn together.
      </h1>

      <p>
        A student-powered platform where you can
        share what you know, discover new skills,
        and connect with students who want to learn.
      </p>

      <div class="hero-stats">

        <div class="hero-stat">
          🎯 Peer Learning
        </div>

        <div class="hero-stat">
          🤝 Skill Exchange
        </div>

        <div class="hero-stat">
          🚀 Grow Together
        </div>

      </div>

    </div>

  </header>


  <!-- ================= MAIN ================= -->

  <main>


    <!-- SEARCH -->

    <section class="section">

      <div class="section-card">

        <div class="section-heading">

          <h2>
            🔎 Find a Skill
          </h2>

          <p>
            Search by skill, category, or student.
          </p>

        </div>

        <form
          method="GET"
          action="/"
          class="search-container"
        >

          <input
            type="text"
            name="search"
            placeholder="Try Python, Design, Programming..."
            value="${search}"
          >

          <button type="submit">
            Search
          </button>

          <a
            href="/"
            style="
              display:flex;
              align-items:center;
              padding:0 12px;
              color:#6366f1;
              text-decoration:none;
              font-weight:700;
            "
          >
            Clear
          </a>

        </form>

      </div>

    </section>


    <!-- OFFER SKILL -->

    <section class="section">

      <div class="section-card">

        <div class="section-heading">

          <h2>
            ✨ Offer Your Skill
          </h2>

          <p>
            Share something you're good at and help another student learn.
          </p>

        </div>

        <form
          method="POST"
          action="/skills"
          class="offer-grid"
        >

          <div class="form-field">

            <label>
              Skill Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="e.g. Python"
              required
            >

          </div>


          <div class="form-field">

            <label>
              Category
            </label>

            <input
              type="text"
              name="category"
              placeholder="e.g. Programming"
              required
            >

          </div>


          <div class="form-field">

            <label>
              Your Name
            </label>

            <input
              type="text"
              name="owner"
              placeholder="e.g. Aditya"
              required
            >

          </div>


          <div class="form-field">

            <label>
              Skill Level
            </label>

            <select
              name="level"
              required
            >

              <option value="">
                Select level
              </option>

              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>

            </select>

          </div>


          <div class="form-field form-full">

            <label>
              Availability
            </label>

            <input
              type="text"
              name="availability"
              placeholder="e.g. Weekends / Evenings"
              required
            >

          </div>


          <div class="form-field form-full">

            <button
              type="submit"
              class="offer-button"
            >
              + Add My Skill
            </button>

          </div>

        </form>

      </div>

    </section>


    <!-- AVAILABLE SKILLS -->

    <section class="section">

      <div class="section-heading">

        <h2>
          🌟 Available Skills
        </h2>

        <p>
          Discover students who are ready to share their knowledge.
        </p>

      </div>

      ${
        skillCards
          ? `<div class="skills-grid">${skillCards}</div>`
          : `
            <div class="empty-state">
              <div class="empty-icon">🔍</div>

              <h3>
                No matching skills found
              </h3>

              <p>
                Try searching for another skill or category.
              </p>
            </div>
          `
      }

    </section>


    <!-- LEARNING REQUESTS -->

    <section class="section">

      <div class="section-heading">

        <h2>
          📚 Learning Requests
        </h2>

        <p>
          Track and manage student learning requests.
        </p>

      </div>

      <div class="requests-list">

        ${requestCards}

      </div>

    </section>


  </main>


  <!-- ================= FOOTER ================= -->

  <footer>

    <div class="footer-title">
      🎓 Student Skill Exchange
    </div>

    <div>
      Built for Cloud Computing & DevOps CCA 2
    </div>

    <div class="commit">
      Running commit:
      ${process.env.RENDER_GIT_COMMIT || 'local'}
    </div>

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
    level,
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