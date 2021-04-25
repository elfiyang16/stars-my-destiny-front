### わが征くは星の大海

_ふたりは長椅子にならんですわり、透過壁ごしに星の大海をながめやった。いままで彼らが渡ってきた海であり、これから彼らが征こうとする海であった。星々はきらめき、波だち、沸騰するエネルギーの無音の潮騒を、ラインハルトの意識野に投げかけてくる。_

---田中芳樹

Playground GraphQL App using SpaceXAPI (https://github.com/SpaceXLand/api). (_Note that the endPoint is split into a self hosted one on port 6688 as well as a 3rd party GraphQL one on https://api.spacex.land/graphql/_)

The purpose of this project is not to create a magnificent frontend but more to cover all the important concepts in listed in Apollo Docs-Apollo Client React (https://www.apollographql.com/docs/react/). As what I found difficult during learning GraphQL is not in any specific topics e.g. Cache, HttpLink, but a mono project that covers all these topics.

Feel free to the check the backend part of this project at (https://github.com/elfiyang16/The-Stars-My-Destination)

##### List of Features

- [x] Fetching: queries, mutations, fragments, error handling
- [x] Caching: cache policies, read & write, field level middleware, & other advanced
- [x] Pagination: relay style
- [x] Local state: reactive variables
- [x] Networking: HttpLink split, concat, intercept response, errorHandling, etc.
- [x] Performance: optimistic mutation, cache redirect
- [x] Schema types: graphql-codegen
- [x] Other configs: Eslint, ApolloClient, React Hooks

##### Set up and Run

The project is developed on React with Next.Js using TypeScript (4.1).

To install: `npm install`.
To generate the latest schema types: `npm run gen`.
To run in dev: `npm run dev`, the port is open on `5000`.
To build and run the built version `npm run build && npm run start`
