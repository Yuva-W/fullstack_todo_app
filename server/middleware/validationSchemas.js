const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    password: Joi.string()
        .min(6)
        .max(100)
        .required()
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    password: Joi.string()
        .required()
});

const createTodoSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(1)
        .max(200)
        .required(),

    description: Joi.string()
        .trim()
        .max(1000)
        .allow(""),

    completed: Joi.boolean()
        .default(false)
});

const updateTodoSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(1)
        .max(200),

    description: Joi.string()
        .trim()
        .max(1000)
        .allow(""),

    completed: Joi.boolean()
}).min(1);

const getTodosQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(10),

    search: Joi.string()
        .trim()
        .max(100)
        .allow(""),

    completed: Joi.boolean()
});

module.exports = {
    registerSchema,
    loginSchema,
    createTodoSchema,
    updateTodoSchema,
    getTodosQuerySchema
};