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

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(inputData: UserInputData): User
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);
