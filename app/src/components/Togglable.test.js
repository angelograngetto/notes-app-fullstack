import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {fireEvent, render} from '@testing-library/react'
import Togglable from './Togglable'

describe('<Togglable/>', () => {
    const buttonLabel = 'show'
    let component

    beforeEach(() => {
        component = render(
            <Togglable buttonLabel={buttonLabel}>
                <div>testDivContent</div>
            </Togglable>
        )
    })

    test('renders its children', () => {
        component.getByText('testDivContent')
    })

    test('renders its children but they are not visible', () => {
        const el = component.getByText('testDivContent')
        expect(el.parentNode).toHaveStyle('display: none')
    })

    test('after clicking its children must be shown ', () => {
        const button = component.getByText(buttonLabel)
        fireEvent.click(button)
        const el = component.getByText('testDivContent')
        expect(el.parentNode).not.toHaveStyle('display: none')
    })

    test('toggled content can be closed', () => {
        const el = component.getByText('testDivContent')
        const button = component.getByText(buttonLabel)
        fireEvent.click(button)
        const cancelButton = component.getByText('Cancel')
        fireEvent.click(cancelButton)
        expect(el.parentNode).toHaveStyle('display: none')
        
    })
})