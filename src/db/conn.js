const mongoose = require("mongoose");

mongoose.connect(process.env.MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("connection successfull");
}).catch((e) => {
    console.log(e);
})