const express = require("express");
const user_route = express();

const session = require("express-session");

// const config = require("../config/config");

user_route.use(session({secret:"My Secret"}));

// const auth = require("../middleware/auth");

user_route.set('view engine','ejs')
user_route.set('views','./views/users')

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

const multer = require("multer");
const path = require("path");

user_route.use(express.static('public'));

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


const userController = require("../controllers/userController");


// for register

user_route.get('/register',userController.loadRegister);

user_route.post('/register', upload.single('image'), userController.insertUser);


//for login

user_route.get('/',userController.loginLoad);

user_route.get('/login',userController.loginLoad);


user_route.post('/login',userController.varifyLogin);

//HOME LOAD

user_route.get('/home',userController.loadHome);

// STORING IN HOME

user_route.post('/home',upload.single('image'), userController.updateHome);


//logout

user_route.get('/logout',userController.userLogout);

// profile edit

user_route.get('/edit',userController.editLoad);

// profile updte

user_route.post('/edit',upload.single('image'), userController.updateProfile);


module.exports = user_route;

