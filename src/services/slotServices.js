const{v4:uuidv4} =require("uuid");
const{slots} = require("../config/store");

function createSlot(recruiterId,startsAt,durationMinutes){
    const start =new Date(startsAt);
    const end=new Date(
        start.getTime()+durationMinutes*60000
    );

    const hasOverlap =slots.some((slot) => {
        if(slot.recruiterId !== recruiterId) return false;
        if(slot.status === "cancelled")return false;

        const existingStart =new Date(slot.startsAt);
        const existingEnd =new Date(
            existingStart.getTime() + slot.durationMinutes*60000
        );
        return start < existingEnd && existingStart < end;
    });

    if (hasOverlap){
        const error =new Error(
            "Recuiter already has an overlapping active slot"
        );
        error.statusCode =409;
        error.code ="SLOT_OVERLAP";
        throw error;
    }

    const newSlot={
        id: uuidv4(),
        recruiterId,
        startsAt:start.toISOString(),
        status:"open",
        candidateId:null,
        createdAt:new Date().toISOString()
    };
    slots.push(newSlot);
    return newSlot;
}

module.exports={createSlot};