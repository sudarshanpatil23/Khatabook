const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readdir(`./files`, function (err, file) {
    if (err) return res.status(500).send(err);
    res.render("index", { file });
  });
});
app.get("/hisaab/:file", (req, res) => {
   fs.readFile(`./files/${req.params.file}`, "utf-8", function (err, data) {
    res.render("hisaab", { data, file: req.params.file });
  
  });
});

app.get("/edit/:file", (req, res) => {
  fs.readFile(`./files/${req.params.file}`, "utf-8", function (err, data) {
    res.render("edit", { data, file: req.params.file });
  });
});

app.post("/createhisaab", (req, res) => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  let fileName = `${day}-${month}-${year}.txt`;
  let counter = 1;
  const dir = "./files";

  while (fs.existsSync(path.join(dir, fileName))) {
    fileName = `${fileName.split("(")[0]}(${counter})`;
    counter++;
  }

  fs.writeFile(`./files/${fileName}`, req.body.content, function (err) {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});
app.get("/create", (req, res) => {
  res.render("create");
});
app.post("/update/:file", (req, res) => {
  fs.writeFile( `./files/${req.params.file}`,req.body.content,function (err, data) {
      if (err) return res.status(500).send(err);
      res.redirect("/");
    }
  );
});
app.get("/delete/:file", (req, res) => {
  fs.unlink(`./files/${req.params.file}`, function (err) {
    res.redirect("/");
  });
});
app.listen(3000);
