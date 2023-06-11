# MMMDE4IN19-22-EPFBOOK-Souidi-Omar Project Exercice 0 

## Setup & Running Instructions

To install and run this application, you should follow these steps:

1. **Node.js and NPM Installation**: Node.js and NPM should be installed on your machine. You can achieve this using NVM:
   - For NVM installation instructions, visit the [NVM GitHub repository](https://github.com/nvm-sh/nvm). Installation methods vary depending on your operating system.
   - Node.js can be installed using NVM as per the guide [here](https://github.com/nvm-sh/nvm#usage). Post installation, confirm it by executing 'node -v' in the terminal.

2. **Cloning the Repository**: To get the project files, clone the repository or download them: git clone https://github.com/EPF-MDE/-MMMDE4IN19-22-EPFBOOK-souidi-omar


3. **Navigating to the Project Directory**: Navigate to the directory of the project:

 ```
 cd <directory-of-project>
 ```

4. **Installing Dependencies**: Install the project's dependencies via NPM:

 ```
 npm install
 ```

5. **Initiating the Development Server**: Initiate the development server:

 ```
 npm run dev
 ```

 This command sets the application to run in development mode. The server automatically restarts when changes in the code are made.

6. **Accessing the Application**: Open your preferred web browser and access the application at `http://localhost:3000` (or replace "localhost" with your machine's IP address).

## Discovering the Character with id 5 in the Rick and Morty API  

The character carrying the id number 5 in the Rick and Morty API is known as Jerry Smith.

We identified this character by modifying our `app.js` file within our file app.js. We implemented a new route associated with the following URL:

```javascript
app.get('/rickandmorty/character/:id', function (req, res) {
 axios.get(`https://rickandmortyapi.com/api/character/${req.params.id}`)
 .then(function (response) {
     res.send(response.data);
 })
 .catch(function (error) {
     console.log(error);
 });
});

Once this route was added, when the user navigates to http://localhost:3000/rickandmorty/character/5 (or replace "localhost" with the machine's IP address), our application executes a GET request to the aforementioned Rick and Morty API URL. 
Consequently, it retrieves and presents the data of the character assigned with id 5.


