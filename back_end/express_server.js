const fs = require('fs');
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const {MongoClient} = require('mongodb');
//const history = require('connect-history-api-fallback');
var bodyParser = require('body-parser');
var multer = require('multer');
var cheerio = require('cheerio');
var request = require('request');

var forms = multer();
const app = express();
app.use(bodyParser.json());
app.use(forms.array()); 
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(history());
const port = process.env.PORT || 1234;

let cafef_data = fs.readFileSync('cafef_url.json');
var cafef_url_crawl = JSON.parse(cafef_data);

if (fs.existsSync("./log_server")) {
    //
} else {
	fs.mkdirSync("./log_server");
    console.log("Create log server")
}

var color = {
	"reset": "\x1b[0m",
	"red": "\x1b[31m",
	"green": "\x1b[32m",
	"yellow": "\x1b[33m",
	"blue": "\x1b[34m",
	"magneta": "\x1b[35m",
	"cyan": "\x1b[36m",
	"white": "\x1b[37m"
}

function print_color(color_print, text) {
	console.log("%s%s%s", color_print, text, color.reset)
}

function atob(b64_data) {
	let buff = new Buffer.from(b64_data, 'base64');
	let text = buff.toString('ascii');
	return text
}

function btoa(string_data) {
	let buff = new Buffer.from(string_data);
	let text = buff.toString('base64');
	return text
}

async function crawl_data_real_time(hex_code, res){
	try {
		//console.log(cafef_url_crawl[hex_code])
		let data_out = {};

		await request(cafef_url_crawl[hex_code], function (error, response, html) {
		    if (!error && response.statusCode == 200) {
		    	try
		    	{
			    	let $ = cheerio.load(html);

			        close_now = $(".dltlu-point").text().trim()
			        vol_now = $("#CV").text().trim().replace(',', '').replace(/,/, '')
			        try{
			        	let all_data_crawl = $(".dltl-price").text().split("\n")
				    	for (i=0; i<=all_data_crawl.length; i++){
				    		let data_i = all_data_crawl[i].trim()
				    		if (data_i == "Giá mở cửa"){
				    			break
				    		}
				    	}
				    	open_now = all_data_crawl[i+1].trim()
			        }
			        catch(err)
			        {
			        	let all_data_crawl = $(".dtlu-price-detail").text().split("\n")
				    	for (i=0; i<=all_data_crawl.length; i++){
				    		let data_i = all_data_crawl[i].trim()
				    		if (data_i == "Giá mở cửa"){
				    			break
				    		}
				    	}
				    	open_now = all_data_crawl[i+1].trim()
			        }

			        try{
			        	let all_data_crawl = $(".dltl-price").text().split("\n")
				    	for (i=0; i<=all_data_crawl.length; i++){
				    		let data_i = all_data_crawl[i].trim()
				    		if (data_i == "Giá cao nhất"){
				    			break
				    		}
				    	}
				    	ceil_now = all_data_crawl[i+1].trim()
			        }
			        catch(err)
			        {
			        	let all_data_crawl = $(".dtlu-price-detail").text().split("\n")
				    	for (i=0; i<=all_data_crawl.length; i++){
				    		let data_i = all_data_crawl[i].trim()
				    		if (data_i == "Giá cao nhất"){
				    			break
				    		}
				    	}
				    	ceil_now = all_data_crawl[i+1].trim()
			        }

			        try{
			        	let all_data_crawl = $(".dltl-price").text().split("\n")
				    	for (i=0; i<=all_data_crawl.length; i++){
				    		let data_i = all_data_crawl[i].trim()
				    		if (data_i == "Giá thấp nhất"){
				    			break
				    		}
				    	}
				    	floor_now = all_data_crawl[i+1].trim()
			        }
			        catch(err)
			        {
			        	let all_data_crawl = $(".dtlu-price-detail").text().split("\n")
				    	for (i=0; i<=all_data_crawl.length; i++){
				    		let data_i = all_data_crawl[i].trim()
				    		if (data_i == "Giá thấp nhất"){
				    			break
				    		}
				    	}
				    	floor_now = all_data_crawl[i+1].trim()
			        }
				    data_out = {
			        	close: close_now,
			        	open: open_now,
			        	ceil: ceil_now,
			        	floor: floor_now,
			        	volume: vol_now,
			        	symbol: hex_code,
			        	demo: "lmao"
			        }
			        res.end(JSON.stringify(data_out));
		    	}
		    	catch(err)
			    {
			    	data_out = {
			        	close: 0,
			        	open: 0,
			        	ceil: 0,
			        	floor: 0,
			        	volume: 0,
			        	symbol: "",
			        	demo: "lmao"
			        }
			        res.end(JSON.stringify(data_out));
			    }
		    }
		})
	} catch {}
}


