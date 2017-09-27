# Reminders

### GET /api/reminders 

To request all reminders, provide the path `/api/reminders` to the url.

Example GET request

```
http://localhost:1337/api/reminders

// >> output

// {
//   _id: 893hfhwh311948399dj,
//   task: 'get eggs,
//   done: false,
//   priority: 1,
//   timestamp: 2017-09-27T15:04:45.267Z
// },
// {
//   _id: 66745h3136456353444,
//   task: 'finish work,
//   done: false,
//   priority: 3,
//   timestamp: 2017-08-27T15:02:46.337Z
// },
// {
//   _id: 141423433fsg5635856,
//   task: 'do laundry,
//   done: false,
//   timestamp: 2017-05-27T15:06:46.027Z
// }

```

### GET /api/reminders?id={id}

To request an individual reminder, provide the path `/api/reminders?id={reminder-id}` with an id to the url

Example GET request

```
http://localhost:1337/api/reminders?id=893hfhwh311948399dj

// >> output

// {
//   _id: 893hfhwh311948399dj,
//   task: 'get eggs,
//   done: false,
//   priority: 1,
//   timestamp: 2017-09-27T15:04:45.267Z
// },
```

### POST /api/reminders

To post a reminder, make a post request to the `api/reminders` path with a json object containing

```
{
  task: <String> // required,
  priority: <Number> // Optional 1-4
}
```

Example POST request

```
http://localhost:1337/api/reminders

// JSON object
// {
//   task: 'call sarah',
//   priority: 1
// }

>> output 

// {
//   _id: 25345sgw112afss4523,
//   task: 'call sarah,
//   done: false,
//   priority: 1,
//   timestamp: 2017-07-27T15:04:45.267Z
// }

```

### PUT /api/reminders?id={id}

To update a reminder provide the path `/api/reminders?id={reminder-id}` with an id to the url and the update to be made with a JSON object

```
{
  task: <String> // required,
  priority: <Number> // Optional 1-4,
  done: <Boolean> // required
}
```

Example PUT request

```
http://localhost:1337/api/reminders?id=893hfhwh311948399dj

// JSON object
// {
//   done: true
// }

// >> output

// {
//   _id: 893hfhwh311948399dj,
//   task: 'get eggs,
//   done: true,
//   priority: 1,
//   timestamp: 2017-09-27T15:04:45.267Z
// },

```


### DELETE /api/reminders?id={id}

To delete an individual reminder, provide the path `/api/reminders?id={reminder-id}` with an id to the url

Example delete request

```
http://localhost:1337/api/reminders?id=893hfhwh311948399dj

// >> output

{}
```