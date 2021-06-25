const axios = require("axios");

const extractVideoUrl = (obj) => {
  if (!obj) return null;
  if (obj.reddit_video) {
    return obj.reddit_video.fallback_url;
  } else return null;
};

const shuffleArray = (arr = []) => {
  let length = arr.length;
  if (!length) return null;
  let i;
  while (length) {
    i = Math.floor(Math.random() * length--);
    [arr[length], arr[i]] = [arr[i], arr[length]];
  }
  return arr;
};

class Reddit {
  constructor(subreddit, type) {
    const types = ["hot", "new", "top", "rising"];
    if (!types.includes(type)) throw "invalid subreddit type";
    this.URL = `https://www.reddit.com/r/${subreddit}/${type}.json`;
  }
  async isValid() {
    try {
      const response = await axios.get(this.URL);
      if (!response.data.data.dist) return 0;
      else {
        const post_hint = response.data.data.children[2].data.post_hint;
        if (!post_hint) return 2;
        const over_18 = response.data.data.children[2].data.over_18;
        if (over_18) return 3;
        return 1;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async getPosts(count = 26) {
    try {
      const { data } = await axios.get(`${this.URL}?limit=${count}`);
      if (!data || !data.data.dist) return null;

      const items = data.data.children;

      const posts = items
        .filter(
          (item) =>
            item.data.url_overridden_by_dest !== undefined &&
            item.data.post_hint !== undefined &&
            item.data.post_hint !== "link"
        )
        .map((post) => ({
          id: post.data.id,
          post_hint: post.data.post_hint,
          title: post.data.title,
          url: post.data.url_overridden_by_dest,
          permalink: `https://www.reddit.com${post.data.permalink}`,
          media: extractVideoUrl(post.data.media),
          is_video: post.data.is_video,
        }));
      return shuffleArray(posts);
    } catch (error) {
      console.log("could not fetch subreddit");
      return null;
    }
  }
}

module.exports = Reddit;
