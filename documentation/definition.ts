export default {
    definitions: {
        blogs: {
            type: "object",
            properties: {
                title: { type: "string" },
                author: { type: "string" },
                likes: { type: "number" },
                url: { type: "string" }
            }
        },
        users: {
            type: "object",
            properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                image: { type: "string" }
            }
        }
    }
};