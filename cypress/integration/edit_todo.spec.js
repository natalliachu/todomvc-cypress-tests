const INITIAL_TODO_NAME = 'peel a pineapple'
const INITIAL_TODOS_NUMBER = 1
const NEW_TODO_NAME = 'cut the pineapple'

describe('Edit todos', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.addBunchOfTodosWithoutUI(INITIAL_TODOS_NUMBER)
        cy.get('.todo-list li')
            .first()
            .as('firstTodoInList')
    })

    it('should allow to edit an existing todo - positive case', () => {
        cy.get('@firstTodoInList')
            .find('[type=checkbox]')
            .should('not.be.checked') // make sure that a todo is not complete before editing
            .parent()
            .find('label')
            .dblclick()
        cy.get('input.edit')
            .clear()
            .type(`${NEW_TODO_NAME}{enter}`)
    
        cy.log('make sure that the item is edited sucsessfully')
        cy.get('@firstTodoInList')
            .should('contain', NEW_TODO_NAME)
            .find('[type=checkbox]')
            .should('not.be.checked') // verify that the todo is still not complete after editing
            .parent()
            .find('.destroy')
            .should('exist')
    })

    it('should not save changes in edit mode after page reload - negative case', () => {
        cy.get('@firstTodoInList')
            .dblclick()
        cy.get('input.edit')
            .clear()
            .type(`${NEW_TODO_NAME}`)
        cy.reload()
        cy.get('.todo-list')
            .its('length')
            .should('eq', INITIAL_TODOS_NUMBER) // the item isn't lost or deleted
        cy.get('@firstTodoInList')
            .should('not.contain', NEW_TODO_NAME)
            .and('contain', INITIAL_TODO_NAME)
    })

    it('should cancel todo editing on clicking Esc', () => {
        cy.get('@firstTodoInList')
            .dblclick()
        cy.get('input.edit')
            .clear()
            .type(NEW_TODO_NAME)
            .type('{esc}')
        cy.get('@firstTodoInList')
            .should('not.contain', NEW_TODO_NAME)
            .and('contain', INITIAL_TODO_NAME)
    })
})
