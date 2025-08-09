/**
 * health controller
 */

export default {
  async getHealth(ctx: any) {
    try {
      // Get current timestamp
      const timestamp = new Date().toISOString();
      
      // Get Strapi version and basic info
      const strapiVersion = strapi.config.get('info.strapi') || 'unknown';
      const nodeVersion = process.version;
      const environment = strapi.config.get('environment') || 'unknown';
      
      // Return health status
      return ctx.send({
        status: 'ok',
        message: 'Strapi is alive and running',
        timestamp,
        data: {
          strapi: {
            version: strapiVersion,
            environment,
          },
          node: {
            version: nodeVersion,
          },
          uptime: process.uptime(),
        },
      });
    } catch (error) {
      strapi.log.error('Health check failed:', error);
      return ctx.internalServerError({
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
      });
    }
  },
};