// async function connectCollection() {
// 	let client = await MongoClient.connect('mongodb://127.0.0.1:27017', { 
// 	    useNewUrlParser: true, 
// 	    useUnifiedTopology: true,
// 	});
// 	let dbase = client.db('login');
// 	let collection = dbase.collection('member')
// 	return {client: client, collection: collection}
// }

async function connectCollection() {
	try {
		let client = await MongoClient.connect('mongodb://127.0.0.1:27017', { 
		    useNewUrlParser: true, 
		    useUnifiedTopology: true,
		});
		let dbase = client.db('loginn');
		let collection_name = "member"
		try {
			await dbase.createCollection(collection_name, function(err, res) {
				if (err) {}
				else {
					console.log("Collection created!");
				}
			});
		} catch {}
		let collection = dbase.collection(collection_name)
		return {client: client, collection: collection}
	} catch {}
}

async function check_regex(username, password, string1, string2) {
	regex = /^[a-zA-Z0-9.@]+$/
	if (regex.test(username) && regex.test(password) && regex.test(string1) && regex.test(string2)) {
		return true
	} else {
		return false
	}
}

async function handle_num(num) {
	if (parseInt(num)<10) {
		return "0"+num
	} else {
		return num
	}
}

async function change_time(time, minute) {
	const min_stamp = 60000
	let stamp_change = min_stamp*minute
	let yyyy = time.slice(0,4)
	let mm = parseInt(time.slice(4,6))-1
	let dd = time.slice(6,8)
	let hh = time.slice(8,10)
	let min = time.slice(10,12)

	let time_create = new Date(yyyy, mm, dd, hh, min);
	let new_stamp = time_create.getTime() + stamp_change
	let new_time = new Date(new_stamp)
	let new_month = parseInt(new_time.getMonth())+1
	let time_final = new_time.getFullYear() + await handle_num(new_month.toString()) + await handle_num(new_time.getDate()) + await handle_num(new_time.getHours()) + await handle_num(new_time.getMinutes())
	return time_final
}

async function current_time() {
	let new_time = new Date();
	let new_month = parseInt(new_time.getMonth())+1
	let time_curent = new_time.getFullYear() + await handle_num(new_month.toString()) + await handle_num(new_time.getDate()) + await handle_num(new_time.getHours()) + await handle_num(new_time.getMinutes())
	return time_curent
}

async function update_token(collection, username, token, time_token) {
	let filter = { user: username };	
	let updateDoc = {
		$set: {
			token: token,
			timetoken: time_token
		},
    };
    let result = await collection.updateOne(filter, updateDoc);
}

async function update_pass(collection, username, password) {
	let filter = { user: username };	
	let updateDoc = {
		$set: {
			pass: password,
		},
    };
    let result = await collection.updateOne(filter, updateDoc);
}

async function delete_user(collection, username) {
	let filter = { user: username };
    let result = await collection.deleteOne(filter)
}

async function update_info_by_admin(collection, username, password, name, email, type_user, active) {
	let filter = { user: username };	
	let updateDoc = {
		$set: {
			name: name,
			pass: password,
			email: email,
			activate: active,
			type_user: type_user
		},
    };
    let result = await collection.updateOne(filter, updateDoc);
}

async function update_active(collection, username) {
	let filter = { user: username };	
	let updateDoc = {
		$set: {
			activate: "yes",
		},
    };
    let result = await collection.updateOne(filter, updateDoc);
}

async function randomChar(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

async function create_token() {
	let new_token = await randomChar(48)
	let time_current = await current_time()
	return {time_current: time_current, new_token: new_token}
}


async function check_token(username, token) {
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let checkRegex = await check_regex(username, token, "ok", "ok")
		let checkToken = false
		try {
			if (checkRegex == true) {
				let items = await collection.find({user: username}).toArray();
				if (items.length===1) {
					if (token===items[0].token)
					{
						let check_time = await change_time(items[0].timetoken, 2*60)
						let time_now = await current_time()
						if (parseInt(time_now)<parseInt(check_time)) {
							checkToken = true
						}
						if (checkToken===true) {
							//console.log("Check token user: " + username + "  -  Keep login with token")
						} else {
							//console.log("Check token user: " + username + "  -  Token expired")
						}
					} else {
						//console.log("Check token user: " + username + "  -  Invalid token")
					}
				} else {
					//console.log("Check token user: " + username + "  -  User not exist or another user has the same name")
				}
			}
		} catch(err) {
			throw err;
		} finally {
			try {
				client.close();
			} catch {}
		}
		return checkToken
	} catch {}
	
}

