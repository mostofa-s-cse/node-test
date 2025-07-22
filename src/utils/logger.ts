import config from '../config';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  requestId?: string;
}

class Logger {
  private isDevelopment = config.nodeEnv === 'development';

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, requestId } = entry;
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    const requestStr = requestId ? ` | RequestId: ${requestId}` : '';
    
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}${requestStr}`;
  }

  private log(level: LogLevel, message: string, context?: any, requestId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      requestId,
    };

    const formattedLog = this.formatLog(entry);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formattedLog);
        }
        break;
    }
  }

  error(message: string, context?: any, requestId?: string) {
    this.log(LogLevel.ERROR, message, context, requestId);
  }

  warn(message: string, context?: any, requestId?: string) {
    this.log(LogLevel.WARN, message, context, requestId);
  }

  info(message: string, context?: any, requestId?: string) {
    this.log(LogLevel.INFO, message, context, requestId);
  }

  debug(message: string, context?: any, requestId?: string) {
    this.log(LogLevel.DEBUG, message, context, requestId);
  }

  // Request logging
  logRequest(req: any, res: any, next: any) {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const requestId = req.headers['x-request-id'];
      
      this.info('HTTP Request', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      }, requestId);
    });
    
    next();
  }

  // Error logging
  logError(error: any, req?: any) {
    const requestId = req?.headers['x-request-id'];
    
    this.error('Application Error', {
      message: error.message,
      stack: error.stack,
      url: req?.url,
      method: req?.method,
      body: req?.body,
      params: req?.params,
      query: req?.query,
    }, requestId);
  }
}

export const logger = new Logger(); 