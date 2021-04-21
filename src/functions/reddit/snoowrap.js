const snoowrap = require("snoowrap");

const r = new snoowrap({
  userAgent: "udility",
  clientId: "8C5Qy2CrzI0jUQ",
  clientSecret: "cjPr4wLfm04vuQnxLGJonUtuA9uTew",
  refreshToken: "68663730379-2A3tNVSWMrFB7M2p7Ktkw5Kcp_VxBw",
});

const extractVideoUrl = (obj) => {
  if (!obj) return null;
  if (obj.reddit_video) {
    return obj.reddit_video.fallback_url;
  } else return null;
};

const fetchHotPosts = async (subreddit, limit) => {
  try {
    const posts = await r
      .getHot(subreddit, { limit: limit })
      .filter((post) => post.url_overridden_by_dest !== undefined)
      .map((post) => ({
        id: post.id,
        title: post.title,
        url: post.url_overridden_by_dest,
        permaLink: post.permalink,
        url2: post.url,
        media: extractVideoUrl(post.media),
        is_video: post.is_video,
      }));
    if (!posts || posts.length < limit) return null;
    return posts;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { fetchHotPosts };
