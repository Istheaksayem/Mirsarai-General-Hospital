import http from 'http';
import { setServers } from 'node:dns/promises';
import cron from 'node-cron';
import app from './src/app.js';
import env from './src/config/env.js';
import connectDatabase from './src/config/database.js';
import { seedDefaultAdmins } from './src/scripts/seedDefaultAdmins.js';
import { setupSocket } from './src/socket/index.js';
import { startReminderCron } from './src/services/cron.service.js';

// Set custom DNS servers for reliable resolution (Cloudflare + Google)
setServers(['1.1.1.1', '8.8.8.8']);

/**
 * Start the Express server with Socket.IO
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Ensure default super admin accounts exist
    await seedDefaultAdmins();

    // Create HTTP server from Express app
    const server = http.createServer(app);

    // Attach Socket.IO
    setupSocket(server);

    // Start cron jobs
    startReminderCron();

    // Start listening
    server.listen(env.port, () => {
      console.log('');
      console.log('='.repeat(50));
      console.log(`🚀 Server running in ${env.nodeEnv} mode`);
      console.log(`📡 Listening on port ${env.port}`);
      console.log(`🌐 API: http://localhost:${env.port}/api/v1`);
      console.log(`🔌 Socket.IO: ws://localhost:${env.port}`);
      console.log('='.repeat(50));
      console.log('');
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Closing server gracefully...`);
      server.close(async () => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ UNHANDLED REJECTION! Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
