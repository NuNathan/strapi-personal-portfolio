/**
 * Custom route for incrementing post view count
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/posts/:slug/increment-view',
      handler: 'post.incrementView',
      config: {
        auth: false, // Disable authentication for this route
        policies: [],
        middlewares: [],
      },
    },
  ],
};
