import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/v1";
import { notFound, errorHandler } from "./middleware/error.middleware";
import { requestIdMiddleware } from "./middleware/requestId.middleware";
import config from "./config";

const app = express();

// Add request ID middleware first
app.use(requestIdMiddleware);

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes
app.use("/api", routes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;
