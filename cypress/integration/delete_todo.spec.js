/* Note: neither .trigger('mouseover') nor .invoke('mouseover') don't show destroy button, 
so I just use `cy.click{force: true}` to interact with it
*/ 

const ADDED_TODOS_NUMBER = 1

describe('Delete todo', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.addBunchOfTodosWithoutUI(ADDED_TODOS_NUMBER)
        cy.get('.todo-list li')
            .as('todos')
            .first()
            .as('firstTodoInList')
    })

    it('should delete todo - positive case', () => {
        cy.get('@todos').each($todoItem => {
            cy.get($todoItem)
            .find('button.destroy')
            .should('exist')
            .should('not.be.visible')
            .click({force: true})
        })
        cy.get('@todos').should('not.exist')
    })

    it('should delete completed todo', () => {
        cy.get('@firstTodoInList').find('[type="checkbox"]').check() // complete a todo
        cy.get('@firstTodoInList').find('button.destroy')
            .click({force: true})
        cy.get('@todos').should('not.exist')
    })

    it('should decrease the counter when a todo list is deleted', () => {
        cy.addBunchOfTodosWithoutUI(3)
        cy.getCounterNumber().then($itemsLeft => {
            var itemsLeftBeforeDeleting = $itemsLeft
            cy.get('@firstTodoInList').find('button.destroy')
                .click({force: true})
            cy.getCounterNumber()
            cy.get('@itemsLeftNumber').should('eq', itemsLeftBeforeDeleting -1)
        })
    })

    it('shoud be possible to delete a todo when editing - negative case', () => {
        cy.get('@firstTodoInList')
            .find('button.destroy')
            .click({force: true})
        cy.get('@todos').should('have.length', ADDED_TODOS_NUMBER-1)

    })
})