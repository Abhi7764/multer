const express=require("express");
const session=require("express-session");
const cookieparser=require("cookie-parser");
const app=express();

app.use(cookieparser());
app.use(session({
    saveUninitialized:true,
    resave:false,
    cookie:{maxAge:300000},
    secret:"389&udje9#%&*#chkcn436"
}))

const path=require("path");
const multer=require("multer");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
//const upload=multer({dest:'public/files'}); //it's give you random filename but it's not ginen you which type of file
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/files");
    },
    filename:(req,file,cb)=>{
        console.log(file);
        const ext=file.mimetype.split('/')[1];
        //cb(null,"test."+ext); 
        cb(null,req.session.username+'.'+ext);
    }
})

const filter=(req,file,cb)=>{
    const ext=file.mimetype.split("/")[1];
    if(ext=='jpeg'){
        cb(null,true);
    }
    else{
        cb(new Error("File not supported"),false);
    }
}

const upload=multer({storage:storage,fileFilter:filter});

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/upload.html"))
})

app.post("/uploadfile",upload.single("pic"),(req,res)=>{
    //res.end();
    res.redirect("/dashboard")
})

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/login.html"))
})
app.post("/login",(req,res)=>{
    if(req.body.username==req.body.password){
        req.session.username=req.body.password;
        res.redirect("/dashboard");
    }
    else{
        res.redirect("/login");
    }
})
app.get("/dashboard",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/dashboard.html"))
})
app.listen(3000,(err)=>{
    console.log("Servered Started....");
})