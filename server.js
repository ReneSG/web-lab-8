let express = require("express")
let Morgan = require("Morgan")
let app = express()
let uuid = require('uuid')
let cors = require('cors')
var bodyParser = require('body-parser')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(Morgan("dev"))

let allPosts = [
  {
    id: uuid.v4(),
    title: "Titulo 1",
    content: "Contenido 1",
    author: "Autor 1",
    publishDate: Date.now(),
  },
  {
    id: uuid.v4(),
    title: "Titulo 2",
    content: "Contenido 2",
    author: "Autor 2",
    publishDate: Date.now(),
  },
  {
    id: uuid.v4(),
    title: "Titulo 3",
    content: "Contenido 3",
    author: "Autor 3",
    publishDate: Date.now(),
  },
  {
    id: uuid.v4(),
    title: "Titulo 4",
    content: "Contenido 4",
    author: "Autor 4",
    publishDate: Date.now(),
  },
];

app.get("/blog-posts", (req, res, next) => {
  res.status(200).json(allPosts);
});

app.get("/blog-post", (req, res, next) => {
  if (req.query.author == "" || req.query.author == undefined) {
    res.status(406).json({error: "Se tiene que proporcionar un autor"});
    return;
  }

  posts = allPosts.filter(function(el) {
    return el.author == req.query.author;
  });

  if (posts.length == 0) {
    res.status(404).json({error: "Autor no encontrado"});
    return;
  }
  res.status(200).json(posts)
});

app.post("/blog-posts", (req, res) => {
  const author = req.body.author;
  const title = req.body.title;
  const content = req.body.content;
  const publishDate = req.body.publishDate;
  const id = uuid.v4();
  allPosts.push({id: id, title: title, content: content, author: author, publishDate: publishDate});
  res.status(201).json({});
});

app.delete("/blog-posts/:id", (req, res) => {
  const newPosts = allPosts.filter((el) => {
    return el.id != req.params.id;
  })

  if (newPosts.length == allPosts.length) {
    res.status(404).json({error: "Post no existe"});
  }
  allPosts = newPosts;
  res.status(200).json({});
});

app.put("/blog-posts/:id", (req, res) => {
  const author = req.body.author;
  const id = req.body.id;
  const title = req.body.title;
  const content = req.body.content;
  const publishDate = req.body.publishDate;

  if (id == "" || id == undefined) {
    res.status(406).json({error: "No se proporcionó un id"});
    return;
  }

  if (id != req.params.id) {
    res.status(409).json({error: "Los id no hacen match"});
    return;
  }

  postIndex = allPosts.findIndex(el => el.id == req.params.id);

  if (author) {
    allPosts[postIndex].author = author;
  }

  if (title) {
    allPosts[postIndex].title = title;
  }

  if (content) {
    allPosts[postIndex].content = content;
  }

  if (publishDate) {
    allPosts[postIndex].publishDate = publishDate;
  }

  res.status(202).json({});
});

app.listen("8080", () => {
  console.log("Serving");
});
