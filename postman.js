const express =  require("express");
const app = express()
const bodyParser = require("body-parser")
const PORT = 3000
const logger = require("morgan");

const {onlyAdmin} = require("./middleware/firstmiddleware");

// File System
const fs = require("fs");
const { resetWatcher } = require("nodemon/lib/monitor/watch");
const morgan = require("morgan");

// DB Path
const db = "./express/public/db/db.json"

// middlewares
app.use(bodyParser.json())
app.use(logger("dev"))
app.use(logger("common"))
app.use(logger("combined"))
app.use(logger("tiny"))
app.use(logger("short"))

//Routes
app.get("/",(req, res) => {
    res.send("welcome to H0|\/|e Page!!!")
})

//http://localhost:3000/read-db?admin=jonson
app.get("/read-db", onlyAdmin, (req, res) => {
    data = JSON.parse(fs.readFileSync(db, "utf-8"))    
    res.json(data)
})

app.get("/find-db/:name", (req, res) => {
    let data = JSON.parse(fs.readFileSync(db, "utf-8"))    
    const name = req.params.name;

    founddata = data.find(user => {
        return user.name == name
    })

    console.log(typeof founddata);

    res.json( typeof founddata !== "undefined" ? founddata : "User not found")
})

//filter user by giving password in url localhost
app.get("/filter/:pass", (req, res) => {
    let data = JSON.parse(fs.readFileSync(db, "utf-8"))    
    const pass = req.params.pass;
    filterdata = data.filter(user => {
        if (user.pass==pass)
        return user.name
    })
    console.log(filterdata);
    res.json(filterdata)
    
})

app.get("/add-new-user/:name", (req, res) => {
    let data = JSON.parse(fs.readFileSync(db, "utf-8"))
    {newdata = req.params.name,req.params.pass};    
    // let newdata={
    //     "name":"asghar",
    //     "pass":"998"
    // }
    data.push(newdata)
    var newData = JSON.stringify(data)
    fs.writeFile(db, newData, (err)=>{
    if (err) throw err;
    console.log("new data added");
    })
})
//delete user data from json data
// app.delete('/delete/:name',( req,res)=>{
//     data = JSON.parse(fs.readFileSync(db, "utf-8", {flags : "data"})) 
//     let name = req.params.name
//     q = data.findIndex(x => x.name === req.params.name)
//     console.log(q);
//     for(let i=1; i<name.length; i++){
//         delete data[i]
//     }
//     console.log( JSON.stringify(data) );
//     return res.send("removed");
// })

app.get('/delete/:name',( req,res)=>{
    data = JSON.parse(fs.readFileSync(db, "utf-8", {flags : "a"})) 
    dtl = data.findIndex(x => x.name === req.params.name)
    console.log(dtl);
    data.splice(dtl,1)
    fs.writeFileSync(db,JSON.stringify(data))
    //return res.send("DATA REMOVED");
if (dtl ==-1){
    res.send("data removed")
}
else if (dtl>1){
    data.splice(dtl,1)
    res.send("already deleted")
}

})



app.get("/update-user/:name", (req, res) => {
    let data = JSON.parse(fs.readFileSync(db, "utf-8"))  
    updatedData = []

    // searching user
    data.forEach((user, i) => {
        if (user.name == req.params.name){
            updatedData = [user, i]
            return true
        } 
    })

    // validating user found or not
    if(updatedData.length > 0){

        console.log("updatedData");
        console.log(updatedData);
        
        // now updating user name if required
        if(typeof req.query.n !== "undefined"){
            data[updatedData[1]].name = req.query.n
        }
        
        // now updating user password if required
        if(typeof req.query.p !== "undefined"){
            data[updatedData[1]].pass = req.query.p
        }

        fs.writeFileSync(db, JSON.stringify(data));

    }

    res.json(updatedData.length > 0 ? {msg: "Data updated", data: updatedData[0] } : "User not found")
})


app.listen(PORT, () => {
    console.log("Server is running at port: " + PORT);
})