import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async find(ctx: any) {
    // COMMENTED OUT: View count increment logic - now only handled by custom endpoint
    // Only increment view count if this is a request for a specific post
    // Check if there's a slug filter with exact match (indicating a single post request)
    // const slug = ctx.query?.filters?.slug?.$eq;

    // if (slug) {
    //   // This is a request for a specific post by slug, so increment view count
    //   const [publishedPost] = await strapi.documents('api::post.post').findMany({
    //     filters: { slug },
    //     fields: ['views', 'publishedAt'],
    //     status: 'published',
    //     limit: 1,
    //   });

    //   if (publishedPost) {
    //     const newViewCount = (publishedPost.views || 0) + 1;

    //     try {
    //       // Update the draft version first
    //       await strapi.documents('api::post.post').update({
    //         documentId: publishedPost.documentId,
    //         data: {
    //           views: newViewCount,
    //         },
    //       });

    //       // Then update and publish to keep both versions in sync
    //       await strapi.documents('api::post.post').update({
    //         documentId: publishedPost.documentId,
    //         data: {
    //           views: newViewCount,
    //         },
    //         status: 'published',
    //       });
    //     } catch (error) {
    //       strapi.log.error('Failed to update view count for post:', publishedPost.documentId, error);
    //     }
    //   }
    // }

    // Return the normal response (no view count increment here anymore)
    const response = await super.find(ctx);
    return response;
  },

  // Custom endpoint to increment view count by slug
  async incrementView(ctx: any) {
    const { slug } = ctx.params;

    if (!slug) {
      return ctx.badRequest('Slug parameter is required');
    }

    try {
      // Find the published post by slug
      const [publishedPost] = await strapi.documents('api::post.post').findMany({
        filters: { slug },
        fields: ['slug', 'views', 'publishedAt'],
        status: 'published',
        limit: 1,
      });

      if (!publishedPost) {
        return ctx.notFound('Post not found');
      }

      const newViewCount = (publishedPost.views || 0) + 1;

      // Update the draft version first
      await strapi.documents('api::post.post').update({
        documentId: publishedPost.documentId,
        data: {
          views: newViewCount,
        },
      });

      // Then update and publish to keep both versions in sync
      await strapi.documents('api::post.post').update({
        documentId: publishedPost.documentId,
        data: {
          views: newViewCount,
        },
        status: 'published',
      });

      // Return success response with updated view count
      return ctx.send({
        success: true,
        message: 'View count incremented successfully',
        data: {
          slug: publishedPost.slug,
          views: newViewCount,
        },
      });

    } catch (error) {
      strapi.log.error('Failed to increment view count:', error);
      return ctx.internalServerError('Failed to increment view count');
    }
  },
}));