async function change_pass(username, old_pass, new_pass) {
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let log_change_pass = ""
		let change_pass_check = false
		let checkRegex = await check_regex(username, old_pass, new_pass, "ok")
		try {
			if (checkRegex == true) {
				let items = await collection.find({user: username}).toArray();
				if (items.length===1) {
					if (old_pass===items[0].pass) {
						await update_pass(collection, username, new_pass)
						log_change_pass = "Success - Change pass with user: " + username + "  -  " + "pass: " + new_pass + "  -  Success"
						print_color(color.green, log_change_pass)
						change_pass_check = true
					} else {
						log_change_pass = "Failed - Change pass with user: " + username + "  -  " + "old_pass: " + old_pass +  "  -  " + "new_pass: " + new_pass + "  -  Wrong old pass"
						print_color(color.red, log_change_pass)
					}
				} else {
					log_change_pass = "Failed - Change pass user: " + username + "  -  " + "old_pass: " + old_pass +  "  -  " + "new_pass: " + new_pass + "  -  User not exist or another user has the same name"
					print_color(color.red, log_change_pass)
				}
			}
		}  catch(err) {
			throw err;
		} finally {
			try {
				client.close();
				await write_log("change_pass_log", log_change_pass)
			} catch {}
		}
		return change_pass_check
	} catch {}
	
}

async function get_login(username, password) {
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let checkRegex = await check_regex(username, password, "ok", "ok")
		let login_check = false
		let log_login = ""
		let data_token = ""
		let activateUser = false
		try {
			if (checkRegex == true) {
				let items = await collection.find({user: username}).toArray();
				if (items.length===1) {
					if (password===items[0].pass)
					{
						data_token = await create_token()
						await update_token(collection, username, data_token.new_token, data_token.time_current)
						if (items[0].activate=="yes") {
							activateUser = true
						}
						log_login = "Success - Login with user: " + username + "  -  " + "pass: " + password + "  -  Success"
						print_color(color.green, log_login)
						login_check = true
					} else {
						log_login = "Failed - Login with user: " + username + "  -  " +  "pass: " + password  + "  -  Wrong password"
						print_color(color.red, log_login)
					}
				} else {
					log_login = "Failed - Login with user: " + username + "  -  " +   "pass: " + password +  "  -  User not exist or another user has the same name"
					print_color(color.red, log_login)
				}
			}
		} catch(err) {
			throw err;
		} finally {
			try {
				client.close();
			} catch {}
		}
		return {login_check: login_check, log_login: log_login, token: data_token.new_token, activateUser: activateUser}
	} catch {}

}

async function active_user_database(username, active_code) {
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let log_active_write
		let status_activate_database = false
		regex = /^[a-zA-Z0-9]+$/
		try {
			if (regex.test(username) && regex.test(active_code)) {
				let items = await collection.find({user: username}).toArray();
				if (items.length===1) {
					if (active_code===items[0].active_code){
						await update_active(collection, username)
						log_active_write = "Success - Active database user: " + username + "  -  Success"
						print_color(color.green, log_active_write)
						status_activate_database = true
					} else {
						log_active_write = "Failed - Active database user: " + username + "  -  Wrong active code"
						print_color(color.red, log_active_write)
					}
				} else {
					log_active_write = "Failed - Active database user: " + username + "  -  User not exist or another user has the same name"
					print_color(color.red, log_active_write)
				}
			}
		} catch(err) {
			throw err;
		} finally {
			try {
				client.close();
				await write_log("active_log", log_active_write)
			} catch {}
		}
		return status_activate_database
	} catch {}
	
}

async function register_database(username, password, email, namechar) {
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let check_register_success = false
		let checkRegex = await check_regex(username, password, email, namechar)
		let log_register_write = ""
		let time_now = await current_time()
		let active_code = await randomChar(6)
		try {
			if (checkRegex == true) {
				let items = await collection.find({user: username}).toArray();
				if (items.length===0) {
					//  type_user
					//  admin    -  1
					//  normal   -  2
					let create_user = { user: username, pass: password, email: email, name: namechar, activate: "no", token: "", timetoken: "", create_date: time_now, active_code: active_code, type_user: 2};
					await collection.insertOne(create_user)
					let data_token = await create_token()
					await update_token(collection, username, data_token.new_token, data_token.time_current)
					log_register_write = "Success - Register with user: " + username + "  -  pass: " + password + "  -  email: " + email + "  -  name: " + namechar + "  -  Insert success"
					print_color(color.green, log_register_write)
					check_register_success = true
				} else {
					log_register_write = "Failed - Register with user: " + username + "  -  pass: " + password + "  -  email: " + email + "  -  name: " + namechar  + "  -  User exist"
					print_color(color.red, log_register_write)
				}
			} else {
				log_register_write = "Failed - Register with user: " + username + "  -  pass: " + password + "  -  email: " + email + "  -  name: " + namechar  + "  -  User or pass has specific characters"
				print_color(color.red, log_register_write)
			}
		} catch(err) {
			throw err;
		} finally {
			try {
				client.close();
				await write_log("register_log", log_register_write)
			} catch {}
		}
		return check_register_success
	} catch {}
	
}

