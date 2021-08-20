import { pubsub } from "./redis";

const POST_ADDED = "POST_ADDED";

export const resolvers = {
  Subscription: {
    postAdded: {
      // The client may request `Post` fields that are not resolvable from the
      // payload data that was included in `pubsub.publish()`, so we must
      // provide some mechanism to fetch those additional fields when requested
      resolve(payload, args, { dataSources: { gatewayApi } }, info) {
        console.log('postAdded.resolve payload', payload)
        return gatewayApi.fetchAndMergeNonPayloadPostData(
          payload.postAdded.id,
          payload,
          info
        );
      },
      subscribe(_, args) {
        console.log('Subscribe to `POST_ADDED` in the shared Redis instance')
        // Subscribe to `POST_ADDED` in the shared Redis instance
        const it = pubsub.asyncIterator([POST_ADDED]);
        console.log('pubsub.subscriptionMap ********', pubsub.subscriptionMap)
        return it
      }
    }
  }
};
