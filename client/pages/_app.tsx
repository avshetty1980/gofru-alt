import 'antd/dist/antd.css'
import '../styles/vars.css'
import '../styles/global.css'
//import { withApollo } from 'next-apollo'

// const client = new ApolloClient({
//   link: new HttpLink({
//   uri: "http://localhost:4000/graphql",  
//   credentials: "include",
//   }),
  
//   cache: new InMemoryCache(),

// });
// if(client) {
//   console.log("client")
// } else {
//   console.log("no client")
// }


function MyApp({ Component, pageProps }: any) {
   //const client = useApollo()
  return (
    // <ApolloProvider client={client}>
    <Component {...pageProps} />
    // </ApolloProvider>
  
  )
}

export default MyApp