async function admin_update_info(username, password, name, email, type_user, active) {
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let check_update_success = false
		let log_update_write = ""
		try {
			await update_info_by_admin(collection, username, password, name, email, type_user, active)
			log_update_write = "Success - Admin update user: " + username + "  -  pass: " + password + "  -  email: " + email + "  -  name: " + name + "  -  type_user: " + type_user   + "  -  active: " + active + "  -  Update success"
			print_color(color.green, log_update_write)
			check_update_success = true


		} catch(err) {
			throw err;
			log_update_write = "Error - Admin update user: " + username + "  -  pass: " + password + "  -  email: " + email + "  -  name: " + name  + "  -  type_user: " + type_user   + "  -  active: " + active + "  -  Update failed"
			print_color(color.red, log_update_write)
		} finally {
			try {
				client.close();
				await write_log("admin_update_log", log_update_write)
			} catch {}
		}
		return check_update_success
	} catch {}
	
}

async function delete_user_by_admin(username) {
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let check_delete_success = false
		let log_delete_write = ""
		try {
			let items = await collection.find({user: username}).toArray();
				if (items.length===0 || username=="admin") {
					log_delete_write = "Error - Admin delete user: " + username + "  -  cannot find user"
					print_color(color.red, log_delete_write)
				} else {
					await delete_user(collection, username)
					log_delete_write = "Success - Admin delete user: " + username + "  -  delete success"
					print_color(color.green, log_delete_write)
					check_delete_success = true				
				}
		} catch(err) {
			throw err;
			log_delete_write = "Error - Admin delete user: " + username + "  -  delete failed"
			print_color(color.red, log_delete_write)
		} finally {
			try {
				client.close();
				await write_log("admin_delete_log", log_delete_write)
			} catch {}
		}
		return check_delete_success
	} catch {}
	
}

async function list_user_by_admin() {
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let data_all_user = []

		try {
			let items = await collection.find({}).toArray()
			for (let i=0; i<items.length; i++) {
				data_all_user.push({
					id: i+1,
					name: items[i].name,
					user: items[i].user,
					email: items[i].email,
					pass: items[i].pass,
					active: items[i].activate,
					create_date: items[i].create_date,
					type_user: items[i].type_user,
					token: items[i].token,
				})
			}
		} catch(err) {
			throw err;
		} finally {
			try {
				client.close();
			} catch {}
		}
		return {status: "ok", data_user: data_all_user}
	} catch {}
	
}

async function create_admin_user(username, password, email, namechar) {
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let time_now = await current_time()
		let active_code = await randomChar(6)
		try {
			let items = await collection.find({user: username}).toArray();
			if (items.length===0) {
				let create_user = { user: username, pass: password, email: email, name: namechar, activate: "yes", token: "", timetoken: "", create_date: time_now, active_code: active_code, type_user: 1};
				await collection.insertOne(create_user)
				let data_token = await create_token()
				await update_token(collection, username, data_token.new_token, data_token.time_current)
				log_register_write = "Create admin user - Success"
				print_color(color.green, log_register_write)
			} else {
				log_register_write = "Create admin user - User exist"
				print_color(color.red, log_register_write)
			}

		} catch(err) {
			throw err;
		} finally {
			try {
				client.close();
			} catch {}
		}
	} catch {}
}



async function write_log(log_name, content_text) {
	try {
		fs.writeFileSync('log_server/'+log_name+'.txt', content_text+"\n", { flag: 'a+' });
	} catch (err) {
		console.log("Error while writing log")
		console.log(err);
	}
}

async function decode_url_login(ip_remote, res, req){
	try{
		let time_now = await current_time()
		let username_split = req.body.data.user
		let password_split = req.body.data.pass
		let random_pass = atob(atob(password_split))
		let decode_pass = ""
		for (i=0;i<random_pass.length;i++) {
			j=i+1
			if (j%4==0)
				decode_pass+=random_pass[i]
		}
		
		let login_info = await get_login(username_split, decode_pass)
		let login_check = login_info.login_check
		let log_login_write = time_now + "  -  " + login_info.log_login + "  -  " + ip_remote
		let log_token = login_info.token
		let activateUser = login_info.activateUser
		await write_log("login_log", log_login_write)
		
		if (login_check==true) {
			res_data = {
				status: "ok",
				token: log_token,
				activateUser: activateUser
			}
			res.end(JSON.stringify(res_data));
		} else {
			res.writeHead(200, { 'Content-Type': 'application/json' });
	        res.write(JSON.stringify({ status: "Error !!!"}));  
	        res.end();
		}
	} catch(err) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
}

