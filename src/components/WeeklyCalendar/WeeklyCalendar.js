import React, { useState, useEffect } from 'react'
import styles from './WeeklyCalendar.module.scss'
import classNames from 'classnames/bind'

import CalendarItem from '../CalendarItem/CalendarItem'
import ButtonArea from '../ButtonArea/ButtonArea'

const cx = classNames.bind(styles)
const moment = require('moment')

const curDay = new Date()
const year = curDay.getFullYear()
const month = curDay.getMonth()
const date = curDay.getDate()
const dayOfWeek = curDay.getDay()

const WeeklyCalendar = () => {
	const [week, setWeek] = useState([])
	const dayOfWeekList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	const timeLine = new Array(24)
	const [dragImg, setDragImg] = useState();
	const [dragging, setDragging] = useState({ startAt: undefined, endAt: undefined })
	for (var i = 0; i < timeLine.length; i++) {
		timeLine[i] = i
	}

	const getThisWeek = () => {
		const thisWeek = []

		for (var i = 0; i < 7; i++) {
			thisWeek.push(new Date(year, month, date + (i - dayOfWeek)))
		}

		setWeek(thisWeek)
	}

	const changeWeek = (state) => {
		const tempWeek = []
		for (let i = 0; i < 7; i++) {
			var temp = new Date(week[i])
			temp.setDate(temp.getDate() + (state ? 7 : -7))
			tempWeek.push(temp)
		}
		setWeek(tempWeek)
	}

	const log = (info) => {
		console.log(info.getFullYear(), info.getMonth() + 1, info.getDate())
	}

	const timelog = (time, value) => {
		console.log(value === '0' ? time + ':00 ~ ' + time + ':30' : time + ':30 ~ ' + (time + 1) + ':00')
	}

	useEffect(() => {
		getThisWeek()
		const img = new Image()
		img.src = 'https://avatars1.githubusercontent.com/u/19828721?s=96&v=4'
		img.onload = () => setDragImg(img)
	}, [])

	const calendarItemList = [
		{
			title: '테스트',
			startAt: '2020-10-22 12:30',
			endAt: '2020-10-22 15:00',
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '테스트',
			startAt: '2020-10-18 04:20',
			endAt: '2020-10-18 07:35',
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '테스트',
			startAt: '2020-10-27 06:40',
			endAt: '2020-10-27 11:20',
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
	]

	const calcStartPoint = (startDate) => {
		return (new Date(startDate).getHours() * 60 + new Date(startDate).getMinutes()) * (26 / 30)
	}

	const calcCalendarItemHeight = (startDate, endDate) => {
		return ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60)) * (26 / 30)
	}
	const diffMinutes = (start, end) => (end - start) / 60000

	const handleDragStart = (date, hour, e) => {
		// let dragImg = new Image(0, 0)
		// dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
		e.dataTransfer.setDragImage(dragImg, -10, -10)
		const startAt = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, e.target.getAttribute('data-value'))
		let endAt = new Date(startAt)
		endAt.setMinutes(endAt.getMinutes() + 30)
		setDragging({
			startAt: startAt,
			endAt: endAt
		})
	}

	const handleDragEnd = () => { console.log(dragging); setDragging({ startAt: undefined, endAt: undefined }) }

	const handleDragEnterOrDrop = (date, hour, minutes) => {
		const endAt = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minutes)
		endAt.setMinutes(endAt.getMinutes() + 30)
		if (diffMinutes(dragging.endAt, endAt) === 30) {
			setDragging({
				...dragging,
				endAt: endAt
			})
		}
	}

	const handleDragOver = (e) => {
		e.stopPropagation();
		e.preventDefault();
	}

	return (
		<>
			<ButtonArea data={week} getThis={getThisWeek} getChange={changeWeek} />
			<strong className={cx('range')}>
				{moment(week[0]).format('YYYY.MM.DD')} ~{moment(week[6]).format('YYYY.MM.DD')}
			</strong>
			<div className={cx('table')}>
				<div className={cx('header')}>
					{dayOfWeekList.map((dayOfWeek, index) => (
						<div key={index} className={cx('date', new Date(week[index]) < new Date() && 'dimmed')}>
							{new Date(week[index]).getDate()}
							<em>{dayOfWeek}</em>
						</div>
					))}
				</div>
				<div className={cx('view_wrap')}>
					<div className={cx('allday')}>
						<div className={cx('time')}>allday</div>
						<div className={cx('view')}>
							{week.map((info, index) => (
								<div className={cx('allday_cell')} key={index} onClick={() => log(info)}></div>
							))}
						</div>
					</div>
					<div className={cx('schedule')}>
						<div className={cx('time')}>
							{timeLine.map((time) => (
								<div key={time} className={cx('time_cell')}>
									<span className={cx('time_stamp')}>{time}</span>
								</div>
							))}
						</div>
						<div className={cx('view')}>
							{week.map((info, index) => (
								<div className={cx('view_cell')} key={index} onClick={() => log(info)}>
									{timeLine.map((time) => (
										<div className={cx('detail_wrap')} key={time}
											draggable
											onDragStart={(e) => handleDragStart(info, time, e)}
											onDragEnd={handleDragEnd}
											onDragEnter={(e) => handleDragEnterOrDrop(info, time, e.target.getAttribute('data-value'))}
											onDrop={(e) => handleDragEnterOrDrop(info, time, e.target.getAttribute('data-value'))}
											onDragOver={handleDragOver}
										>
											<div className={cx('detail_cell')} data-value="0"></div>
											<div className={cx('detail_cell')} data-value="30"></div>
										</div>
									))}
									{calendarItemList.map(
										(calendarItem) =>
											info.getDate() === new Date(calendarItem.startAt).getDate() && (
												<CalendarItem
													{...calendarItem}
													style={{
														top: calcStartPoint(calendarItem.startAt),
														left: '0',
														right: '5px',
														height: calcCalendarItemHeight(
															calendarItem.startAt,
															calendarItem.endAt,
														),
													}}
												/>
											),
									)}
									{
										dragging.startAt?.getDate() === info.getDate() &&
										<div style={{
											position: "absolute",
											top: calcStartPoint(dragging.startAt),
											left: '0',
											right: '5px',
											height: calcCalendarItemHeight(
												dragging.startAt,
												dragging.endAt,
											),
											backgroundColor: 'orange',
											zIndex: '-5'
										}}
										/>
									}
								</div>
							))}
						</div>
						<div></div>
					</div>
				</div>
			</div>
		</>
	)
}

export default WeeklyCalendar
