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
        }
    }
};