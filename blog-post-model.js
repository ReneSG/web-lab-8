let mongoose = require('mongoose');
let uuid = require('uuid')

mongoose.Promise = global.Promise;

let postSchema = mongoose.Schema({
	id : {
			type : Number,
			required : true },
	title : { type : String },
	content : { type : String },
	author : { type : String },
	publishDate : { type : String },
});

let Post = mongoose.model( 'Post', postSchema );

let PostList = {
	get : function(){
		return Post.find()
				.then( students => {
					return students;
				})
				.catch( error => {
					throw Error( error );
				});
	},
	getByID : function(id){
		return Post.findOne({id : id})
			.then(student => {
				return student;
			})
			.catch( error => {
				throw Error( error );
			});

	},
	delete: function(id){
		return PostList.getByID(id)
			.then(post => {
				if (post){
					return Post.remove({id : id})
						.then( response => {
							return response;
						})
						.catch(error => {
							throw Error(error);
						});
				}
				else{
					throw Error( "404" );
				}
			})
			.catch( error => {
				throw Error(error);
			});	},
	post : function( newPost){
		return Post.create( newPost )
				.then( student => {
					return student;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	put : function(newPost){
		return PostList.getByID(newPost.id)
			.then( post => {
				if ( post ){
					return Post.findOneAndUpdate( {id : newPost.id}, {$set : newPost}, {new : true})
						.then( newPost => {
							return newPost;
						})
						.catch(error => {
							throw Error(error);
						});
				}
				else{
					throw Error( "404" );
				}
			})
			.catch( error => {
				throw Error(error);
			});
	}
};

module.exports = { PostList };
