import prisma from "../../DB/db.config";
import blogController from "../../modules/blog/blog.controller";
import { newBlogPost, blogLists } from "./dummyTestData";

describe("Blog Controller Test Cases", () => {

  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Get all blogs", () => {
    it("returns all the posted blogs", async () => {
      jest.clearAllMocks();
      jest.spyOn(prisma.blog, "findMany").mockResolvedValue(blogLists);
      const newBlog = await blogController.blogData();

      // console.log(newBlog, "New Blog Test")
      expect(newBlog).toEqual(blogLists);
    });
  });

  describe("Get blog using id", () => {
    it("returns a particular blog using id", async () => {
      jest.clearAllMocks();
      jest.spyOn(prisma.blog, "findUnique").mockResolvedValue(newBlogPost);
      const id = 19;
      const newBlog = await blogController.blogDataId(id);
      // console.log(newBlog, "New Blog Test");
      expect(newBlog).toBeDefined();
      expect(prisma.blog.findUnique).toHaveBeenCalledWith({
        where: {
          id: id
        }
      });
    });
  });

  describe("Create a new blog", () => {
    it("creates a new blog", async () => {
      jest.clearAllMocks();
      jest.spyOn(prisma.blog, "create").mockResolvedValue(newBlogPost);
      const newBlog = await blogController.blogCreate(newBlogPost);
      expect(newBlog).toEqual(newBlogPost);
      expect(prisma.blog.create).toHaveBeenCalledWith({
        data: newBlogPost
      });
    });
  });

  describe("Update a blog using id", () => {
    it("updates an existing blog using id", async () => {
      jest.clearAllMocks();
      const createdAt = new Date();
      const blogUpdateData = {
        id: newBlogPost.id,
        createdAt,
        title: "TypeScript Updated One",
        author: "Liza Updated",
        likes: 2,
        url: "https://zod.dev/?id=optionals",
        userId: 3
      };
      jest.spyOn(prisma.blog, "update").mockResolvedValue(blogUpdateData);
      const updatedBlog = await blogController.blogUpdate(newBlogPost.id,blogUpdateData);
      expect(updatedBlog).toEqual(blogUpdateData);
      expect(prisma.blog.update).toHaveBeenCalledWith({
        where: {
          id:  newBlogPost.id
        },
        data: blogUpdateData
      });
    });
  });

  describe("delete a blog using id", () => {
    it("deletes a particular blog using id", async () => {
      jest.clearAllMocks();
      jest.spyOn(prisma.blog, "delete").mockResolvedValue(newBlogPost);
      const blogDeleted = await blogController.blogDelete(newBlogPost.id);
      expect(blogDeleted).toEqual(newBlogPost);
      expect(prisma.blog.delete).toHaveBeenCalledWith({
        where: { 
          id: newBlogPost.id 
        },
      });
    });
  });

});