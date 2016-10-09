var express = require('express');
var app = express();
var port = 3000;

var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');

var products = require('./data/products');
var members = require('./data/members');

var productType = new graphql.GraphQLObjectType({
    name: 'Product',
    fields: {
        id: { type: graphql.GraphQLString },
        category: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        price: { type: graphql.GraphQLInt },
        limit: { type: graphql.GraphQLInt }
    }
});

var schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
            product: {
                type: productType,
                args: {
                    id: { type: graphql.GraphQLString }
                },
                resolve: function (_, args) {
                    return products.filter(function (item) {
                        return item.id === args.id;
                    })[0];
                }
            }
        }
    })
});

app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));
app.listen(port);
console.log('server is running on localhost:' + port);