import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async find(ctx: any) {
    const slug = ctx.query?.filters?.slug?.$eq;

    if (slug) {
      // First, find the published version of the post
      const [publishedPost] = await strapi.documents('api::post.post').findMany({
        filters: { slug },
        fields: ['views', 'publishedAt'],
        status: 'published', // Explicitly get the published version
        limit: 1,
      });

      if (publishedPost) {
        const newViewCount = (publishedPost.views || 0) + 1;

        // Update the draft version first
        await strapi.documents('api::post.post').update({
          documentId: publishedPost.documentId,
          data: {
            views: newViewCount,
          },
        });

        // Then update and publish to keep both versions in sync
        // This ensures the published version also gets the updated view count
        await strapi.documents('api::post.post').update({
          documentId: publishedPost.documentId,
          data: {
            views: newViewCount,
          },
          status: 'published', // This updates and publishes in one operation
        });
      }
    }

    const response = await super.find(ctx);
    return response;
  },
}));
