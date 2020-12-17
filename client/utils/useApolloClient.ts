import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

let apolloClient: ApolloClient<NormalizedCacheObject>

const createApolloClient = () => {
    const client = new ApolloClient({
        link: new HttpLink({
        uri: "http://localhost:4000/graphql",  
        credentials: "include",
    }),
  
    cache: new InMemoryCache(),

    });
    if(client) {
        console.log("client")
    } else {
        console.log("no client")
    }
    return client
}

export const initializeApollo = () => {
    apolloClient = apolloClient ?? createApolloClient()
    return apolloClient
}

export const useApollo = () => {
    return initializeApollo()
}