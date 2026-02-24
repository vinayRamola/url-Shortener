require("dotenv").config();

const connect = require("./configs/db");
const app = require("./index");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    try {
        await connect();
        console.log(`Server running on ${PORT}`);
    } catch (error) {
        console.log(error.message);
    }
});