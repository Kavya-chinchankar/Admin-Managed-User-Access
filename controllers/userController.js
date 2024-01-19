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

// For Registration

const loadRegister = async(req,res)=>{
    try{
        res.render('ragistration');

    }catch (error){
        console.log(error.message);
    }
}

// For Registration
// to store value instering user

const insertUser = async(req,res)=>{
    try{
        const spassword = await seccurePassword(req.body.password);
        const user = new User ({
                name:req.body.name,
                email:req.body.email,
                image:req.file.filename,
                password:spassword,
                is_admin:0
        });

        const userData = await user.save();

        if(userData){
            res.render('ragistration',{message:"Your registration has been successfull"});
        }
        else{
            res.render('ragistration',{message:"Your registration has been failed"})
        }

    }catch (error){
        console.log(error.message);
    }
}

// varify account

const varify = async(req,res)=>{
    try{
        const updateInfo = await User.updateOne({ _id:req.body.user_id }, { $set: { is_varified:1 } });
        console.log(updateInfo);
        res.render('/varify');

    }catch (error){
        console.log(error.message);
    }
}




// login user method start

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
                // if(userData.is_varified === 0){
                    // res.render('login',{message:"varify ur email"});
                // }
                // else{
                    req.session.user_id = userData._id;
                    // req.session.user_id = userData._id;
                    res.redirect('/home');
                // }

                
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

//after login the home page loading

const loadHome = async(req,res)=>{
    try{
        const userData = await User.findById({_id:req.session.user_id});
        res.render('home',{ user:userData });
        // res.render('home');

    }catch (error){
        console.log(error.message);
    }
}

// TO STORE THE VALUES IN THE HOME PAGE

const updateHome =async(req,res)=>{
    try{
        // const id = req.body.user_id;

        if(req.file){
            const userData = await User.findByIdAndUpdate({ _id:req.body.user_id},{$set:{name:req.body.name, email:req.body.email, image:req.file.filename }});
            res.redirect('/home');
        }
        else{
            
            const userData = await User.findByIdAndUpdate({ _id:(req.body.user_id)},{$set:{name:req.body.name, email:req.body.email }});
            res.redirect('/home');
            
            // console.log(problematicObject);
        }

        res.redirect('/home');

    }catch(error){
        console.log(error.message);
    }
}



// to log out from home

const userLogout = async(req,res)=>{
    try{
        res.redirect('/');

    }catch (error){
        console.log(error.message);
    }
}


//user profile edit and update

const editLoad =async(req,res)=>{
    try{
         const id = req.query.id;

        const userData = await User.findById({ _id:id });
        if(userData){
            res.render('edit', { user:userData});
            // if(userData.is_varified === 0){
            //     res.render('edit',{message:"Not Accepted by user"});
            // }
            // else{
            //     res.render('edit',{message:"Accepted by user"});
            // }
        }
        else{
            res.redirect('home');
        }

    }catch(error){
        console.log(error.message);
    }

}

// update profile

const updateProfile =async(req,res)=>{
    try{
        // const id = req.body.user_id;

        if(req.file){
            const userData = await User.findByIdAndUpdate({ _id:req.body.user_id},{$set:{name:req.body.name, email:req.body.email, image:req.file.filename }});
            res.redirect('/home');
        }
        else{
            
            const userData = await User.findByIdAndUpdate({ _id:(req.body.user_id)},{$set:{name:req.body.name, email:req.body.email }});
            res.redirect('/home');
            
            // console.log(problematicObject);
        }

        res.redirect('/home');

    }catch(error){
        console.log(error.message);
    }
}





module.exports = {
    loadRegister,
    insertUser,
    // varify,
    loginLoad,
    varifyLogin,
    loadHome,
    updateHome,
    userLogout,
    editLoad,
    updateProfile
}