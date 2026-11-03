function validationSlotInput(startsAt,durationMinutes){
    if(!startsAt || typeof startsAt !== "string"){
        return "startAt is required";
    }
    const isoregex =/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
    if(!isoregex.test(startsAt)){
        return " startsAt must be a valid ISO 86601 date-Time";
    }
    const startDate=new Date(startsAt);

    if(Number.isNaN(startDate.getTime())){
        return "Invalid startsAt date";
    }
    if(startDate <= new Date())
    {
        return "startDate must be in the future";
    }

    if(
        !Number.isInteger(durationMinutes)||
        durationMinutes < 15 ||
        durationMinutes > 60
    ){
        return "durationMinutes must be an integer betwwwen 15 and 60";
    }
    return null;
}

module.exports={validateSoltInput};