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

// Home page
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
      <div>
        <h2>${skill.name}</h2>

        <p>
          Category: ${skill.category}
        </p>

        <p>
          Offered by: ${skill.owner}
        </p>

        <p>
          Level: ${skill.level}
        </p>

        <p>
          Availability: ${skill.availability}
        </p>

        <h3>Request this skill</h3>

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

          <br><br>

          <textarea
            name="message"
            placeholder="Why do you want to learn this skill?"
            required
          ></textarea>

          <br><br>

          <button type="submit">
            Request Skill
          </button>

        </form>

        <hr>
      </div>
    `
  )
  .join('');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student Skill Exchange</title>
    </head>

    <body>

      <h1>🎓 Student Skill Exchange</h1>

      <p>
        Share what you know. Learn what you need.
      </p>

      <hr>

      <h2>Offer a Skill</h2>

      <form method="POST" action="/skills">

        <label>Skill Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Example: Python"
          required
        >

        <br><br>

        <label>Category:</label>
        <input
          type="text"
          name="category"
          placeholder="Example: Programming"
          required
        >

        <br><br>

        <label>Your Name:</label>
        <input
          type="text"
          name="owner"
          placeholder="Your name"
          required
        >

        <br><br>

        <label>Skill Level:</label>

        <select name="level" required>
          <option value="">Select level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <br><br>

        <label>Availability:</label>
        <input
          type="text"
          name="availability"
          placeholder="Example: Weekends"
          required
        >

        <br><br>

        <button type="submit">
          Add Skill
        </button>

      </form>

      <hr>

      <h2>Search Skills</h2>

      <form method="GET" action="/">

        <input
          type="text"
          name="search"
          placeholder="Search Python, Design, Aditya..."
          value="${search}"
        >

        <button type="submit">
          Search
        </button>

        <a href="/">
          Clear
        </a>

      </form>

      <hr>

      <h2>Available Skills</h2>

      ${
        skillCards ||
        '<p>No matching skills found.</p>'
      }

      <hr>

<h2>Learning Requests</h2>

${
  requests.length === 0
    ? '<p>No learning requests yet.</p>'
    : requests
        .map(
          (request) => `
            <div>
              <h3>${request.skillName}</h3>

              <p>
                Student:
                ${request.studentName}
              </p>

              <p>
                Message:
                ${request.message}
              </p>

              <p>
                Status:
                <strong>${request.status}</strong>
              </p>
                <form method="POST" action="/requests/${request.id}/status">

  <select name="status">
    <option value="Pending" ${
      request.status === 'Pending' ? 'selected' : ''
    }>
      Pending
    </option>

    <option value="Accepted" ${
      request.status === 'Accepted' ? 'selected' : ''
    }>
      Accepted
    </option>

    <option value="Rejected" ${
      request.status === 'Rejected' ? 'selected' : ''
    }>
      Rejected
    </option>

    <option value="Completed" ${
      request.status === 'Completed' ? 'selected' : ''
    }>
      Completed
    </option>
  </select>

  <button type="submit">
    Update Status
  </button>

</form>
              <hr>
            </div>
          `
        )
        .join('')
}
    </body>
    </html>
  `);
});

// Add a new skill
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

  res.redirect('/');
});

// Create a learning request
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

// Update learning request status
app.post('/requests/:id/status', (req, res) => {
  const requestId = Number(req.params.id);
  const { status } = req.body;

  const allowedStatuses = [
    'Pending',
    'Accepted',
    'Rejected',
    'Completed'
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).send('Invalid request status');
  }

  const request = requests.find(
    (item) => item.id === requestId
  );

  if (!request) {
    return res.status(404).send('Learning request not found');
  }

  request.status = status;

  return res.redirect('/');
});

// JSON API
app.get('/api/skills', (req, res) => {
  res.json(skills);
});

// JSON API - learning requests
app.get('/api/requests', (req, res) => {
  res.json(requests);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok'
  });
});

module.exports = {
  app,
  skills,
  requests
};