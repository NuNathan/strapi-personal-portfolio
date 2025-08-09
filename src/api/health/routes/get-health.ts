/**
 * Custom route for health check
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/get-health',
      handler: 'health.getHealth',
      config: {
        auth: false, // Disable authentication for this route
        policies: [],
        middlewares: [],
      },
    },
  ],
};
