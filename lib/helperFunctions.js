import { NextResponse } from "next/server"

export const response = (success, statusCode, message, data = {}) => {
    return NextResponse.json({
        success,
        statusCode,
        message,
        data
    })
}

export const catchError = (error, customMessage) => {
    if (error.code === 11000) {
        const keys = Object.keys(error.keyPattern).join(", ")
        error.message = `Duplicate key error: ${keys} already exists.`
    }
    let errorObj = {};

    if (process.env.NODE_ENV === "development") {
        errorObj = {
            message: error.message,
            error
        };
    } else {
        errorObj = {
            message: customMessage || "An error occurred",
        };
    }

    return response(
        false,
        error.statusCode || 500,
        errorObj.message,
        errorObj.error || {}
    );
}