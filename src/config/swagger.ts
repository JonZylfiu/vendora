import type { SwaggerUiOptions } from "swagger-ui-express";

const objectId = {
    type: "string",
    example: "65f1a9d98b3f3a4a8f5d9c12"
};

const apiResponse = (data: unknown, message: string | null = null) => ({
    type: "object",
    properties: {
        data,
        message: {
            type: "string",
            nullable: true,
            example: message
        },
        success: {
            type: "boolean",
            example: true
        }
    }
});

const errorResponse = {
    type: "object",
    properties: {
        data: {
            nullable: true,
            example: null
        },
        message: {
            type: "string",
            example: "Bad request"
        }
    }
};

export const swaggerOptions: SwaggerUiOptions = {
    customSiteTitle: "Vendora API Docs"
};

export const openApiSpec = {
    openapi: "3.0.3",
    info: {
        title: "Vendora API",
        version: "1.0.0",
        description: "API documentation for Vendora, a distributed marketplace where users can buy and sell items."
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local development server"
        }
    ],
    tags: [
        { name: "Auth", description: "Registration and login" },
        { name: "Items", description: "Marketplace item listings" },
        { name: "Bids", description: "Item bidding" },
        { name: "Orders", description: "Order lifecycle" },
        { name: "Notifications", description: "User notifications" },
        { name: "Users", description: "User accounts" }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            ApiError: errorResponse,
            AuthUser: {
                type: "object",
                properties: {
                    name: { type: "string", example: "Arta" },
                    surname: { type: "string", example: "Krasniqi" },
                    email: { type: "string", format: "email", example: "arta@example.com" },
                    city: { type: "string", example: "Prishtina" },
                    location: {
                        type: "array",
                        items: { type: "number" },
                        minItems: 2,
                        maxItems: 2,
                        example: [21.1659, 42.6629]
                    },
                    phone: { type: "string", example: "+38344123456" }
                }
            },
            RegisterRequest: {
                type: "object",
                required: ["name", "surname", "email", "password", "city", "phone", "age", "location"],
                properties: {
                    name: { type: "string", example: "Arta" },
                    surname: { type: "string", example: "Krasniqi" },
                    email: { type: "string", format: "email", example: "arta@example.com" },
                    password: { type: "string", format: "password", example: "Password1!" },
                    city: { type: "string", example: "Prishtina" },
                    phone: { type: "string", example: "+38344123456" },
                    age: { type: "number", example: 24 },
                    location: {
                        type: "array",
                        items: { type: "number" },
                        minItems: 2,
                        maxItems: 2,
                        example: [21.1659, 42.6629]
                    }
                }
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "arta@example.com" },
                    password: { type: "string", format: "password", example: "Password1!" }
                }
            },
            AuthResponseData: {
                type: "object",
                properties: {
                    user: { $ref: "#/components/schemas/AuthUser" },
                    token: { type: "string", example: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..." }
                }
            },
            Item: {
                type: "object",
                properties: {
                    id: objectId,
                    sellerFullName: { type: "string", example: "Arta Krasniqi" },
                    sellerPhone: { type: "string", example: "+38344123456" },
                    sellerCity: { type: "string", example: "Prishtina" },
                    images: {
                        type: "array",
                        items: { type: "string" },
                        example: ["uploads/items/images-1717000000000-123456789.jpg"]
                    },
                    title: { type: "string", example: "iPhone 14" },
                    description: { type: "string", example: "Used phone in good condition" },
                    startingPrice: { type: "number", example: 350 },
                    state: { type: "string", enum: ["AVAILABLE", "SOLD", "ARCHIVED"], example: "AVAILABLE" },
                    category: { type: "string", example: "PHONES" },
                    tags: {
                        type: "array",
                        items: { type: "string" },
                        example: ["phone", "apple"]
                    },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            ItemList: {
                type: "object",
                properties: {
                    data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Item" }
                    },
                    pagination: {
                        type: "object",
                        properties: {
                            page: { type: "number", example: 1 },
                            limit: { type: "number", example: 10 },
                            total: { type: "number", example: 42 },
                            pages: { type: "number", example: 5 }
                        }
                    }
                }
            },
            ItemCreateRequest: {
                type: "object",
                required: ["title", "description", "startingPrice", "state", "category", "tags", "images"],
                properties: {
                    title: { type: "string", example: "iPhone 14" },
                    description: { type: "string", example: "Used phone in good condition" },
                    startingPrice: { type: "number", example: 350 },
                    state: { type: "string", enum: ["AVAILABLE", "SOLD", "ARCHIVED"], example: "AVAILABLE" },
                    category: { type: "string", example: "PHONES" },
                    tags: {
                        type: "array",
                        items: { type: "string" },
                        example: ["phone", "apple"]
                    },
                    images: {
                        type: "array",
                        items: {
                            type: "string",
                            format: "binary"
                        }
                    }
                }
            },
            BidRequest: {
                type: "object",
                required: ["itemId", "amount"],
                properties: {
                    itemId: objectId,
                    amount: { type: "number", example: 400 }
                }
            },
            BidUpdateRequest: {
                type: "object",
                required: ["amount"],
                properties: {
                    amount: { type: "number", example: 450 }
                }
            },
            Bid: {
                type: "object",
                properties: {
                    id: objectId,
                    bidderFullName: { type: "string", example: "Arta Krasniqi" },
                    bidderPhone: { type: "string", example: "+38344123456" },
                    item: {
                        type: "object",
                        properties: {
                            id: objectId,
                            title: { type: "string", example: "iPhone 14" }
                        }
                    },
                    bidAmount: { type: "number", example: 400 },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            OrderRequest: {
                type: "object",
                required: ["item"],
                properties: {
                    item: objectId
                }
            },
            OrderStateRequest: {
                type: "object",
                required: ["state"],
                properties: {
                    state: { type: "string", enum: ["CONFIRMED", "SHIPPED", "RECEIVED", "CANCELLED"], example: "SHIPPED" }
                }
            },
            Order: {
                type: "object",
                properties: {
                    id: objectId,
                    buyerFullName: { type: "string", example: "Arta Krasniqi" },
                    sellerFullName: { type: "string", example: "Dion Berisha" },
                    itemTitle: { type: "string", example: "iPhone 14" },
                    price: { type: "number", example: 400 },
                    state: { type: "string", enum: ["CONFIRMED", "SHIPPED", "RECEIVED", "CANCELLED"], example: "CONFIRMED" },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            Notification: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Your bid was accepted" },
                    type: { type: "string", example: "BID_ACCEPTED" }
                }
            },
            UserUpdateRequest: {
                type: "object",
                properties: {
                    name: { type: "string", example: "Arta" },
                    surname: { type: "string", example: "Krasniqi" },
                    age: { type: "number", example: 24 },
                    city: { type: "string", example: "Prishtina" },
                    location: {
                        type: "array",
                        items: { type: "number" },
                        minItems: 2,
                        maxItems: 2,
                        example: [21.1659, 42.6629]
                    }
                }
            }
        },
        responses: {
            Unauthorized: {
                description: "Unauthorized",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ApiError" }
                    }
                }
            },
            BadRequest: {
                description: "Bad request",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ApiError" }
                    }
                }
            },
            NotFound: {
                description: "Resource not found",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ApiError" }
                    }
                }
            }
        }
    },
    paths: {
        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterRequest" }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "User registered",
                        content: {
                            "application/json": {
                                schema: apiResponse({ $ref: "#/components/schemas/AuthResponseData" }, "User created successfully!")
                            }
                        }
                    },
                    400: { $ref: "#/components/responses/BadRequest" }
                }
            }
        },
        "/api/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Log in",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: apiResponse({ $ref: "#/components/schemas/AuthResponseData" })
                            }
                        }
                    },
                    400: { $ref: "#/components/responses/BadRequest" }
                }
            }
        },
        "/api/items": {
            get: {
                tags: ["Items"],
                summary: "List items",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "category", in: "query", schema: { type: "string" } },
                    { name: "city", in: "query", schema: { type: "string" } },
                    { name: "search", in: "query", schema: { type: "string" } },
                    { name: "state", in: "query", schema: { type: "string", enum: ["AVAILABLE", "SOLD", "ARCHIVED"] } },
                    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 10, maximum: 30 } }
                ],
                responses: {
                    200: {
                        description: "Items retrieved",
                        content: {
                            "application/json": {
                                schema: apiResponse({ $ref: "#/components/schemas/ItemList" })
                            }
                        }
                    },
                    401: { $ref: "#/components/responses/Unauthorized" }
                }
            },
            post: {
                tags: ["Items"],
                summary: "Create an item",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: { $ref: "#/components/schemas/ItemCreateRequest" }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Item created",
                        content: {
                            "application/json": {
                                schema: apiResponse({ $ref: "#/components/schemas/Item" }, "Item is created successfully!")
                            }
                        }
                    },
                    400: { $ref: "#/components/responses/BadRequest" },
                    401: { $ref: "#/components/responses/Unauthorized" }
                }
            }
        },
        "/api/items/{id}": {
            get: {
                tags: ["Items"],
                summary: "Get an item by ID",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                responses: {
                    200: {
                        description: "Item retrieved",
                        content: { "application/json": { schema: apiResponse({ $ref: "#/components/schemas/Item" }) } }
                    },
                    401: { $ref: "#/components/responses/Unauthorized" },
                    404: { $ref: "#/components/responses/NotFound" }
                }
            },
            patch: {
                tags: ["Items"],
                summary: "Update an item",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                requestBody: {
                    content: {
                        "multipart/form-data": {
                            schema: { $ref: "#/components/schemas/ItemCreateRequest" }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Item updated",
                        content: { "application/json": { schema: apiResponse({ $ref: "#/components/schemas/Item" }, "Item is updated successfully!") } }
                    },
                    400: { $ref: "#/components/responses/BadRequest" },
                    401: { $ref: "#/components/responses/Unauthorized" }
                }
            },
            delete: {
                tags: ["Items"],
                summary: "Delete an item",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                responses: {
                    200: { description: "Item deleted", content: { "application/json": { schema: apiResponse({ nullable: true }, "Item is deleted successfully!") } } },
                    401: { $ref: "#/components/responses/Unauthorized" }
                }
            }
        },
        "/api/items/{id}/restore": {
            patch: {
                tags: ["Items"],
                summary: "Restore an archived item",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                responses: { 200: { description: "Item restored" }, 401: { $ref: "#/components/responses/Unauthorized" } }
            }
        },
        "/api/items/{id}/archive": {
            patch: {
                tags: ["Items"],
                summary: "Archive an item",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                responses: { 200: { description: "Item archived" }, 401: { $ref: "#/components/responses/Unauthorized" } }
            }
        },
        "/api/items/{id}/sold": {
            patch: {
                tags: ["Items"],
                summary: "Mark an item as sold",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                responses: { 200: { description: "Item marked as sold" }, 401: { $ref: "#/components/responses/Unauthorized" } }
            }
        },
        "/api/bids": {
            post: {
                tags: ["Bids"],
                summary: "Create a bid",
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/BidRequest" } } } },
                responses: {
                    201: { description: "Bid created", content: { "application/json": { schema: apiResponse({ $ref: "#/components/schemas/Bid" }, "Bid created successfully!") } } },
                    400: { $ref: "#/components/responses/BadRequest" },
                    401: { $ref: "#/components/responses/Unauthorized" }
                }
            }
        },
        "/api/bids/item/{itemId}": {
            get: {
                tags: ["Bids"],
                summary: "List bids by item",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "itemId", in: "path", required: true, schema: objectId }],
                responses: {
                    200: { description: "Bids retrieved", content: { "application/json": { schema: apiResponse({ type: "array", items: { $ref: "#/components/schemas/Bid" } }, "Bids retrieved successfully!") } } },
                    401: { $ref: "#/components/responses/Unauthorized" }
                }
            }
        },
        "/api/bids/{bidId}": {
            get: {
                tags: ["Bids"],
                summary: "Get a bid by ID",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "bidId", in: "path", required: true, schema: objectId }],
                responses: { 200: { description: "Bid retrieved", content: { "application/json": { schema: apiResponse({ $ref: "#/components/schemas/Bid" }) } } }, 401: { $ref: "#/components/responses/Unauthorized" } }
            },
            patch: {
                tags: ["Bids"],
                summary: "Update bid amount",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "bidId", in: "path", required: true, schema: objectId }],
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/BidUpdateRequest" } } } },
                responses: { 200: { description: "Bid updated", content: { "application/json": { schema: apiResponse({ $ref: "#/components/schemas/Bid" }, "Bid updated successfully!") } } }, 401: { $ref: "#/components/responses/Unauthorized" } }
            },
            delete: {
                tags: ["Bids"],
                summary: "Delete a bid",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "bidId", in: "path", required: true, schema: objectId }],
                responses: { 200: { description: "Bid deleted" }, 401: { $ref: "#/components/responses/Unauthorized" } }
            }
        },
        "/api/orders": {
            get: {
                tags: ["Orders"],
                summary: "List authenticated user's orders",
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "Orders retrieved", content: { "application/json": { schema: apiResponse({ type: "array", items: { $ref: "#/components/schemas/Order" } }) } } }, 401: { $ref: "#/components/responses/Unauthorized" } }
            },
            post: {
                tags: ["Orders"],
                summary: "Create an order from the highest bid on an item",
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/OrderRequest" } } } },
                responses: { 201: { description: "Order created", content: { "application/json": { schema: apiResponse({ $ref: "#/components/schemas/Order" }, "Order is created successfully") } } }, 401: { $ref: "#/components/responses/Unauthorized" } }
            }
        },
        "/api/orders/{id}": {
            get: {
                tags: ["Orders"],
                summary: "Get an order by ID",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                responses: { 200: { description: "Order retrieved", content: { "application/json": { schema: apiResponse({ $ref: "#/components/schemas/Order" }) } } }, 401: { $ref: "#/components/responses/Unauthorized" } }
            },
            delete: {
                tags: ["Orders"],
                summary: "Delete an order",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                responses: { 200: { description: "Order deleted" }, 401: { $ref: "#/components/responses/Unauthorized" } }
            }
        },
        "/api/orders/{id}/status": {
            patch: {
                tags: ["Orders"],
                summary: "Update order status",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/OrderStateRequest" } } } },
                responses: { 200: { description: "Order status updated" }, 400: { $ref: "#/components/responses/BadRequest" }, 401: { $ref: "#/components/responses/Unauthorized" } }
            }
        },
        "/api/notifications": {
            get: {
                tags: ["Notifications"],
                summary: "List authenticated user's notifications",
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "Notifications retrieved", content: { "application/json": { schema: apiResponse({ type: "array", items: { $ref: "#/components/schemas/Notification" } }) } } }, 401: { $ref: "#/components/responses/Unauthorized" } }
            }
        },
        "/api/notifications/{id}": {
            delete: {
                tags: ["Notifications"],
                summary: "Delete a notification",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                responses: { 200: { description: "Notification deleted" }, 401: { $ref: "#/components/responses/Unauthorized" } }
            }
        },
        "/api/users": {
            get: {
                tags: ["Users"],
                summary: "List users",
                description: "Requires an admin user.",
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "Users retrieved", content: { "application/json": { schema: apiResponse({ type: "array", items: { $ref: "#/components/schemas/AuthUser" } }) } } }, 401: { $ref: "#/components/responses/Unauthorized" } }
            }
        },
        "/api/users/{id}": {
            get: {
                tags: ["Users"],
                summary: "Get a user by ID",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                responses: { 200: { description: "User retrieved", content: { "application/json": { schema: apiResponse({ $ref: "#/components/schemas/AuthUser" }) } } }, 401: { $ref: "#/components/responses/Unauthorized" } }
            },
            patch: {
                tags: ["Users"],
                summary: "Update a user",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UserUpdateRequest" } } } },
                responses: { 200: { description: "User updated", content: { "application/json": { schema: apiResponse({ $ref: "#/components/schemas/AuthUser" }) } } }, 401: { $ref: "#/components/responses/Unauthorized" } }
            },
            delete: {
                tags: ["Users"],
                summary: "Delete a user account",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: objectId }],
                responses: { 200: { description: "User deleted" }, 401: { $ref: "#/components/responses/Unauthorized" } }
            }
        }
    }
} as const;
