const got = require("got");

class NineGag {
  constructor(section) {
    this.baseurl = `https://9gag.com/v1/group-posts/group/${section}/type/hot`;
  }

  async isSectionValid() {
    try {
      const response = await got(this.baseurl);
      const status = JSON.parse(response.body).meta["status"];
      if (status === "Success") {
        return true;
      }
      return status;
    } catch (error) {
      // console.log("error");
      return false;
    }
  }

  async getGroupPosts(url) {
    try {
      const response = await got(url);
      var obj = JSON.parse(response.body).data;
      return obj;
    } catch (error) {
      // console.log("error");
      return null;
    }
  }
  async getNextCursor(url) {
    try {
      const response = await got(url);
      var obj = JSON.parse(response.body).data.nextCursor;
      return obj;
    } catch (error) {
      console.log("error");
    }
  }

  async getMultiPost(count) {
    if (count > 20) {
      return undefined;
    }

    const data = await this.getGroupPosts(this.baseurl);
    if (data === null) {
      return null;
    }
    var PostList = data.posts.slice(1);

    var nextCursor = data.nextCursor;

    for (var i = 0; i < count; i++) {
      const newurl = `${this.baseurl}?${nextCursor}`;
      const data2 = await this.getGroupPosts(newurl);
      var PostList2 = data2.posts;
      nextCursor = data2.nextCursor;
      PostList2.map((ele, index) => {
        PostList.push(ele);
      });
    }

    PostList = PostList.sort(function (a, b) {
      return b.upVoteCount - a.upVoteCount;
    });
    return PostList;
  }

  async getRandomPost(Total) {
    const Posts = await this.getMultiPost(Total);
    if (Posts === null) {
      return null;
    }
    const maxPosts = 9 + 10 * Total;
    const i = this.randomNumber(0, maxPosts);

    const Post = {
      id: Posts[i]["id"],
      url: Posts[i]["url"],
      title: Posts[i]["title"],
      description: Posts[i]["description"],
      type: Posts[i]["type"],
    };

    if (Post["type"] === "Photo") {
      try {
        Post["content"] = Posts[i]["images"]["image700"]["url"];
      } catch (err) {
        console.log(err);
        console.log(Post);
      }
    } else {
      try {
        Post["content"] = Posts[i]["images"]["image460sv"]["url"];
      } catch (err) {
        console.log(err);
        console.log(Post);
      }
    }
    return Post;
  }
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}

module.exports = NineGag;
