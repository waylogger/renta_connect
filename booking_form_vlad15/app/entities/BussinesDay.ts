//BussinesDay.ts
/**
 * @module BussinesDay.ts
 * @descriptionx смысл модуля в том, чтобы предоставить внешней логике класс для управления одним днем года
 * @author wlr986 <wayloggerman@gmail.com>
*/
import { BussinesTimeSlot } from './BussinesTimeSlot'
import { addHours, eachMinuteOfInterval, isAfter, isBefore, isEqual } from 'date-fns'
import { SingleCar } from '../CORS/entities/apiExchange/serverTypes';

/**
 * @remark класс дня, он включает в себя 96 отрезков по 15 минут и методы для обеспечания работы каждого из отрезков, а также пречень машин, которые заняты в этот день 
 * ```
 * 	const instance = new BussinesDay(new Date(Date.now()));
 * ```
*/
export class BussinesDay {

	/**
	 * @description массив содержит 96 отрезков по 15 минут
	*/
	private readonly timeslotsOfDay: BussinesTimeSlot[] = [];
	/**
	 * @description массив содержит данные каждого автомобиля, который занят в этот день хотябы 1 слот
	*/
	private readonly carsIncludedInDay: SingleCar[];
	/**
	 * @description timestamp текущего дня, если его время не равно 00:00, то он должен быть приведен к этому времени
	*/
	private readonly timestamp: Date;

	/**
	 * @description смысл действий по инициализации нового объекта сводятся к тому, чтобы обнулить timestamp, а потом разбить день на отрезки по 15 минут, после чего сформировать вокруг каждого отрезка объект BussinesTimeSlot
	*/
	constructor(timestamp: Date) {
		this.carsIncludedInDay = [];
		this.timestamp = this.roundTime(timestamp);
		const slots: Date[] = eachMinuteOfInterval({ start: this.timestamp, end: addHours(this.timestamp, 24) }, { step: 15 });
		slots.forEach(slot => this.timeslotsOfDay.push(new BussinesTimeSlot(slot)));
		
		
	}

	/**
	 * @param timestamp текущего дня
	 * @returns тот же timestamp, но временем равным 00:00:00
	 * ```
	 * 	const time: Date = new Date(2021,07,11,15,30);
	 * 	console.log(roundTime(time).toLocaleString());
	 * 	//expect 07.11.2021, 00:00:00 
	 * ```
	*/
	public roundTime(timestamp: Date): Date {
		return new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate(), 0, 0, 0);
	}
	/**
	 * @description принимает timestamp и выбрасывает исключение в случае неправильного времени (до текущей даты или после, либо время не кратно 15 минутам)
	*/
	private checkTimestamp(timestamp: Date): void {
		if (timestamp.getMinutes() % 15 != 0)
			throw new Error('BussinesDay::bookingCar()  receive timestamp not multiple of 15');
		if (isAfter(timestamp,addHours(new Date(this.timestamp),24)))
			throw new Error('BussinesDay::bookingCar() receive timestamp after booking day');
		if (isBefore(timestamp,this.timestamp))	
			throw new Error('BussinesDay::bookingCar() receive timestamp before booking day');
	}

	/**
	 * @description возращаем сохраненный timestamp (округленный)
	 * ```
	 * 	const day = new BussinesDay(new Date(2021,07,11,15,30,55));
	 * 	console.log(day.getTimestamp().toLocaleString());
	 * 	//expect 07.11.2021, 00:00:00
	 * ```
	*/
	public getTimestamp(): Date {
		return this.timestamp;
	}

	/**
	 * @descriptrion ищем слот по timestamp
	*/
	public getTimeSlot(timestamp: Date): BussinesTimeSlot | undefined {
		this.checkTimestamp(timestamp);
		
		return this.timeslotsOfDay.find(
			(item) => {
				
				return isEqual(item.getTimestamp(),timestamp);
			}
		);
	}

	/**
	 * @param car - авто для установления брони
	 * @param timestamp - время для бронирования
	 * @returns true в случае успешного установленя брони
	 * @description side-effect при успехе авто сохраняется в carIncludedInDay
	*/
	public bookingCar(car: SingleCar, timestamp: Date): Boolean {
		this.checkTimestamp(timestamp);
		/**
		 * теперь мы знаем, что полученная дата кратная 15 минутам и находится в границах текущего дня
		*/
		let res: Boolean = false;
		this.timeslotsOfDay.forEach((item)=>{
			if (isEqual(item.getTimestamp(),timestamp)){
				item.bookingCar(car);
				res = true;
				this.carsIncludedInDay.push(car);
			}
		});
		return res;
	}
	
	/**
	 * @param car - проверяем есть ли бронь на эту машину в этот день
	 * @returns true если авто найдено
	*/
	public carIsBusy(car: SingleCar): Boolean{
		return this.carsIncludedInDay.findIndex((item)=>car === car) >= 0 ? true : false;
	}





}