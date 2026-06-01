import express from "express";
import Blog from "../models/blog.js";
const blogsRouter = express.Router();
import User from "../models/user.js";
import jwt from 'jsonwebtoken'
import { SECRET } from '../utils/config.js'

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.get("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.post("/", async (req, res) => {
  const { title, author, url, likes } = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  // const user = await User.findById(userId); // prueba de blog creado por usuario

  // if (!user) {
  //   return res.status(400).json({
  //     error: "invalid user",
  //   });
  // }

  if (!title || !url) {
    return res.status(400).json({
      error: "title or url missing",
    });
  }

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
    user: user.id, // prueba de blog creado por usuario
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id); // prueba de blog creado por usuario
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  try {
    const { title, author, url, likes } = req.body;

    const blog = {
      title,
      author,
      url,
      likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
      new: true,
      runValidators: true,
      context: "query",
    }).populate("user", {
      username: 1,
      name: 1,
    });

    res.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
