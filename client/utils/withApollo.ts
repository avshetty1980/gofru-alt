import { withApollo as createWithApollo} from "next-apollo";
import { 
  HttpLink,
  ApolloClient,
  InMemoryCache,
   
} from '@apollo/client'
import { NextPageContext } from "next"

const client = (ctx: NextPageContext) => 
  new ApolloClient({
  ssrMode: typeof window === "undefined",
 link: new HttpLink({
  uri: "http://localhost:4000/graphql",  
  credentials: "include",  
  headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
   }),
  
  cache: new InMemoryCache(),

});


export const withApollo = createWithApollo(client);