async function decode_activate_register(req) {
	let user_split = req.body.data.user
	let active_split = req.body.data.active
	regex = /^[a-zA-Z0-9.@]+$/
	if (regex.test(user_split)) {
		return {active_user: user_split, active_code: active_split}
	} else {
		return {}
	}
}

async function activate_register(res, req) {
	let active_info = await decode_activate_register(req)
	//console.log(active_info.active_user, active_info.active_code)
	let status_activate_database = await active_user_database(active_info.active_user, active_info.active_code)

	if (status_activate_database==true) {
		res_data = {
			status: "ok",
		}
	} else {
		res_data = {
			status: "error",
		}
	}
	res.end(JSON.stringify(res_data));
}

async function get_info_database(username) {
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let checkRegex = await check_regex(username, "ok", "ok", "ok")
		try {
			if (checkRegex == true) {
				let items = await collection.find({user: username}).toArray();
				if (items.length===1) {
					data_res = {
						check_info: "ok",
						email: items[0].email,
						name: items[0].name,
						activate: items[0].activate,
						create_date: items[0].create_date,
						type_user: items[0].type_user
					}
				} else{
					data_res = {check_info: "Error!!!"}
				}
			}
		} catch(err) {
			data_res = {check_info: "Error!!!"}
			throw err;
		} finally {
			try {
				client.close();
			} catch {}
		}
		return data_res
	} catch {}
	
}

async function get_user_type(username) {
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let checkRegex = await check_regex(username, "ok", "ok", "ok")
		try {
			if (checkRegex == true) {
				let items = await collection.find({user: username}).toArray();
				if (items.length===1) {
					data_res = {
						check_status: "ok",
						type_user: items[0].type_user
					}
				} else{
					data_res = {check_info: "Error!!!"}
				}
			}
		} catch(err) {
			data_res = {check_info: "Error!!!"}
			throw err;
		} finally {
			try {
				client.close();
			} catch {}
		}
		return data_res
	} catch {}
	
}

async function get_active_code(username){
	try {
		getConnect = await connectCollection()
		client = getConnect.client
		collection = getConnect.collection
		let log_active_write
		let active_code = ""
		regex = /^[a-zA-Z0-9]+$/
		try {
			if (regex.test(username)) {
				let items = await collection.find({user: username}).toArray();
				if (items.length===1) {
					log_active_write = "Success - Get active code -  User: " + username + "  -  Success"
					active_code=items[0].active_code
					//print_color(color.green, log_active_write)
				} else {
					log_active_write = "Failed - Get active code -  User: " + username + "  -  User not exist or another user has the same name"
					//print_color(color.red, log_active_write)
				}
			}
		} catch(err) {
			throw err;
		} finally {
			try {
				client.close();
				await write_log("get_active_code_mail_log", log_active_write)
			} catch {}
		}
		return active_code
	} catch {}
	
}

async function activate_register_send_email(res, email_register, username) {
	try {
		let admin_email = "dubaochungkhoan.24h@gmail.com"
		//let admin_email = "dubaochungkhoan.24h@hotmail.com"
		var transporter = nodemailer.createTransport({
		  service: "gmail",
		  auth: {
		    user: admin_email,
		    pass: "nsexrzxhigrokuiw"//atob("bGFteGNhcDk4")
		  }
		});
		let active_code = await get_active_code(username)

		let mailOptions = {
		  from: admin_email,
		  to: email_register,
		  subject: 'Kích hoạt tài khoản dự báo chứng khoán',
		  text: 'Bạn đang đăng ký tài khoản dự báo chứng khoán với tên đăng nhập: '+username+'\nMã xác thực để kích hoạt tài khoản của bạn là: '+active_code+'\nNếu không phải xin hãy bỏ qua thư này!'
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		  	console.log("Some error occur while sending email!")
		    console.log(error);
		    res.writeHead(200, { 
				'Content-Type': 'application/json',
			});
	        res.write(JSON.stringify({ status: "ok"}));  
	        res.end();
		  } else {
		    //console.log('Email sent: ' + email_register)//info.response);
	    	res.writeHead(200, { 
				'Content-Type': 'application/json',
			});
	        res.write(JSON.stringify({ status: "ok"}));  
	        res.end();
		  }
		});
	} catch {}
}

