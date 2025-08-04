/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export const DemoResponseSchema = {
  message: "string"
};

/**
 * User related schemas
 */
export const UserSchema = {
  id: "string",
  name: "string",
  email: "string",
  bio: "string", // optional
  joinedAt: "string"
};

export const AuthResponseSchema = {
  message: "string",
  user: UserSchema,
  token: "string"
};

export const RegisterRequestSchema = {
  name: "string",
  email: "string",
  password: "string",
  bio: "string" // optional
};

export const LoginRequestSchema = {
  email: "string",
  password: "string"
};

/**
 * Post related schemas
 */
export const PostSchema = {
  id: "string",
  content: "string",
  author: {
    id: "string",
    name: "string",
    email: "string"
  },
  createdAt: "string",
  likes: "number",
  comments: "number"
};

export const CreatePostRequestSchema = {
  content: "string"
};

export const PostsResponseSchema = {
  posts: [PostSchema]
};

export const CreatePostResponseSchema = {
  message: "string",
  post: PostSchema
};

/**
 * API Error Response
 */
export const ApiErrorSchema = {
  message: "string",
  errors: [] // optional
};
