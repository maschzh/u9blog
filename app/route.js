var User = require('./models/user');
var Post = require('./models/post');
var Suggest = require('./models/suggest');

var crypto =require('crypto');

module.exports= function(app){
	//设置User的CRUD
	app.get('/u9blog/users', function(req, res){
		User.find(function(err, users){
			if(err){
				res.send(err);
			}
			res.json(users);
		});
	})
	//获取个人信息
	.get('/u9blog/user/:userid', function(req, res){
		User.findById(req.params.userid, function(err, user){
			if(err){
				res.send(err);
			}
			 res.json(user);
		});
	})
	//注册
	.post('/u9blog/user-register', function(req, res){
		//检查用户和密码
		if((req.body.name && req.body.name.trim().length==0) || 
		   (req.body.password && req.body.password.trim().length==0)){
			res.json({ErrMessage:'User name is null, please enter your name or password!'});
			return;
		}

		if(req.body.password != req.body.passwordrepeat){
			res.json({ErrMessage:'User password is not equal password-repeat!'});
			return;
		}

		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		var user = new User();
		user.name = req.body.name;
		user.email = req.body.email;
		user.password =password;
		user.lastLogin = Date.now();

		user.findByName(user.name, function(err, dbUser){
			if(err){
				res.send(err);
			}

			if(dbUser){
				return res.json({ErrMessage:'User name is exists, please change it!'});
			}

			user.save(function(err, doc){
				if(err){
					res.send(err);
				}
				req.session.user ={
					"name":doc.name,
					"email":doc.email,
					"id" :doc.id
				}
				req.session.loggedIn=true;
				return res.json({SucMessage:'register successfully!'});
			});
		});
	})
	//登录
	.post('/u9blog/user-login', function(req, res){
		if(req.body.name.trim().length ===0 || req.body.password.trim().length==0){
			return res.json({ErrMessage:'nama and password can not null'});
		}

		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		User.findByName(req.body.name, password, function(err, user){
			if(err){
				return res.send(err);
			}
			if(user){
				req.session.user ={
					"name":user.name,
					"email":user.email,
					"id" :user.id
				};
				req.session.loggedIn=true;
				return res.json(user);
			} else {
				return res.json({ErrMessage : 'user name or password is not correct, please enter them again'});
			}
		});
	})
	//完善个人信息
	.put('/u9blog/user-info/:userid', function(req, res){
		User.findById(req.params.userid, function(err, user){
			if(err){
				res.send(err);
			}

			if(req.body.nickname){
				user.nickname = req.body.nickname;
			}
			if(req.body.telephone){
				user.telephone = req.body.telephone;
			}
			if(req.body.birthday){
				user.birthday = req.body.birthday;
			}
			if(req.body.age){
				user.age = req.body.age;
			}
			if(req.body.sex){
				user.sex = req.body.sex;
			}
			if(req.body.address){
				user.address=req.body.address;
			}

			user.save(function(err){
				if(err){
					res.send(err);
				}
				return res.json({SucMessage:'update user info successfully!'});
			});
		});
	})
	//修改密码
	.put('/u9blog/user-password/:userid', function(req, res){
		if(!req.body.password || !req.body.newpassword){
			res.send({ErrMessage : 'password cannot null'})
		}
		var md5 = crypto.createHash('md5');
		var md5new = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		var newpassword = md5new.update(req.body.newpassword).digest('base64');
		User.findByIdPsd(req.params.userid, password, function(err, user){
			if(err){
				res.send(err);
			}
			user.password = newpassword;
			user.save(function(err){
				if(err){
					res.send(err);
				}
				return res.json({SucMessage:'update password successfully!'});
			});
		});
	});

	//设置Post的CRUD
	//获取Post列表
	app.get('/u9blog/posts', function(req, res){
		Post.find(null, null, {sort: {createTime : -1}},function(err, posts){
			if(err){
				res.send(err);
			}
			return res.json(posts);
		});
	})
	//获取Post详细信息
	.get('/u9blog/post/:postid', function(req, res){
		Post.findById(req.params.postid, function(err, post){
			if(err){
				res.send(err);
			}
			return res.json(post);
		});
	})
	//添加Post
	.post('/u9blog/post', function(req, res){
		if(req.body.name.length ==0 || req.body.content.length==0){
			return res.json({ErrMessage:'post name or content can not empty'});
		}
		var post =new Post();
		post.name = req.body.name;
		post.title = req.body.title;
		post.head = req.body.head;
		post.tags= req.body.tags;
		post.content = req.body.content;
		post.createTime = Date.now();
		post.modifyTime = Date.now();
		post.user = req.body.user;
		post.save(function(err){
			if(err){
				res.send(err);
			}
			return res.json({SucMessage:'Create post success'});
		});
	})
	//更新Post
	.put('/u9blog/post/:postid', function(req, res){
		Post.findById(req.params.postid, function(err, post){
			if(err){
				res.send(err);
			}
			if(req.body.name && req.body.name.trim().length !==0 && post.name != req.body.name){
				post.name = req.body.name;
			}
			if(req.body.head && req.body.head.trim().length !==0 && post.head != req.body.head){
				post.head = req.body.head;
			}
			if(req.body.title && req.body.title.trim().length !==0 && post.title != req.body.title){
				post.title = req.body.title;
			}
			if(req.body.tags && req.body.tags.trim().length !==0 && post.tags != req.body.tags){
				post.tags = req.body.tags;
			}
			if(req.body.content && req.body.content.trim().length !==0 && post.content != req.body.content){
				post.content = req.body.content;
			}
			
			post.modifyTime = Date.now();

			post.save(function(err){
				if(err){
					res.send(err);
				}
				return res.json({SucMessage:'update post successfully'});
			});
		});
	})
	//评论
	.put('/u9blog/post/comment/:postid', function(req, res){
		Post.findById(req.params.postid, function(err, post){
			if(err){
				res.send(err);
			}
			var newComment={
				user: {
					name : '',
					id : '',
					email: ''
				},
			};
			User.findById(req.body.user, function(err, doc){
				if(err){
					res.send(err);
				}
				
				newComment.user.name = doc.name;
				newComment.user.id = doc.id;
				newComment.user.email = doc.email;
				console.log(newComment.user);

				if(req.body.comment && req.body.comment.trim().length!==0){
					newComment.comment = req.body.comment;
					newComment.time = Date.now();
				}
				post.comments.push(newComment);

				post.save(function(err){
					if(err){
						res.send(err);
					}

					return res.json({SucMessage:'Comment is successfully'});
				});
			});
		});
	})
	//删除Post
	.delete('/u9blog/post/:postid', function(req, res){
		Post.remove({_id: req.params.postid}, function(err, post){
			if(err){
				res.send(err);
			}
			return res.json({SucMessage:'Delete successfully'});
		});
	});

	//设置反馈意见
	app.get('/u9blog/feedbacks', function(req, res){
		Suggest.find(function(err, suggests){
			if(err){
				res.send(err);
			}

			return res.json(suggests);
		});
	})
	.post('/u9blog/feedback', function(req, res){
		User.findById(req.body.user, function(err, user){
			if(err){
				res.send(err);
			}

			if(user){
				if(req.body.message == 0){
					return;
				}
				user.password ='';
				var suggest = new Suggest();
				suggest.message = req.body.message;
				suggest.createTime = Date.now();
				suggest.user = user;
				suggest.save(function(err){
					if(err){
						res.send(err);
					}
					return res.json({SucMessage: 'Create suggest success!'});
				});
			} else {
				return;
			}
		});
		
	});
}