async function register_user(res, req) {
	let name_split = req.body.data.name
	let email_split = req.body.data.email
	let user_split = req.body.data.user
	let pass_split = req.body.data.pass

	let random_pass = atob(atob(pass_split))
	let decode_pass = ""
	for (i=0;i<random_pass.length;i++) {
		j=i+1
		if (j%4==0)
			decode_pass+=random_pass[i]
	}
	let check_register_success
	let checkRegex = await check_regex(user_split, decode_pass, email_split, name_split)
	if (checkRegex==true) {
		check_register_success = await register_database(user_split, decode_pass, email_split, name_split)
	} 
	if (check_register_success==true) {
		res_data = {
			status: "ok",
		}
	} else {
		res_data = {
			status: "error",
		}
	}
	res.end(JSON.stringify(res_data));
	activate_register_send_email(res, email_split, user_split)
}

async function decode_url_check(res, req){
	try{
		let username_split = req.body.data.user
		let token_split = req.body.data.token

		let check_token_var = await check_token(username_split, token_split)
		if (check_token_var==true) {
			res_data = {
				status: "ok",
			}
			res.end(JSON.stringify(res_data));
		} else {
			res.writeHead(200, { 
				'Content-Type': 'application/json',
			});
	        res.write(JSON.stringify({ status: "Error !!!"}));  
	        res.end();
		}
	} catch(err) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
}

async function decode_get_data_json(res, req) {
	try{
		let username_split = req.body.data.user
		let token_split = req.body.data.token
		let json_split = req.body.data.json

		let check_token_var = await check_token(username_split, token_split)
		if (check_token_var==true) {
			let rawdata = fs.readFileSync("public/data/web_data/"+json_split);
			let json_data = JSON.parse(rawdata);
			res_data = {
				data: json_data,
			}
			res.end(JSON.stringify(res_data));
		} else {
			res.writeHead(200, { 
				'Content-Type': 'application/json',
			});
	        res.write(JSON.stringify({ status: "Error !!!"}));  
	        res.end();
		}
	} catch(err) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
}

async function decode_get_data_json_new(res, req) {
	try{
		let username_split = req.body.data.user
		let token_split = req.body.data.token
		let json_split = req.body.data.json

		let check_token_var = await check_token(username_split, token_split)
		if (check_token_var==true) {
			let rawdata = fs.readFileSync("public/data/web_data_new/"+json_split);
			let json_data = JSON.parse(rawdata);
			res_data = {
				data: json_data,
			}
			res.end(JSON.stringify(res_data));
		} else {
			res.writeHead(200, { 
				'Content-Type': 'application/json',
			});
	        res.write(JSON.stringify({ status: "Error !!!"}));  
	        res.end();
		}
	} catch(err) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
}

async function decode_get_user_info(res, req){
	try{
		let username_split = req.body.data.user
		let token_split = req.body.data.token

		let check_token_var = await check_token(username_split, token_split)
		if (check_token_var==true) {
			res_data = await get_info_database(username_split)
			res.end(JSON.stringify(res_data));
		} else {
			res.writeHead(200, { 
				'Content-Type': 'application/json',
			});
	        res.write(JSON.stringify({ status: "Error !!!"}));  
	        res.end();
		}
	} catch(err) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
}

async function check_type_user(res, req){
	try{
		let username_split = req.body.data.user
		let token_split = req.body.data.token

		let check_token_var = await check_token(username_split, token_split)
		if (check_token_var==true) {
			res_data = await get_user_type(username_split)
			res.end(JSON.stringify(res_data));
		} else {
			res.writeHead(200, { 
				'Content-Type': 'application/json',
			});
	        res.write(JSON.stringify({ status: "Error !!!"}));  
	        res.end();
		}
	} catch(err) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
}

