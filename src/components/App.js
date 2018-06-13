import React, { Component } from 'react';
import { ApolloProvider, Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import Grid from './Grid';
import '../css/App.css';

const networkLink = createHttpLink({ uri: 'http://localhost:8008/' });
const cache = new InMemoryCache();
const link = ApolloLink.from([networkLink]);
const apolloClientInstance = new ApolloClient({ cache, link });

const query = gql`
  query allGridData {
    gridSquares {
      cuid
      id
      number
      shown
      guess
      upperNeighbor
      rightNeighbor
      lowerNeighbor
      leftNeighbor
      relationships
    }
  }
`;

const mutation = gql`
  mutation SetGridSquareValueMutation($gridSquareId: Int!, $value: Int) {
    setGridSquareValue(gridSquareId: $gridSquareId, value: $value) {
      cuid
      id
      guess
    }
  }
`;

class App extends Component {
  state = {
    selectedGridSquareId: null,
  };

  selectGridSquare = (gridSquareId) => {
    this.setState({
      selectedGridSquareId: gridSquareId,
    });
  };

  render() {
    return (
      <ApolloProvider client={apolloClientInstance}>
        <div>
          <Query query={query}>
            {({ data, error, loading, client }) =>
              error || loading || !data ? null : (
                <Mutation mutation={mutation}>
                  {(setGridSquareValue) => (
                    <Grid
                      gridSquares={data.gridSquares}
                      selectedGridSquareId={this.state.selectedGridSquareId}
                      selectGridSquare={this.selectGridSquare}
                      setGridSquareValue={setGridSquareValue}
                      {...{ client }}
                    />
                  )}
                </Mutation>
              )
            }
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
