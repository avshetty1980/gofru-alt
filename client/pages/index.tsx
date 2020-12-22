import { withApollo } from "../utils/withApollo"

import LinkNext from "next/link"
import { useProfilesQuery } from "../generated/graphql";
import { LayoutTemplate } from "../components/LayoutTemplate";

const Index = () => {
  const { data } = useProfilesQuery({
    variables: {
      limit: 10,
    },
  })
return (
<LayoutTemplate>
  <LinkNext href="/create-profile">
  <a>Create Profile</a>
  </LinkNext>
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
</LayoutTemplate>
)
}

export default withApollo({ ssr: true}) (Index)
