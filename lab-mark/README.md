![CF](https://camo.githubusercontent.com/70edab54bba80edb7493cad3135e9606781cbb6b/687474703a2f2f692e696d6775722e636f6d2f377635415363382e706e67) Code-401-Javascript Lab-11-12
===
This is day 11-12 of lab with Code Fellows. The purpose of the labs is to teach students how to utilize express and other various node modules to create rest-apis.
### How to start server:
In a terminal, navigate to the lab-mark directory and install the required dependencies by typing `npm i`. Refer to the commands below to interact with the software.
* ##### Start the database: `npm run dbon`
* ##### Start the server: `npm run start`
* ##### Close the database: `npm run dboff`
### Making requests:
After the server has been turned on, different requests can be made to it. You can use any tool to accomplish this, we recommend POSTMAN or httpie.
#### Server Endpoints
Create the following routes for performing CRUD opperations on your resourcee
* `POST /api/videogames`
  * Passes data as stringifed JSON in the body of a **POST** request to create a new resource
  * On success respond with a 200 status code and the created videogame
  * On failure due to a bad request send a 400 status code
* `GET /api/videogames` and `GET /api/videogames?id={id}`
  * With no id in the query string it responds with pagination values: Count = numberr of total videogames, Data = 10 videogames per page.
  * With an id in the query string it responds with the details of a specifc video game (as JSON)
    * If the id is not found responds with a 404
* `DELETE /api/videogames?id={id}>`
  * The route should deletes a videogame with the given ID
  * On success this return a 204 status code with no content in the body
  * On failure due to lack of id in the query respond with a 400 status code
  * On failure due to a video game with that id not existing respond with a 404 status code
* `PUT /api/videogames?id={id}>`
  * The route should update a videogame with the given ID, with the data sent
  * On success this return a 200 status code with the newly updated video game data
  * On failure due to lack of id in the query respond with a 400 status code
  * On failure due to lack of title, console, or genre data in the request, respond with a 400 status code
  * On failure due to a video game with that id not existing respond with a 404 status code
