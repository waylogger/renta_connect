

/**
 * @module BookingPeriod.ts
*/
import { SingleCar } from "../CORS/entities/apiExchange/serverTypes";

/**
 * @description способ хранения периодов времени полученных от сервера
*/
export interface BookingPeriod{
	begin: Date;
	end: Date;
}

export interface BookingPeriods{
	car_id: number,
	periods: BookingPeriod[],
}
