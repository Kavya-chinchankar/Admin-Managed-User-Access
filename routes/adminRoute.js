const express = require("express");
const admin_route = express();

const session = require("express-session");

admin_route.use(session({secret:"My Secret"}));

const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const multer = require("multer");
const path = require("path");

admin_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage});

const adminController = require("../controllers/adminController");

//for admin login

admin_route.get('/',adminController.loginLoad);

// LOGIN VARIFICATION
admin_route.post('/',adminController.varifyLogin);

// AFTER LOGIN
admin_route.get('/home',adminController.loadDashboard);

admin_route.get('/home',adminController.creatUser);

// to strore value from home

admin_route.post('/home', upload.single('image'),adminController.addCretedUser);

//LOGOUT
admin_route.get('/admin',adminController.adminLogout);

//dashbord
admin_route.get('/dashboard',adminController.adminDashboard);

//new user
admin_route.get('/new_user',adminController.newUserLoad);

admin_route.post('/new_user',adminController.addUser);

// varify

admin_route.get('/varify',adminController.varify);

// to update varify

admin_route.post('/varify',adminController.updateVarify);

// ACCEPT BY ADMIN
admin_route.get('/accecpt',adminController.acceptUser);

// DELETE USER

admin_route.get('/delete-user',adminController.deleteUser);


admin_route.get('*',function(req,res){
    res.redirect('/admin');
})


module.exports = admin_route;