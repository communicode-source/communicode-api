Copy and paste the contents of a file to help populate a Mongo DB Collection.
The syntax goes like:
  db.[COLLECTION].insert([MONGODB OBJECT]);
Where collection should be defined below for each file.
The MongoDB Object should be the contents of a file.
A MongoDB Object is a series of JSON objects with [] surrounding it, e.x.:
  [
    {
      name: "John",
      lname: "Doe",
      email: "no"
    },
    {
    name: "Jane",
    lname: "Doe",
    email: "notRelated@all.com"
    }
    ...
  ]

FILE REFERENCES =========================================
FILE              =   COLLECTION(S)
greetings.json    =   greetings
