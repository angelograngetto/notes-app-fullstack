
describe('Note app', ()=>{
    beforeEach(()=>{
        cy.visit('http://localhost:3000')
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Angelo',
            username: 'angelograngetto',
            password: 'angelogranA1'
        }
        cy.request('POST', 'http://localhost:3001/api/users', user)
    })
    it('frontpage can be opened', () => {
        cy.contains('Notes')
    })
  
    it('login form can be opened', () => {
        cy.contains('Show login').click()
    })

    it('user can login', () => {
        cy.contains('Show login').click()
        cy.get('[name="Username"]').type('angelograngetto')
        cy.get('[name="Password"]').type('angelogranA1')
        cy.contains('Login').click()
        cy.contains('Create a new note')
    })

    it('login fails with wrong password', () => {
        cy.contains('Show login').click()
        cy.get('[name="Username"]').type('angelograngetto')
        cy.get('[name="Password"]').type('passincorrectaxd')
        cy.contains('Login').click()
        cy.get('.error')
            .should('contain', 'Wrong credentials')
    })

    describe('when logged in', () => {
        beforeEach(() => {
          cy.login({ username: 'angelograngetto', password: 'angelogranA1' })
        })
    
        it('a new note can be created', () => {
          const noteContent = 'a note created by cypress'
          cy.contains('Show Create Note').click()
          cy.get('input').type(noteContent)
          cy.contains('save').click()
          cy.contains(noteContent)
        })

        describe('and a note exists', () => {
            beforeEach(()=> {
                cy.createNote({content: 'This is the first note', important:false})
                cy.createNote({content: 'This is the second note', important:false})
                cy.createNote({content: 'This is the third note', important:false})

            })
            it('it can be made important', ()=>{
                cy.contains('This is the first note').as('thenote')
                cy.get('@thenote').contains('make important').click()
                cy.get('@thenote').contains('make not important')
            })
        })
    })
})