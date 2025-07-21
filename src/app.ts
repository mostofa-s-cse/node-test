import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/v1";
import { notFound, errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
