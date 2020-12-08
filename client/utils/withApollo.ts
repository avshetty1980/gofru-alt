import { withApollo as createWithApollo } from "next-apollo";
import { 
  HttpLink,
  ApolloClient,
  InMemoryCache 
} from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
  uri: "http://localhost:4000/graphql",  
  credentials: "include",
  }),
  
  cache: new InMemoryCache(),

});
if(!client) {
  console.log(client)
} else {
  console.log("no client")
}

export const withApollo = createWithApollo(client);