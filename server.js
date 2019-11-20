let express = require("express")
let Morgan = require("morgan")
let app = express()
let uuid = require('uuid')
let cors = require('cors')
let mongoose = require( "mongoose" );
let { PostList } = require('./blog-post-model');
let { DATABASE_URL, PORT } = require('./config');

var bodyParser = require('body-parser')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(Morgan("dev"))

app.get("/blog-posts", (req, res, next) => {
  PostList.get()
    .then(posts => {
      return res.status(200).json(posts);
    }).catch( er => {
      throw Error(er)
    });
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
  const id = req.body.id;
  PostList.post({id: id, title: title, content: content, author: author, publishDate: publishDate})
    .then(newPost => {
      res.status(201).json(newPost);
    }).catch(er => {
      throw Error(er);
      res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
      });
    });
});

app.delete("/blog-posts/:id", (req, res) => {
  PostList.delete(req.params.id)
    .then(response => {
      return res.status(200).json({});
    })
    .catch(error => {
      res.status(404).json({error: "Post no existe"});
    });
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

  newPost = {id: id}

  if (author) {
    newPost.author = author;
  }

  if (title) {
    newPost.title = title;
  }

  if (content) {
    newPost.content = content;
  }

  if (publishDate) {
    newPost.publishDate = publishDate;
  }

  PostList.put(newPost)
    .then(response => {
      return res.status(202).json({});
    })
    .catch(er => {
      throw Error(er)
      return res.status(500).json({error: "Error en la db"});
    })
});

let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = {app, runServer, closeServer}

