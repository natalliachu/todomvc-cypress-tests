const TODO_PLACEHOLDER = 'What needs to be done?'
const SAMPLE_TODO = 'peel a pineapple'
const LONG_TEXT_TODO = require("lorem-ipsum").loremIpsum({unit: 'sentences', count: 2})
const SPECIAL_SYMBOLS_TODO = '🥳💜🐶☕️'
const NON_LATIN_TODO = 'נטשהпривет'

describe('Create todos', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('input.new-todo').as('newToDoInput')
    })

    it('should create a simple todo - positive case', () => {
        /* 
        This is a basic positive test case where I make sure that a todo is added correctly,
        the counter is displayed and equals 1, the placeholder is disaplayed in input field again,
        the checkbox is unchecked and remove button exists (but not visible by default)
        */

        cy.get('@newToDoInput')
            .invoke('attr','placeholder')
            .should('contain', TODO_PLACEHOLDER)
        cy.get('@newToDoInput')
            .click()
            .type(`${SAMPLE_TODO}{enter}`)

        cy.log('make sure that the item is added sucsessfully')
        cy.get('.todo-list')
            .should('be.visible')
            .find('li')
            .should('have.length', 1)
            .and('contain', SAMPLE_TODO)
            .find('[type=checkbox]')
            .should('not.be.checked')
            .parent()
            .find('.destroy')
            .should('exist')
            .and('not.be.visible') //The logic of using Remove button is the part of Delete tests

        cy.get('.todo-count')
            .should('be.visible')
            .and('contain', '1 item left')
        
        cy.log('make sure input field is in default stage')
        cy.get('@newToDoInput')
            .invoke('attr', 'placeholder')
            .should('contain', TODO_PLACEHOLDER)
    })

    it('should create todo with different data type - field validations', () => {
        /* 
        I decided to put all input field validations in one test 
        and not to create "tiny" tests with a single assertion case 
        following by Cypress Best Practices: 
        https://docs.cypress.io/guides/references/best-practices.html#Creating-%E2%80%9Ctiny%E2%80%9D-tests-with-a-single-assertion
        
        To verify a todo creation I added custom cypress command cy.verifyCreatedTodo()
        */
        cy.log('should not create a blank todo - negative case')
        cy.get('@newToDoInput').type('{enter}')
        cy.get('.todo-list')
            .as('todoList')
            .should('not.exist')
        
        cy.log('create a todo with a long text without errors')
        cy.get('@newToDoInput').type(`${LONG_TEXT_TODO}{enter}`)
        cy.verifyCreatedTodo(LONG_TEXT_TODO)

        cy.log('create a todo with non-latin characters')
        cy.get('@newToDoInput').type(`${NON_LATIN_TODO}{enter}`)
        cy.verifyCreatedTodo(NON_LATIN_TODO)

        cy.log('create a todo with special symbols')
        cy.get('@newToDoInput').type(`${SPECIAL_SYMBOLS_TODO}{enter}`)
        cy.verifyCreatedTodo(SPECIAL_SYMBOLS_TODO)

        cy.log('create duplicate todos')
        cy.get('@newToDoInput').type(`${SAMPLE_TODO}{enter}${SAMPLE_TODO}{enter}`)
        cy.verifyCreatedTodo(SAMPLE_TODO)
            .prev() // make sure that the second duplicated todo was also added correctly
            .should('contain', SAMPLE_TODO)
    })
    
    it('should increase the counter when some new todos added', () => {
        /*
        In this test I verify that `items left` counter is increased on a new item
        and also verify that if we add a bunch of todos then the counter is
        also updated correctly.
        */ 

        cy.log('no counter by default')
        cy.get('.todo-count')
            .should('not.exist')
        const newTodosNumber = 2
        cy.addBunchOfTodosViaUI(newTodosNumber)
        cy.get('.todo-count')
            .should('contain', `${newTodosNumber} items left`)

    })  
})