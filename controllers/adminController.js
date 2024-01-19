const User = require('../models/userModel');

const bcrypt = require('bcrypt');

// to secure the password

const seccurePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    }catch (error){
        console.log(error.message);
    }
    

}


// Admin login user method start

const loginLoad = async(req,res)=>{
    try{
        res.render('login');

    }catch (error){
        console.log(error.message);
    }
}

// login user method start
// to verify login

const varifyLogin = async(req,res)=>{
    try{
        const name = req.body.name;
        const password = req.body.password;

        const userData = await User.findOne({name:name});

        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                if(userData.is_admin === 0){
                    res.render('login',{message:"YOU ARE NOT ADMIN"});
                }
                else{
                    req.session.user_id = userData._id;
                    
                    res.redirect('/admin/home');
                }
     
            }
            else{
                res.render('login',{message:"Username and password is incorrect"});
            }

        }
        else{
            res.render('login',{message:"Username and password is incorrect"});
        }

    }catch (error){
        console.log(error.message);
    }
}

// for dashbord

const loadDashboard = async(req,res)=>{
    try{
        const userData = await User.findById({ _id:req.session.user_id});
        res.render('home',{ user:userData });

    }catch (error){
        console.log(error.message);
    }
}

// to log out from home

const adminLogout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin');
        // console.log(problematicObject);

    }catch (error){
        console.log(error.message);
    }
}

// ADMIN DASHBOARD
const adminDashboard = async(req,res)=>{
    try{
        const userData = await User.find({is_admin:0});
        res.render('dashboard',{users:userData});

    }catch (error){
        console.log(error.message);
    }
}


//ADD NEW USER
const newUserLoad = async(req,res)=>{
    try{
        res.render('new-user');

    }catch (error){
        console.log(error.message);
    }
}

//STORE NEW USER
const addUser = async(req,res)=>{
    try{
        const spassword = await seccurePassword(req.body.password);
        const user = new User ({
            name:req.body.name,
            email:req.body.email,
            image:req.file.filename,
            password:spassword,

        });

        const userData = await user.save();

        if(userData){
            res.render('new-use',{message:"Your registration has been successfull"});
            res.redirect('/admin/dashboard');
        }
        else{
            res.render('new-use',{message:"Your registration has been failed"})
        }

        res.render('new-user');

    }catch (error){
        console.log(error.message);
    }
}

// varify account


const varify = async(req,res)=>{
    try{
        const id = req.query.id;
        const userData = await User.findById({ _id:id });
        
        if(userData){
            res.render('varify',{ user:userData});
        }
        else{
            res.redirect('/admin/dashboard');
        }
    }catch (error){
        console.log(error.message);
    }
}

// UPDATE VERIFY

const updateVarify = async(req,res)=>{
    try{
        const userData = await User.findByIdAndUpdate({ _id:(req.body.id)},{$set:{ is_varified:req.body.verify }});
            res.redirect('/admin/dashboard');

    }catch (error){
        console.log(error.message);
    }
}

//DELETE USER

const deleteUser = async(req,res)=>{
    try{
        const id = req.query.id;
         await User.deleteOne({ _id:id});
        res.redirect('/admin/dashboard');

    }catch (error){
        console.log(error.message);
    }
}





module.exports = {
    loginLoad,
    varifyLogin,
    loadDashboard,
    adminLogout,
    adminDashboard,
    newUserLoad,
    addUser,
    varify,
    updateVarify,
    deleteUser


}