import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import Checkbox from '@material-ui/core/Checkbox'
import ListPanel from '../src/components/list-panel'
import { sortedTodoList, TestContentCollection } from './_mocks_/test_contents'

describe('The list panel layout instance', () => {
  let wrapper: any
  let repo: any
  const TodoItems = {
    data: TestContentCollection,
    setData: jest.fn(),
  }
  beforeEach(() => {
    window.fetch = function fetchMethod() {
      return Promise.resolve({ d: TestContentCollection } as any)
    }
    repo = new Repository()
    repo.loadCollection = function fetchMethod() {
      return Promise.resolve({ d: { results: TestContentCollection } } as any)
    }
    repo.load = function loadMethod() {
      return Promise.resolve({ d: { results: TestContentCollection } } as any)
    }
    repo.patch = function patchMethod() {
      return Promise.resolve('completed')
    }
  })

  it('should renders correctly', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <ListPanel {...(TodoItems as any)} />
        </RepositoryContext.Provider>,
      )
    })

    expect(wrapper.update()).toMatchSnapshot()
  })

  it('should toggle todo', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <ListPanel {...(TodoItems as any)} />
        </RepositoryContext.Provider>,
      )
    })

    const checkbox = wrapper.update().find(Checkbox)

    await act(async () => {
      ;(checkbox.at(0).prop('onClick') as any)()
    })

    expect(TodoItems.setData).toBeCalledWith(sortedTodoList)
  })
})
