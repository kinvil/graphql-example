var express = require('express');
var app = express();
var port = 3000;
var USE_GRAPHIQL = process.argv[2] === 'GraphiQL';
var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');

var productList = require('./data/products');
var memberList = require('./data/members');

var API_ROOT = '/graphql'

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

var memberType = new graphql.GraphQLObjectType({
    name: 'Member',
    fields: {
        id: { type: graphql.GraphQLString },
        mobile: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString }
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
                    return productList.filter(function (item) {
                        return item.id === args.id;
                    })[0];
                }
            },
            prodcate: {
                type: new graphql.GraphQLList(productType),
                args: {
                    category: { type: graphql.GraphQLString }
                },
                resolve: function (_, args) {
                    return productList.filter(function (item) {
                        return item.category === args.category;
                    });
                }
            },
            products: {
                type: new graphql.GraphQLList(productType),
                resolve: function () {
                    return productList
                }
            },
            member: {
                type: memberType,
                args: {
                    id: { type: graphql.GraphQLString }
                },
                resolve: function (_, args) {
                    return memberList.filter(function (item) {
                        return item.id === args.id;
                    })[0];
                }
            },
            members: {
                type: new graphql.GraphQLList(memberType),
                resolve: function () {
                    return memberList;
                }
            }
        }
    });
});

if (USE_GRAPHIQL) {
    app.use(API_ROOT, graphqlHTTP({ schema: schema, graphiql: true }));
} else {
    app.all(API_ROOT, function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        next();
    });
    app.use(API_ROOT, graphqlHTTP({ schema: schema, pretty: true }));
}
app.listen(port, function () {
    console.log('server is running on localhost:' + port);
});
