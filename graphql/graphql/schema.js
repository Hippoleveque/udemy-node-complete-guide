import { buildSchema } from "graphql";

export default buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        updatedAt: String!
        createdAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        userId: String!
        token: String!
    }

    type PostsData {
        posts: [Post!]!
        totalItems: Int!
    }

    type StatusData {
        status: String
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootMutation {
        createUser(inputData: UserInputData!): User
        createPost(inputData: PostInputData!): Post
        updatePost(postId: String!, inputData: PostInputData!): Post!
        deletePost(postId: String!): Post!
        updateStatus(newStatus: String!): User!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(page: Int): PostsData
        post(postId: String!): Post!
        status: String
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);
