import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"))
app.use("/icons", express.static("node_modules/bootstrap-icons/font"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