async function admin_change_info(res, req){
	try{
		let username_split = req.body.data.user_admin
		let token_split = req.body.data.token_admin

		let check_token_var = await check_token(username_split, token_split)
		if (username_split!="admin"){
			check_token_var=false
		}
		if (check_token_var==true) {
			let name_change = req.body.data.name_change
			let user_change = req.body.data.user_change
			let pass_change = req.body.data.pass_change
			let email_change = req.body.data.email_change
			let type_user_change = req.body.data.type_user_change
			let active_change = req.body.data.active_change

			let checkRegex = await check_regex(name_change, user_change, pass_change, email_change)
			if (checkRegex==true) {
				checkRegex = await check_regex(type_user_change, active_change, "ok", "ok")
			}
			if (checkRegex==true) {
				let status_update = await admin_update_info(user_change, pass_change, name_change, email_change, type_user_change, active_change)
				if (status_update==true) {
					res_data = {status: "ok"}
					res.end(JSON.stringify(res_data));
				} else {
					res.writeHead(200, { 
						'Content-Type': 'application/json',
					});
			        res.write(JSON.stringify({ status: "Error !!!"}));  
			        res.end();
				}
			}
			
		} else {
			res.writeHead(200, { 
				'Content-Type': 'application/json',
			});
	        res.write(JSON.stringify({ status: "Error !!!"}));  
	        res.end();
		}
	} catch(err) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
}
async function admin_list_user(res, req){
	try{
		let username_split = req.body.data.user
		let token_split = req.body.data.token

		let check_token_var = await check_token(username_split, token_split)

		if (username_split!="admin"){
			check_token_var=false
		}

		if (check_token_var==true) {
			let checkRegex = await check_regex(username_split, token_split, "ok", "ok")
			if (checkRegex==true) {
				data_all_user = await list_user_by_admin()
				res_data = data_all_user
				res.end(JSON.stringify(res_data));
			}
		} else {
			res.writeHead(200, { 
				'Content-Type': 'application/json',
			});
	        res.write(JSON.stringify({ status: "Error !!!"}));  
	        res.end();
		}
	} catch(err) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
}

async function admin_delete_user(res, req){
	try{
		let admin_user = req.body.data.user_admin
		let admin_token = req.body.data.token_admin
		let user_delete = req.body.data.delete_user

		let check_token_var = await check_token(admin_user, admin_token)

		if (admin_user!="admin"){
			check_token_var=false
		}

		if (check_token_var==true) {
			let checkRegex = await check_regex(admin_user, admin_token, user_delete, "ok")
			if (checkRegex==true) {
				let status_delete = await delete_user_by_admin(user_delete)
				if (status_delete==true) {
					res_data = {status: "ok"}
					res.end(JSON.stringify(res_data));
				} else {
					res.writeHead(200, { 
						'Content-Type': 'application/json',
					});
			        res.write(JSON.stringify({ status: "Error !!!"}));  
			        res.end();
				}	
			}
			else {
				res.writeHead(200, { 
					'Content-Type': 'application/json',
				});
		        res.write(JSON.stringify({ status: "Error !!!"}));  
		        res.end();
			}
		} else {
			res.writeHead(200, { 
				'Content-Type': 'application/json',
			});
	        res.write(JSON.stringify({ status: "Error !!!"}));  
	        res.end();
		}
	} catch(err) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
}

async function decode_change_pass(res, req){
	try{
		let username_split = req.body.data.user
		let token_split = req.body.data.token

		let check_token_var = await check_token(username_split, token_split)
		if (check_token_var==true) {
			let old_pass = req.body.data.old_pass
			let new_pass = req.body.data.new_pass

			let random_old_pass = atob(atob(old_pass))
			let decode_old_pass = ""
			for (i=0;i<random_old_pass.length;i++) {
				j=i+1
				if (j%4==0)
					decode_old_pass+=random_old_pass[i]
			}

			let random_new_pass = atob(atob(new_pass))
			let decode_new_pass = ""
			for (i=0;i<random_new_pass.length;i++) {
				j=i+1
				if (j%4==0)
					decode_new_pass+=random_new_pass[i]
			}
			let checkRegex = await check_regex(decode_old_pass, decode_new_pass, "ok", "ok")
			if (checkRegex==true) {
				let info_change_pass = await change_pass(username_split, decode_old_pass, decode_new_pass)
				if (info_change_pass==true) {
					res.writeHead(200, { 
						'Content-Type': 'application/json',
					});
			        res.write(JSON.stringify({ status: "ok"}));  
			        res.end();
				} else {
					res.writeHead(200, { 
						'Content-Type': 'application/json',
					});
			        res.write(JSON.stringify({ status: "Error !!!"}));  
			        res.end();
				}

			} else {
				res.writeHead(200, { 
					'Content-Type': 'application/json',
				});
		        res.write(JSON.stringify({ status: "Error !!!"}));  
		        res.end();
		    }
			
		} else {
			res.writeHead(200, { 
				'Content-Type': 'application/json',
			});
	        res.write(JSON.stringify({ status: "Error !!!"}));  
	        res.end();
		}
	} catch(err) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
}

async function check_security(req) {
	let data_in = req.body.security.data
	let data_type = req.body.security.type
	let data_author = req.body.security.author
	if (data_in=="form" && data_type=="json" && data_author=="lamdz") {
		return true
	} else {
		return false
	}
}

