import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/v1";
import { notFound, errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
  });
});
app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
