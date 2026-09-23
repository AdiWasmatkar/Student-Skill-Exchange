const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const {
  app,
  skills,
  requests
} = require('../app');

let server;
let baseUrl;

beforeEach(() => {
  // Keep the original two sample skills
  skills.splice(2);

  // Clear previous learning requests
  requests.splice(0);

  server = app.listen(0);

  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(() => {
  server.close();
});

test('GET /health returns status ok', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);

  const data = await response.json();

  assert.equal(data.status, 'broken');
});

test('POST /skills adds a valid skill', async () => {
  const response = await fetch(`${baseUrl}/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      name: 'Java',
      category: 'Programming',
      owner: 'Aditya',
      level: 'Intermediate',
      availability: 'Weekends'
    }),
    redirect: 'manual'
  });

  assert.equal(response.status, 302);

  const addedSkill = skills.find(
    (skill) => skill.name === 'Java'
  );

  assert.ok(addedSkill);
  assert.equal(addedSkill.owner, 'Aditya');
});

test('POST /skills rejects invalid input', async () => {
  const response = await fetch(`${baseUrl}/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      name: '',
      category: 'Programming',
      owner: 'Aditya',
      level: 'Beginner',
      availability: 'Weekends'
    })
  });

  assert.equal(response.status, 400);
});

test('POST /requests creates a learning request', async () => {
  const response = await fetch(`${baseUrl}/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      skillId: '1',
      studentName: 'Aditya',
      message: 'I want to learn Python.'
    }),
    redirect: 'manual'
  });

  assert.equal(response.status, 302);

  assert.equal(requests.length, 1);
  assert.equal(requests[0].skillName, 'Python');
  assert.equal(requests[0].studentName, 'Aditya');
  assert.equal(requests[0].status, 'Pending');
});

test('POST /requests rejects an invalid skill', async () => {
  const response = await fetch(`${baseUrl}/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      skillId: '9999',
      studentName: 'Aditya',
      message: 'I want to learn this skill.'
    })
  });

  assert.equal(response.status, 400);
});

test('GET /api/skills returns JSON skills', async () => {
  const response = await fetch(`${baseUrl}/api/skills`);

  assert.equal(response.status, 200);

  const data = await response.json();

  assert.ok(Array.isArray(data));
  assert.equal(data.length, 2);
});