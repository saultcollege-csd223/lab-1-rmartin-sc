
describe("The page...", () => {

    beforeEach(() => {
        cy.visit(Cypress.env('root_url') + 'index.html')
    })

    it('Has a dropdown with id "users"', () => {
        cy.get("select#users").should('exist')
    })

    it('Has a range element with id "size"', () => {
        cy.get("input[type=range]#size").should('exist')
    })

    it('Has a minimum size of 10', () => {
        cy.get("#size").should('have.attr', 'min', '10')
    })

    it('Has a maximum size of 40', () => {
        cy.get("#size").should('have.attr', 'max', '40')
    })

    it('Has a div with id "posts"', () => {
        cy.get("div#posts").should('exist')
    })

    it('Changes #posts <div> font size any time the size input moves', async function() {
        await cy.get('#size').invoke('val', 25).trigger('input')
        cy.get('#posts').should('have.css', 'font-size', '25px')
    })
})

describe("The page...", () => {

    it('Loads user names using a GET request', () => {
        cy.intercept('https://jsonplaceholder.typicode.com/users', {fixture: 'userdata.json'})
        .as('fetchUsers')

        cy.visit(Cypress.env('root_url') + 'index.html')

        cy.wait('@fetchUsers')

        cy.get('#users option').should('have.length', 2)
    })

    it('Sorts user names alphabetically', () => {
        cy.intercept('https://jsonplaceholder.typicode.com/users', {fixture: 'userdata.json'})
        .as('fetchUsers')

        cy.visit(Cypress.env('root_url') + 'index.html')

        cy.wait('@fetchUsers')

        cy.get('#users option:nth-child(1)').should('have.text', 'Ervin Howell')
        cy.get('#users option:nth-child(2)').should('have.text', 'Leanne Graham')
    })

    it('Starts with no user selected', () => {
        cy.intercept('https://jsonplaceholder.typicode.com/users', {fixture: 'userdata.json'})
        .as('fetchUsers')

        cy.visit(Cypress.env('root_url') + 'index.html')

        cy.wait('@fetchUsers')

        cy.get('#users').should('have.value', null)
    })

    it('Fetches posts for selected user', () => {
        cy.intercept('https://jsonplaceholder.typicode.com/users', {fixture: 'userdata.json'})
        .as('fetchUsers')
        cy.intercept('https://jsonplaceholder.typicode.com/users/*/posts', {fixture: 'postdata.json'})
        .as('fetchPosts')

        cy.visit(Cypress.env('root_url') + 'index.html')
        cy.wait('@fetchUsers')
        cy.get('#users').select('2')
        cy.wait('@fetchPosts').its('request.url').should('match', /users\/2\/posts$/)

    })

    it('Displays the posts for selected user as <article> elements inside the #posts <div>', () => {
        cy.intercept('https://jsonplaceholder.typicode.com/users', {fixture: 'userdata.json'})
        .as('fetchUsers')
        cy.intercept('https://jsonplaceholder.typicode.com/users/*/posts', {fixture: 'postdata.json'})
        .as('fetchPosts')

        cy.visit(Cypress.env('root_url') + 'index.html')
        cy.wait('@fetchUsers')
        cy.get('#users').select('2')
        cy.wait('@fetchPosts')

        cy.get('#posts > article').should('have.length', 2)
    })

    it('Displays posts with the correct title and content', () => {
        cy.intercept('https://jsonplaceholder.typicode.com/users', {fixture: 'userdata.json'})
        .as('fetchUsers')
        cy.intercept('https://jsonplaceholder.typicode.com/users/*/posts', {fixture: 'postdata.json'})
        .as('fetchPosts')

        cy.visit(Cypress.env('root_url') + 'index.html')
        cy.wait('@fetchUsers')
        cy.get('#users').select('2')
        cy.wait('@fetchPosts')

        cy.get('#posts > article').should('have.length', 2)

        cy.get('#posts > article:nth-child(1) > h2').should('have.text', 'Post 1 Title')
        cy.get('#posts > article:nth-child(1)').should('contain', 'Post 1 text')
        cy.get('#posts > article:nth-child(2) > h2').should('have.text', 'Post 2 Title')
        cy.get('#posts > article:nth-child(2)').should('contain', 'Post 2 text')
    })

    it('Encodes the user id for the selected user in the fetch URL', () => {
        cy.intercept('https://jsonplaceholder.typicode.com/users', {fixture: 'baduserdata.json'})
        .as('fetchUsers')
        cy.intercept('https://jsonplaceholder.typicode.com/users/*/posts', {fixture: 'postdata.json'})
        .as('fetchPosts')

        cy.visit(Cypress.env('root_url') + 'index.html')
        cy.wait('@fetchUsers')

        cy.get('#users').select('?')

        cy.wait('@fetchPosts').its('request.url').should('match', /users\/%3F\/posts$/)
    })
})