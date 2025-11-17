import express from "express";
const app = express();
const PORT = 3000;
// Add the GET route for /hello
app.get("/hello", (req, res) => {
    res.json({
        msg: "Hello world!",
    });
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map