const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();

  repositories.push({ id, title, url, techs, likes: 0 });
  return response.json({ id, title, url, techs, likes: 0 });
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const projectIndex = repositories.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return response.status(400).json({ error: "repository wasn't found" });
  }

  title ? (repositories[projectIndex].title = title) : title;
  url ? (repositories[projectIndex].url = url) : url;
  techs ? (repositories[projectIndex].techs = techs) : techs;

  return response.json(repositories[projectIndex]);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const projectIndex = repositories.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return res.status(400).json({ error: "repository wasn't found" });
  }

  repositories.splice(projectIndex, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return res.status(400).json({ error: "repository wasn't found" });
  }

  repositories[projectIndex].likes += 1;
  return response.json(repositories[projectIndex]);
});

module.exports = app;
