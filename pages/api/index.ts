import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const API_URL = "https://api-mumbai.lens.dev";

export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});
