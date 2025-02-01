import express, { Request, Response } from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hi" });
});

app.listen(5000, async () => {
  console.log("Server is running on http://localhost:5000");
});
