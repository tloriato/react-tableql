import React from 'react'
import { render, cleanup } from 'react-testing-library'
import { MockedProvider } from 'react-apollo/test-utils'
import gql from 'graphql-tag'
import '@babel/polyfill' // TODO: not ideal find the way to move it globally, webpack

import { ApolloTableQL } from '../index'
import { testMocks } from '../../__mocks__/mocks'
import { GET_ALL_FILMS } from '../../__mocks__/queries'

const Default = () => <ApolloTableQL query={GET_ALL_FILMS} />
const Pagination = () => <ApolloTableQL query={GET_ALL_FILMS} pagination />
const CustomColumn = () => (
  <ApolloTableQL
    query={GET_ALL_FILMS}
    columns={[
      { id: 'episodeID', label: 'Episode Identification' },
      'releaseDate',
      'title',
    ]}
  />
)

// async helper function. crete an additional tick in the event loop to make sure everything goes as expected
const wait = time => new Promise(resolve => setTimeout(resolve, time))

describe('<ApolloTableQL>', () => {
  afterEach(cleanup)

  it('testing loading state', () => {
    const { container } = render(
      <MockedProvider mocks={testMocks} addTypename={false}>
        <ApolloTableQL query={GET_ALL_FILMS} />
      </MockedProvider>,
    )

    expect(container).toMatchSnapshot()
  })

  it('snapshot default', async () => {
    const { container } = render(
      <MockedProvider mocks={testMocks} addTypename={false}>
        <Default />
      </MockedProvider>,
    )

    await wait(0)

    expect(container).toMatchSnapshot()
  })

  it('snapshot default pagination', async () => {
    const { container } = render(
      <MockedProvider mocks={testMocks} addTypename={false}>
        <Pagination />
      </MockedProvider>,
    )

    await wait(0)

    expect(container).toMatchSnapshot()
  })

  it('snapshot custom columns', async () => {
    const { container } = render(
      <MockedProvider mocks={testMocks} addTypename={false}>
        <CustomColumn />
      </MockedProvider>,
    )

    await wait(0)

    expect(container).toMatchSnapshot()
  })

  it('pass gql`query`', async () => {
    const { container } = render(
      <MockedProvider mocks={testMocks} addTypename={false}>
        <ApolloTableQL query={gql(GET_ALL_FILMS)} />
      </MockedProvider>,
    )

    await wait(0)

    expect(container).toMatchSnapshot()

    expect(container.querySelector('tbody').querySelectorAll('tr')).toBeTruthy()
    expect(container.querySelector('tbody').querySelectorAll('tr').length).toBe(
      7,
    )

    expect(container.querySelector('thead').querySelector('tr')).toBeTruthy()
    expect(
      container
        .querySelector('thead')
        .querySelector('tr')
        .querySelectorAll('th').length,
    ).toBe(3)
  })
})