export const getPosts = (req, res, next) => {
  return res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Title",
        imageUrl: "images/pic1.png",
        content: "I am working as a solutions engineer at C3.ai",
        createdAt: Date.now(),
        creator: {
          name: "Hippolyte",
        },
      },
    ],
  });
};

export const createPost = (req, res, next) => {
  const { title, content } = req.body;
  return res.status(201).json({
    message: "Post successfully created",
    post: {
      title,
      content,
      creator: {
        name: "Hippolyte"
      },
      createdAt: Date.now()
    },
  });
};
