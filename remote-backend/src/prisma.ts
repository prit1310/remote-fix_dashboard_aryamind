const { PrismaClient } = require('@prisma/client');

/**
 * Add this block for TypeScript
 */
declare global {
  var prisma: any;
}

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;