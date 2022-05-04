export const getPosts = (req, res, next) => {
  return res.status(200).json({
    posts: [
      {
        title: "First Title",
        content: "I am working as a solutions engineer at C3.ai",
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
    },
  });
};
