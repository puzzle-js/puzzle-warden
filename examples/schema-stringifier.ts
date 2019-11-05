import warden from "../src";

warden.debug = true;

// Returns optional request instance
const route = warden.register('schema', {
  identifier: '{query.foo}',
  schema: {
    type: 'object',
    properties: {
      application: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          environment: {
            type: 'string'
          },
          framework: {
            type: 'string'
          },
          list: {
            type: "array",
            items: {
              type: 'string'
            }
          }
        }
      },
      wardenVersion: {
        type: 'number',
      }
    }
  }
});

// You can use the request handler
route({
  url: 'https://postman-echo.com/post',
  method: 'post',
  body: {
    wardenVersion: 1.5,
    application: {
      name: 'Schema Parser Test',
      environment: 'Node.Js',
      framework: 'Puzzle',
      list: ["Puzzle", "Warden"]
    }
  },
  json: true
}, (err, res, body) => {
  console.log(body);
});
