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

        // Update BOTH draft and published versions to keep them in sync
        // This ensures consistency across both versions

        // Update all entries with the same documentId (both draft and published)
        await strapi.db.query('api::post.post').updateMany({
          where: {
            documentId: publishedPost.documentId
          },
          data: {
            views: newViewCount,
          },
        });
      }
    }

    const response = await super.find(ctx);
    return response;
  },
}));
