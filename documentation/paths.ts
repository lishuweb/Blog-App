export default {
    paths: {
        "/blogs": {
            post: {
                tags: ["blogs"],
                summary: "Create a new blog.",
                description: 'Creates a new blog and returns the newly added blog.',
                operationId: "post",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [
                    {
                        in: "body",
                        name: "body",
                        description: "Payload/Data for creating a new blog",
                        required: true,
                        schema: {
                            $ref: "#/definitions/blogs",
                        },
                    },
                ],
                responses: {
                    201: {
                        description: "Blog Created",
                        schema: {
                            $ref: "#/definitions/blogs",
                        },
                    },
                    500: {
                        description: "Creation Unsuccess",
                    },
                },
            },
            get: {
                tags: ["blogs"],
                summary: "Retrieve all the blogs.",
                description: "Retrieve all the available blogs.",
                operationId: "getAll",
                consumes: ["application/json"],
                produces: ["application/json"],
                responses: {
                    200: {
                        description: "Operation Success",
                        schema: {
                            $ref: "#/definitions/blogs",
                        },
                    },
                    500: {
                        description: "Invalid Operation",
                    },
                },
            }
        },
        "/blogs/{id}": {
            get: {
                tags: ["blogs"],
                summary: "Retrieve a single blog.",
                description: "Retrieves information of a specific blog  using its ID.",
                operationId: "getById",
                produces: ["application/json"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "The id of the blog to retrieve.",
                        required: true,
                        type: "integer"
                    },
                ],
                responses: {
                    200: {
                        description: "Successful Operation",
                        schema: {
                            $ref: "#/definitions/blogs",
                        }
                    },
                    400: {
                        description: "ID Invalid"
                    },
                    500: {
                        description: "Invalid Operation"
                    },
                    404: {
                        description: "Blog Not Found"
                    }
                }
            },
            put: {
                tags: ["blogs"],
                summary: "Update the blog using its id.",
                description: "Updates the blog through the id and returns the updated blog.",
                operationId: "update",
                produces: ["application/json"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "The ID of the blog to update",
                        required: true,
                        type: "integer",
                    },
                    {
                        in: "body",
                        name: "body",
                        description: "Payload/Data for updating the blog status",
                        required: true,
                        schema: {
                            $ref: "#/definitions/blogs",
                        }
                    },
                ],
                responses: {
                    200: {
                        description: "Successful response",
                        schema: {
                            $ref: "#/definitions/blogsResponse",
                        }
                    },
                    400: {
                        description: "Invalid ID Supplied"
                    },
                    500: {
                        description: "Invalid Operation"
                    },
                    404: {
                        description: "Blog Not Found"
                    }
                }
            },
            delete: {
                tags: ["blogs"],
                summary: "Delete a particular blog.",
                description: "Delete the blog using its ID.",
                operationId: "delete",
                produces: ["application/json"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "The ID of the blog to be deleted.",
                        required: true,
                        type: "integer"
                    }
                ],
                responses: {
                    200: {
                        description: "Operation Success",
                        schema: {
                            $ref: "#/definitions/blogs",
                        }
                    },
                    400: {
                        description: "Invalid ID Supplied"
                    },
                    500: {
                        description: "Invalid Operation"
                    },
                    404: {
                        description: "Blog Not Found"
                    }
                }
            }
        }
    },
}