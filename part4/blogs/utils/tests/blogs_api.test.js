import { beforeEach, test, after, describe } from "node:test";
import supertest from "supertest";
import assert from "node:assert";
import mongoose from "mongoose";
import app from "../../app.js";
import Blog from "../../models/blog.js";
import User from "../../models/user.js";
import { initialBlogs, blogsInDb } from "./test_helper.js";
import bcrypt from "bcrypt";

const api = supertest(app);

let testUser;
let token;


beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('secret', 10)

  testUser = await User.create({
    username: "andres123",
    name: "Andres",
    passwordHash: passwordHash,
  });

  await api
    .post('/api/users')
    .send({
      username: 'andres123',
      name: 'Andres',
      password: 'secret'
    })

  const loginResponse = await api
  .post('/api/login')
  .send({
    username: 'andres123',
    password: 'secret'
  })

  token = loginResponse.body.token

  for (const blog of initialBlogs) {
    await Blog.create({
      ...blog,
      user: testUser._id
    })
  }
})


describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, initialBlogs.length);
  });
});

describe("viewing a specific blog", () => {
  test("succeeds with a valid id", async () => {
    const blogsAtStart = await blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(resultBlog.body.id, blogToView.id);
    assert.strictEqual(resultBlog.body.title, blogToView.title);
    assert.strictEqual(resultBlog.body.author, blogToView.author);
    assert.strictEqual(resultBlog.body.url, blogToView.url);
    assert.strictEqual(resultBlog.body.likes, blogToView.likes);
  });

  test("blogs have a unique identifier named id", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];

    assert(blog.id !== undefined);
    assert.strictEqual(blog._id, undefined);
  });
});

describe("addition of a new blog", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Second blog",
      author: "Jane Doe",
      url: "https://example.com/second",
      likes: 10,
      // userId: testUser.id,
    };

    await api
      .post(`/api/blogs/`)
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const titles = response.body.map((r) => r.title);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);

    assert(titles.includes("Second blog"));
  });
});

test("if likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Blog without likes",
    author: "Andres",
    url: "https://example.com",
    // userId: testUser.id,
  };

  const response = await api
    .post("/api/blogs")
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "Andres",
    url: "https://example.com",
    likes: 5,
  };

  await api.post("/api/blogs")
  .send(newBlog)
  .set('Authorization', `Bearer ${token}`)
  .expect(400);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blog without url is not added", async () => {
  const newBlog = {
    title: "Missing URL",
    author: "Andres",
    likes: 5,
  };

  await api.post("/api/blogs")
  .send(newBlog)
  .set('Authorization', `Bearer ${token}`)
  .expect(400);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

describe("deletion of a blog", () => {
  test("a blog can be deleted", async () => {
    const blogsAtStart = await api.get("/api/blogs");

    const blogToDelete = blogsAtStart.body[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await api.get("/api/blogs");

    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1);

    const titles = blogsAtEnd.body.map((blog) => blog.title);

    assert(!titles.includes(blogToDelete.title));
  });
});

describe("updating a blog", () => {
  test("a blog can be updated", async () => {
    const blogsAtStart = await api.get("/api/blogs");

    const blogToUpdate = blogsAtStart.body[0];

    const updatedData = {
      ...blogToUpdate,
      likes: 100,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 100);
  });
});

test('adding a blog fails with status code 401 if token is not provided', async () => {


  const newBlog = {
    title: 'Blog without token',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await blogsInDb()

  assert.strictEqual(
    blogsAtEnd.length,
    initialBlogs.length
  )
})

after(async () => {
  await mongoose.connection.close();
});
