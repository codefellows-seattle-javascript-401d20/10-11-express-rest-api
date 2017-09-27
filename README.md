![cf](https://i.imgur.com/7v5ASc8.png) Lab 11: Express and Mongo REST API
======

## Starting and Stopping Your Server and Database
* start: `npm run dbon && npm run start`
* stop: `npm run dboff`

## Making Requests to Each Server Endpoint
* `POST /api/<resource-name>`
  * pass a request with a resource (a book) with at least a title, an author name, and a description
  * if all required fields are present, respond with a 200 success code and the created book
  * if not all required fields are present, respond with a 400 status code
* `GET /api/<resource-name>` and `GET /api/<resource-name>?id={id}`
  * pass a request with an /api/<resource-name> path
    * with no id at the end of the path in the query string, the program should output an array of all of your resources
    * with an existing id in the query string, the program should respond with the requested resource as JSON
    * with a non-existent id in the query string, the program should respond with a 404 status code
* `DELETE /api/<resource-name?id={id}>`
  * pass a request with an /api/<resource-name> path
    * with no id at the end of the path in the query string, the program should respond with a 400 status code
    * with an existing id in the query string, the program should delete a resource with the given id and return a 204 status code with no content in the body
    *  with a non-existent id in the query string, the program should respond with a 404 status code
