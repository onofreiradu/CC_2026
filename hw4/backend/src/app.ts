import 'dotenv/config';
import { config } from './config';
import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { db } from './db/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const PORT = config.server.port;

const app: Application = express();

app.set('trust proxy', 1);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (config.cors.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello from App Engine!');
});

async function start(): Promise<void> {
  try {
    const result = await db.query<{ connected: number }>('select 1 as connected');
    console.log('Database connection successful:', result.rows[0]);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

void start();