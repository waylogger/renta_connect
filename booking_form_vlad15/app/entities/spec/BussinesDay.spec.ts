/**
 * @module BussinesDay.spec.ts
*/
import addHours from 'date-fns/addHours';
import eachMinuteOfInterval from 'date-fns/eachMinuteOfInterval';
import {BussinesDay} from '../BussinesDay'
import {SingleCar} from '../../CORS/entities/apiExchange/serverTypes'




//-------------------------------------------------------------------------------------------------
describe('BussinesDay shold pass all tests', () => {
	const time: Date = new Date(2021,6,24,15,30);
	const roundTime: Date = new Date(2021,6,24,0,0);
	const car: SingleCar = {
		car_id: 0,
		model: "13",
		year:0
	}
	const day: BussinesDay = new BussinesDay(time);
	const slots = eachMinuteOfInterval({start:roundTime, end: addHours(roundTime,24)},{step:15});
	// -----------------------------------------------------------------------------------------	
	test('Constructor should: round timestamp and create 96 slots', () => {
		expect(day.getTimestamp()).toEqual(roundTime);
		slots.forEach(
			(item)=>{
				expect(day.getTimeSlot(item)).toBeDefined();
			}
		)
	});
	// -------------------------------------------------------------------------------------------
	test('Booking car should put car in timeslot',()=>{
		expect(day.bookingCar(car,time)).toBe(true);
		expect(day.carIsBusy(car)).toBe(true);
	})

});