//==================================================================================================================
// app.get('/', function(req, res) {
// 	console.log("dafuk")
// 	res.sendFile(path.join(__dirname, 'index.html'));
// });
//==================================================================================================================
app.post('/_login_/', async function(req, res) {
	try{
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');

        let security_check = await check_security(req)
        if (security_check==true) {
        	decode_url_login(req.socket.remoteAddress, res, req)
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }
	    
    }
    catch(err)
    {
    	console.log(err)
    	console.log("Login error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();  
    }
});
//==================================================================================================================
app.post('/_check_/', async function(req, res) {
	// Check keep login with token
	try{
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let security_check = await check_security(req)
        if (security_check==true) {
        	decode_url_check(res, req)
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }
    }
    catch(err)
    {
    	console.log(err)
    	console.log("Check token error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();  
    }
});
//==================================================================================================================
app.post('/_active_/', async function(req, res) {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let security_check = await check_security(req)
        if (security_check==true) {
			activate_register(res, req)
		} else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }
	} catch(err) {
		console.log(err)
		console.log("Activate register error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});
//==================================================================================================================
app.post('/_register_/', async function(req, res) {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let security_check = await check_security(req)
        if (security_check==true) {
			register_user(res, req)
		} else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }
	} catch(err) {
		console.log(err)
		console.log("Register error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});
//==================================================================================================================
app.post('/_resend_/', async function(req, res) {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let active_user = req.body.data.user
        let active_email = req.body.data.email
        let security_check = await check_security(req)
        if (security_check==true) {
        	activate_register_send_email(res, active_email, active_user)
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }
	} catch(err) {
		console.log(err)
		console.log("Resend error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});
//==================================================================================================================
app.post('/_getdata_/', async function(req, res) {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let security_check = await check_security(req)
        if (security_check==true) {
        	decode_get_data_json(res, req)
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }

	} catch(err) {
		console.log(err)
		console.log("Resend error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});
//==================================================================================================================
app.post('/_userinfo_/', async function(req, res) {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let security_check = await check_security(req)
        if (security_check==true) {
        	decode_get_user_info(res, req)
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }

	} catch(err) {
		console.log(err)
		console.log("Get user info error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});
//==================================================================================================================
app.post('/_changepass_/', async function(req, res) {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let security_check = await check_security(req)
        if (security_check==true) {
        	decode_change_pass(res, req)
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }

	} catch(err) {
		console.log(err)
		console.log("Change pass error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});
//==================================================================================================================
app.post('/_typeuser_/', async function(req, res) {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let security_check = await check_security(req)
        if (security_check==true) {
        	check_type_user(res, req)
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }

	} catch(err) {
		console.log(err)
		console.log("Change pass error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});
//==================================================================================================================
app.post('/_adminchangeinfo_/', async function(req, res) {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let security_check = await check_security(req)
        if (security_check==true) {
        	admin_change_info(res, req)
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }

	} catch(err) {
		console.log(err)
		console.log("Change pass error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});
//==================================================================================================================
app.post('/_adminlistuser_/', async function(req, res) {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let security_check = await check_security(req)
        if (security_check==true) {
        	admin_list_user(res, req)
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }

	} catch(err) {
		console.log(err)
		console.log("List user error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});
//==================================================================================================================
app.post('/_admindeleteuser_/', async function(req, res) {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let security_check = await check_security(req)
        if (security_check==true) {
        	admin_delete_user(res, req)
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"})); 
			res.end();  
        }

	} catch(err) {
		console.log(err)
		console.log("List user error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});
//==================================================================================================================
app.post('/_getdatarealtime_/', async function(req, res) {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');


        let security_check = await check_security(req)
        if (security_check==true) {
        	let hex_code = req.body.data.hex
        	if (hex_code.length==3){
        		crawl_data_real_time(hex_code, res)
        	} else {
        		console.log("Invalid hex code")
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({ status: "Error !!!"})); 
				res.end();  
        	}
        	
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"})); 
			res.end();  
        }

	} catch(err) {
		console.log(err)
		console.log("List user error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});
//==================================================================================================================
app.post('/_getdatanew_/', async function(req, res) { //Cái này dùng để lấy data cập nhật hàng ngày
	try {
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('transfer-encoding', '');

        let security_check = await check_security(req)
        if (security_check==true) {
        	decode_get_data_json_new(res, req)
        } else {
			console.log("Invalid security")
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ status: "Error !!!"}));  
			res.end();  
        }

	} catch(err) {
		console.log(err)
		console.log("Resend error")
    	res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status: "Error !!!"}));  
        res.end();
	}
});

//app.use('/',express.static(path.join(__dirname)));

app.listen(port);
console.log('Server started at http://localhost:' + port)

// app.listen(port, function () {
// 	console.log('Server started at http://localhost:' + port);
// });
