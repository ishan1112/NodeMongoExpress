const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/loginregister")
.then(() => console.log("Conn Suc")).catch((e) => console.log("Sorry",e));