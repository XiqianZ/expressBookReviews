const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(function methodLogger(req, res, next) {
    const method = req.method;
    const ip = req.ip;
    const path = req.path;
    const now = new Date();
    const dateTimeString = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    console.log("");
    console.log(`METHOD: ${method} in ${dateTimeString} at ${path} from ${ip}`);
    
    next();
})

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization){
        const username = req.session.authorization.username;
        console.log(`The user: ${username}`);

        token = req.session.authorization.accessToken;
        jwt.verify(token, "access", (err,user)=>{
            if(!err){
                req.user = user;
                next();
            } else{
                return res.status(403).json({message: "User not authenticated"})
            }
        });
    } else {
        return res.status(403).json({message: "User not logged in"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
