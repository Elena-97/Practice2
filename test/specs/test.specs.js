const assert = require('assert');
import { describe, it, before } from 'mocha';
import assert from 'assert';

describe("Test Trello page" ,() =>{

    beforeEach('Trello home page', async() =>{
        await browser.url('https://trello.com');
        const pageTitle= await browser.getTitle();
        console.log('pageTitle');
    });

    it('T1-User signs up for a new Trello account', async() =>{
        const singUp = await $('div[class="link-buttonstyles__BxpButton-sc-1utqn26-1 inwKxu"]')
        await singUp.click();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/signup'));

        const element= await $('#email').isDisplayed();
        expect (element).toBeDisplayed();

        const uniqueSuffix = `+${Date.now()}@example.com`;
       
        await element.setValue(`+${Date.now()}@example.com`);

        const signUpButton = await $('#signup-submit');
        await signUpButton.click();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/welcome'),
            {
                timeout: 5000,
                timeoutMsg: 'Expected to be in welcome dashboard after signup'
            })


         console.log('Check email box for the confirmation email.'); 
         const dashboardTitle = await $('h1.dashboard-title').getText();
         expect(dashboardTitle).to.include('Welcome');
    })

    it('T2- User sign in and redirect to dashboard', async () => {
        // await browser.url('https://trello.com/login');
        await $('#login-form').waitForDisplayed();

        const userNameInput = await $('#user');
        const passwordInput = await $('#password');

        await userNameInput.setValue('Pintilei Elena'); 
        await passwordInput.setValue('testtrello'); 

        const loginButton = await $('#login');
        await loginButton.click();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/boards'),
            {
                timeout: 5000,
                timeoutMsg: 'Expected to be on the dashboard after login'
            }
        );

        const dashboardElement = await $('selector-for-dashboard-element'); 
        expect(await dashboardElement.isDisplayed()).toBe(true);
    });
        
        
     it('T3- Should update the profile information correctly', async function() {
        // await browser.url('/login');
        // await browser.loginAsUser(); 
        // await browser.url('/profile/settings'); 

        // Assume 'uploadProfilePic' and 'bioTextarea' are the IDs for the profile picture input and bio textarea respectively.
        const uploadInput = await $('#uploadProfilePic');
        const bioInput = await $('#bioTextarea');
        const saveButton = await $('#saveProfileButton');

        // Set a picture and bio
        // For simulation purposes, you need a path to an accessible image file
        await uploadInput.setValue('/path/to/new/picture.jpg');
        await bioInput.setValue('This is a new bio');

        // Save the new profile information
        await saveButton.click();

        // Optionally, wait for a notification that settings were saved successfully
        await $('.notification').waitForDisplayed({ timeout: 3000, reverse: false });

        // Verify changes on the profile page
        await browser.url('/profile');
        
        const displayedBio = await $('#bioTextDisplay').getText();
        const profileImageSrc = await $('#profileImage').getAttribute('src');

        // Assertions
        expect(displayedBio).toEqual('This is a new bio');
        expect(profileImageSrc).toContain('path/to/new/picture.jpg');

    after(async function() {
        // Clean up session, logout if necessary
        await browser.logoutUser(); // Assuming logoutUser() is your own implemented function
    });                                // It's recommended to abstract your login logic to a utility file.
    });

   
    it('T4-should allow a user to create a new board', async function() {
        // await browser.url('/login');
        // await browser.loginAsUser(); // Consider implementing this in a utilities file or similar.
        // await browser.url('/dashboard');

        // Click "Create new board" button
        const createBoardButton = await $('#createNewBoard'); 
        await createBoardButton.click();

        // Wait for the "Create Board" form/modal to appear
        const createBoardModal = await $('#createBoardModal');
        await createBoardModal.waitForDisplayed();

        // Example form field IDs - adjust these as per the actual application
        const boardNameInput = await $('#boardNameInput');
        const privacyDropdown = await $('#privacyDropdown');
        const createButton = await $('#createBoardButton');

        // Enter the board name and select privacy settings
        const boardName = `Board-${Date.now()}`; // Ensures uniqueness
        await boardNameInput.setValue(boardName);
        // Here, assuming privacy settings are dropdown and "Private" is an option
        await privacyDropdown.selectByVisibleText('Private');

        // Create the board
        await createButton.click();

        // Wait for navigation or a success message, ensuring the board is created
        await $('#boardCreatedSuccessMessage').waitForDisplayed();

        // Verify the new board is listed on the user's dashboard
        // Assuming boards are listed inside a container identified by '#boardList'
        await browser.url('/dashboard');
        const boardList = await $('#boardList');
        const newBoard = await boardList.$(`//*[contains(text(), "${boardName}")]`);

        expect(await newBoard.isDisplayed()).toBe(true);
    });

    after(async function() {
        // Cleanup session, logout if necessary
        await browser.logoutUser(); // Assuming logoutUser() is your own implemented function.
    });

    
    it('T5-should allow a user to search for an existing board by name', async function() {
        // await browser.url('/login');
        // await browser.loginAsUser(); // This should abstract the authentication mechanism.
        // await browser.url('/dashboard');  // Navigate directly to the dashboard

        // Assume we have a board named 'ExistingBoard'
        const boardName = 'ExistingBoard';

        // Locating and interacting with the search bar
        const searchInput = await $('#searchInput');
        await searchInput.waitForDisplayed();
        await searchInput.setValue(boardName);

        // Press Enter to submit search query (KeyCode for 'Enter' is 13)
        await browser.keys('Enter'); // Alternatively: await searchInput.keys('Enter') if supported

        // Wait for search results to appear
        // Assuming the results are shown in an element with id 'searchResults'
        const searchResults = await $('#searchResults');
        await searchResults.waitForDisplayed();

        // Validate that the specific board appears in search results
        // This assumes that each result might have an attribute/data-tag or specific text includes the board name
        const boardInResults = await searchResults.$(`//*[contains(text(), "${boardName}")]`);
        expect(await boardInResults.isDisplayed()).toBe(true);
        
        // Optional: Click on the board to select/open it, assuming it triggers navigation to the board's page
        await boardInResults.click();
        // You might want to validate the URL or some content on the board's specific page to ensure correct navigation
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes(boardName.toLowerCase()),
            {
                timeout: 5000,
                timeoutMsg: 'Expected to navigate to the board page'
            }
        );
    });

    after(async function() {
        // Cleanup session, likely logging out.
        await browser.logoutUser(); 
    });
    
    it('T6-should allow a user to add a list to an existing board', () => {
        // Assuming the user is already logged in and viewing an existing board
        // browser.url('https://yourwebsite.com/existing-board');
    
        // Click on 'Add a list' button
        $('#addAListButton').click();
    
        // Wait for the input field to be displayed
        const listNameInput = $('#listNameInput');
        listNameInput.waitForDisplayed();
    
        // Enter a name for the list
        listNameInput.setValue('New List');
    
        // Click the save button
        $('#saveListButton').click();
    
        // Assert the new list has been added to the board
        const newList = $(`//*[text()="New List"]`);
        assert.strictEqual(newList.isExisting(), true, 'The new list should be added to the board');
      });

    it('T7-should allow a user to add a card to a list with a title and description', () => {
        // Assuming the user is already logged in and viewing an existing list in a board
        // browser.url('https://yourwebsite.com/board-with-list');
    
        // Click on 'Add a card' button for the specific list
        $('.list .addCardButton').click(); 
    
        // Wait for the title input field to be displayed
        const titleInput = $('#titleInput');
        titleInput.waitForDisplayed();
    
        // Enter a title for the card
        titleInput.setValue('New Card Title');
    
        // Enter a description for the card
        const descriptionInput = $('#descriptionInput');
        descriptionInput.setValue('New Card Description');
    
        // Click the add button
        $('#addCardButton').click();
    
        // Wait for the card to be displayed in the list
        const newCard = $(`//*[text()="New Card Title"]`);
        newCard.waitForExist();
    
        // Check card title
        assert.strictEqual(newCard.getText(), 'New Card Title', 'The card title should match the entered title');
    
        // Check card description
        const newCardDescription = $(`//*[contains(text(), "New Card Description")]`);
        assert.strictEqual(newCardDescription.isExisting(), true, 'The card description should match the entered description');
      });

    it('T8-should allow an admin to update the workspace name and permissions', () => {
        // Assuming the user is already logged in as an admin and is on the workspace settings page
        // browser.url('https://yourwebsite.com/workspace-settings');
    
        // Change the workspace name
        const workspaceNameInput = $('#workspaceNameInput');
        workspaceNameInput.waitForDisplayed();
        workspaceNameInput.clearValue();
        workspaceNameInput.setValue('Updated Workspace Name');
    
        // Set new permissions for members
        const permissionsSelect = $('#permissionsSelect');
        permissionsSelect.selectByVisibleText('Read-Only'); // Example permission setting
    
        // Click the update button
        $('#updateSettingsButton').click();
    
        // Wait for the changes to be applied
        browser.pause(2000); // Consider using a more reliable method like waiting for a specific element to appear/disappear
    
        // Assert that the workspace name has been updated
        const updatedWorkspaceName = $('#workspaceName');
        assert.strictEqual(updatedWorkspaceName.getText(), 'Updated Workspace Name', 'Workspace name should be updated');
    
        // Assert that the permissions setting has been applied (this could be very specific based on the application behavior, an example is just checking the UI state)
        const appliedPermissions = $('#appliedPermissions');
        assert.strictEqual(appliedPermissions.getText(), 'Read-Only', 'Permissions should be set to Read-Only for all members');
      });

});