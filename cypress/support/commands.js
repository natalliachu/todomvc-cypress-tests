Cypress.Commands.add("verifyCreatedTodo", (createdTodoText) => {
    cy.get('.todo-list li')
        .last()
        .should('contain', createdTodoText)
 })

Cypress.Commands.add('addBunchOfTodosViaUI', (todosNumber, todoName = 'peel a pineapple') => {
// var i
for (var i=0; i < todosNumber; i++) {
    cy.get('input.new-todo')
        .type(`${todoName}-${Date.now()}{enter}`)
}
})

/*
One of the best practices in Cypress is not to use UI where it's not needed.
When I developed these tests I've noticed that todo lists can be added throguh localStorage
I keep this custom commans as an alternative to `addBunchOfTodos`, when I don't need to use UI

So, what is happening here: 
I prepare a list of todos for adding (based on provided number of new todos),
then I get the list of current todos fron localStortage (which is string),
I concatenate currentTodos with new ones, and 
convert everything back to string to put into localStorage with `angular2-todos` key.

By the way, I checked that using `addBunchOfTodosWithoutUI` instead of `addBunchOfTodosViaUI` decreases tests running time! :yay:
*/

Cypress.Commands.add('addBunchOfTodosWithoutUI', (todosNumber, todoName = 'peel a pineapple', isCompleted = false) => {
    var addedTodosItemsToList = new Array()
    var currentTodoItemsList = window.localStorage.getItem('angular2-todos') || '[]'

    // Make a new list of todos that should be added
    for (var i=0; i < todosNumber; i++) {
        addedTodosItemsToList.push({
            "completed": isCompleted,
            "editing": false,
            "_title": `${todoName}-${Date.now()}${i}`}) // todo name is unique here
    }
    var newTodosList = addedTodosItemsToList.concat(JSON.parse(currentTodoItemsList)) // currentTodoList from localStorage is string, so I make it array again, to concatenate
    window.localStorage.setItem('angular2-todos', JSON.stringify(newTodosList)) // add todo list with aold and new items back to localStorage
    cy.reload() // reload the page to see applied changes
})

Cypress.Commands.add('getCounterNumber', () => {
    cy.get('.todo-count').invoke('text').then((counterText) => {
        cy.wrap(parseInt(counterText.split(' ')[0]))
            .as('itemsLeftNumber')
    })
})