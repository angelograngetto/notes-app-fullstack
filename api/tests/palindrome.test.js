const {palindrome} = require('../utils/for_testing')

test.skip('palindrome of midudev', () => {
    const result = palindrome('midudev')

    expect(result).toBe('vedudim')
})

test.skip('palindrome of undefined', () => {
    const result = palindrome()

    expect(result).toBeUndefined()
})