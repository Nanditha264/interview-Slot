const { createSlot } = require("../services/slotService");
const { validateSlotInput } = require("../utils/validation");
const { successResponse, errorResponse } =
    require("../utils/response");

function postSlot(req, res, next) {
    try {
        const { startsAt, durationMinutes } = req.body;

        const validationError = validateSlotInput(
            startsAt,
            durationMinutes
        );

        if (validationError) {
            return errorResponse(
                res,
                400,
                "VALIDATION_ERROR",
                validationError
            );
        }

        const slot = createSlot(
            req.user.id,
            startsAt,
            durationMinutes
        );

        return successResponse(
            res,
            201,
            slot,
            "Interview slot created successfully"
        );
    } catch (error) {
        next(error);
    }
}

module.exports = { postSlot };