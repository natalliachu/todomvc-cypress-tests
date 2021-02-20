# Cypress tests for [todomvc](https://todomvc.com/examples/angular2/) project

`todomvc-cypress-tests` is a set of tests for [todomvc](https://todomvc.com/examples/angular2/) basic functionality for creating, editing, completing and deleting a todo list.

### How to run the tests
* clone the repository
* install Cypress via `npm` (for installing via `yarn` or direct download please use [Cypress official docs](https://docs.cypress.io/guides/getting-started/installing-cypress.html#Installing)): 
````sh
npm install cypress --save-dev
````

* install [`lorem-ipsum`](https://www.npmjs.com/package/lorem-ipsum) via `npm`:
```sh
npm i lorem-ipsum
```
* run Cypress:
```sh
npx cypress open
````

In the opened Cypress window, you can choose the browser from Chrome, Firefox or Electron in the top right corner.

Below the browser dropdown, choose 'Run 4 integration specs'.

Enjoy! 😊

### Tests structure
Cypress tests are placed in [integration](./cypress/integration) folder, 4 specs by the functionality.

There are some useful [custom Cypress commands](./cypress/support/commands.js).

### Notes and comments
1. One of the best practices in Cypress is avoiding the usage of UI where it is not needed.
In Todomvs project the items can be added throguh localStorage, so [`addBunchOfTodosWithoutUI`](cypress/support/commands.js#L29) custom Cypress command is meant exactly for that purposes: to create a set of todos as pre-set data for tests (I don't use fixtures here, so this is the way how I prepare test data).

2. I set up `watchForFileChanges:false` in [cypress settings](./cypress.json#L3) to avoid excessive test runs against the third-party app.

3. All test cases are atomic and can be run separately (use `it.only()` to run a specific test case).

4. Locators: according to Cypress best practices, it's better to use `data-`* attibutes to select elements. There are no such attributes for [testmvc](https://todomvc.com/examples/angular2/) app, therefore I use all available selectors.

### Future plans:
* Cypress tests can be extended with a secutiry test case in [create todo scenarios](./cypress/integration/create_todo.spec.js):
```javascript
const XSS_INJECTION_TODO = "<b onmouseover=alert('Wufff!')>click me!</b>"

 cy.get('.new-todo').type(`${XSS_INJECTION_TODO}{enter}`)
        cy.verifyCreatedTodo(XSS_INJECTION_TODO)
```
* During test development I've noticed a hidden `id="toggle-all"` checkbox which is never visible on UI but exists in DOM and some test cases can be added for this nice feature :)

### 🐛 Bonus bug!
#### Steps to reproduce: 
1. Add a todo.
2. Double-click on it to open edit mode.
3. Delete the text in edit todo field.
4. Unfocus the field without saving changes.
> This todo is neither deleted, nor in edit mode, and its layout is broken.
5. Click on that todo once again.
6. Try to unfocus or delete.
> This todo is back to edit mode but it can't be reverted back, even by adding a new todo.

![alt text](https://media.giphy.com/media/t8sCmiDgr6DUYS56sZ/giphy.gif)

