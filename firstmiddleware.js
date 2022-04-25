module.exports = {
    onlyAdmin:function  (req, res, next){    
        console.log(req.query.admin);
        if ("jonson" !== req.query.admin){
            return res.redirect("/")
        } 
        next();
    }
}