const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const { dirname } = require("path");
const app=express();

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.post("/",function(req,res){
    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const email=req.body.email;

    console.log(firstName, lastName, email);

    const data={
        members: [
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);

    const url="https://us20.api.mailchimp.com/3.0/lists/fc9a56fb56";
    const options={
        method: "POST",
        auth:"swayam20:ff20b78576966b2096f68842ad80cdca-us20"
    }

    const request=https.request(url,options,function(response){
        // if(response.statusCode===200){
        //     res.send("Subscribed successfully!");
        // }else{
        //     res.send("There was an error, try again!");
        // }
        if(response.statusCode===200){
                res.sendFile(__dirname+"/success.html");
            }else{
                res.sendFile(__dirname+"/failure.html");
            }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req,res){
    res.redirect("/");
})
app.listen(process.env.PORT || 3000,function(){
    console.log("server running on port 3000");
});


// api key ff20b78576966b2096f68842ad80cdca-us20
// list id  fc9a56fb56