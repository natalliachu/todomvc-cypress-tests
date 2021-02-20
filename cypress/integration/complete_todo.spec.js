const ADDED_TODOS_NUMBER = 1
const ADDED_TODO_NAME = 'peel a pineapple'


describe('Complete todos', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.addBunchOfTodosWithoutUI(ADDED_TODOS_NUMBER)
        cy.get('.todo-list li')
            .as('todos')
        cy.get('@todos')
            .first()
            .as('firstTodoInList')
    })

    it('should complete a todo - positive case', () => {
        cy.contains('Clear completed')
            .should('not.exist') // make sure there's no `Clear completed` by default
        cy.getCounterNumber().should('eq', ADDED_TODOS_NUMBER) // make sure `items left` shows all uncompleted items by default

        cy.get('@todos').each($todo => {
            cy.get($todo).find('[type="checkbox"]')
                .should('not.be.checked')
                .check()
                .should('be.checked')
                .parent().parent()
                .and('have.attr', 'class', 'completed')
        })
        cy.contains('Clear completed')
            .should('be.visible')
        
        cy.getCounterNumber().should('eq', 0) // make sure `items left` counter is decreased
    })

    it('shoud not be possible to complete a todo when editing - negative case', () => {
        cy.get('@firstTodoInList')
            .dblclick()
            .find('[type="checkbox"]')
            .should('not.be.visible')
    })
})

describe('Uncomplete todos', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.addBunchOfTodosWithoutUI(ADDED_TODOS_NUMBER, ADDED_TODO_NAME, true)
        cy.contains('Clear completed')
            .as('clearCompleted')
    })
    it('should uncomplete a todo', () => {
        cy.get('.todo-list li').first()
            .find('[type="checkbox"]')
            .uncheck()
            .parent().parent()
            .should('not.have.attr', 'class', 'completed')
        
        cy.getCounterNumber().then(() => {
            cy.get('@itemsLeftNumber').should('eq', 1)
        })

    })
    it('should clear completed todos', () => {
        cy.addBunchOfTodosWithoutUI(ADDED_TODOS_NUMBER) // add few uncompleted todos

        cy.get('.todo-list li').should('have.length', ADDED_TODOS_NUMBER*2) // few completed and few uncompleted
        cy.get('@clearCompleted')  
            .click()
        cy.get('.todo-list li')
            .should('have.length', ADDED_TODOS_NUMBER)
            .each($todo => {
                cy.get($todo).find('[type="checkbox"]')
                    .should('not.checked')
            })
        cy.contains('@clearCompleted').should('not.exist')
    })
})