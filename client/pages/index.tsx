import { withApollo } from "../utils/withApollo"

import { NavBar } from "../components/NavBar" 
import { useProfilesQuery } from "../generated/graphql";

const Index = () => {
  const { data } = useProfilesQuery()
return (
<>
  <NavBar />
  <br />
  <div>
    Hello Akshay Shetty from Index page
  </div>
  <br />
  {!data ? 
    <div>Loading...</div> :
     data.profiles.map( profile => 
      <div key={profile.id}>
        {profile.firstname}
      </div>
      )
  }
</>
)
}

export default withApollo({ ssr: true}) (Index)
