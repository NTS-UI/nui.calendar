import React, { useEffect, useState } from 'react'

import classNames from 'classnames/bind'
import { getCategoryList } from './commonState'
import { createCalendar, deleteCalendar, updateCalendar } from '../../reducers/calendar'

import { useCalendarContext } from '../../contexts/calendar'
import CalendarItemPopupPortal from './CalendarItemPopupPortal'

import styles from './CalendarItemPopupInfo.module.scss'
import useInput from './useInput'
import useToggle from './useToggle'
import { InputCheckbox, InputDate, InputSelector, InputText } from './Input'
import { parseDateToString, parseDateToTimeString } from '../../utils/calendar'

const cx = classNames.bind(styles)

const CalendarItemPopupInfo = ({ id, handleClose, isNew = false, ...item }) => {
	const { calendarDispatch } = useCalendarContext()

	const {
		calendarId,
		title = '할 일',
		startAt = new Date(),
		endAt = new Date(),
		category = 'A',
		isAllDay = false,
		isBlocked = false,
	} = item

	const handleInputDate = (e) => {
		const { type, value } = e.target

		if (type === 'time') {
			const [hours, minutes] = value.split(':')
			const formattedDate = new Date(startAtState)

			formattedDate.setHours(hours)
			formattedDate.setMinutes(minutes)

			return formattedDate
		}

		return new Date(value)
	}

	const [calendarIdState, setCalendarIdState] = useState(calendarId)

	const createNewCalendarItem = (newCalendarId) => {
		const action = createCalendar({
			calendarId: newCalendarId,
			title: titleState,
			startAt: startAtState,
			endAt: endAtState,
			category: categoryState,
			isAllDay: isAllDayState,
			isBlocked: isBlockedState,
		})

		calendarDispatch(action)
	}

	useEffect(() => {
		if (isNew) {
			const newCalendarItemId = Math.random()

			setCalendarIdState(newCalendarItemId)
			createNewCalendarItem(newCalendarItemId)
		}
	}, [])

	const [titleState, handleTitleChange] = useInput({ initialValue: title })
	const [startAtState, handleStartDateAtChange] = useInput({ initialValue: startAt, handleChange: handleInputDate })
	const [endAtState, handleEndDateAtChange] = useInput({ initialValue: endAt, handleChange: handleInputDate })
	const [categoryState, handleCategoryChange] = useInput({ initialValue: category })
	const [isAllDayState, handleIsAllDayChange] = useToggle({ initialValue: isAllDay })
	const [isBlockedState, handleIsBlockedChange] = useToggle({ initialValue: isBlocked })

	const onDelete = (e) => {
		calendarDispatch(deleteCalendar(calendarIdState))

		handleClose(e)
	}

	const onDone = (e) => {
		const action = updateCalendar({
			calendarId: calendarIdState,
			title: titleState,
			startAt: startAtState,
			endAt: endAtState,
			category: categoryState,
			isAllDay: isAllDayState,
			isBlocked: isBlockedState,
		})

		calendarDispatch(action)

		handleClose(e)
	}

	return (
		<CalendarItemPopupPortal id={id} handleClose={handleClose}>
			<div className={cx('component')}>
				<div className={cx('area-flex')}>
					<div className={cx('item', 'type-none')}>
						<InputSelector
							id="category"
							value={categoryState}
							list={getCategoryList()}
							handler={handleCategoryChange}
							readOnly={isBlockedState}
						/>
					</div>
					<div className={cx('item')}>
						<InputText
							id="title"
							placeholder="할 일"
							value={titleState}
							handler={handleTitleChange}
							readOnly={isBlockedState}
						/>
					</div>
					<div className={cx('item', 'type-none')}>
						<button type="button" className={cx('button')} onClick={handleIsBlockedChange}>
							{isBlockedState ? <>잠금해제</> : <>잠금</>}
						</button>
					</div>
				</div>
				<div className={cx('area-flex')}>
					{isAllDayState ? (
						<>
							<div className={cx('item', 'type-date')}>
								<InputDate
									id="date-start"
									value={parseDateToString(startAtState)}
									handler={handleStartDateAtChange}
									readOnly={isBlockedState}
								/>
							</div>
							<div className={cx('item', 'type-date')}>
								<InputDate
									id="date-end"
									value={parseDateToString(endAtState)}
									handler={handleEndDateAtChange}
									readOnly={isBlockedState}
								/>
							</div>
						</>
					) : (
						<>
							<div className={cx('item', 'type-date')}>
								<InputDate
									id="time-start"
									value={parseDateToTimeString(startAtState)}
									handler={handleStartDateAtChange}
									typeTime
									readOnly={isBlockedState}
								/>
							</div>
							<div className={cx('item', 'type-date')}>
								<InputDate
									id="time-end"
									value={parseDateToTimeString(endAtState)}
									handler={handleEndDateAtChange}
									typeTime
									readOnly={isBlockedState}
								/>
							</div>
						</>
					)}
				</div>
				<div className={cx('area-flex')}>
					<div className={cx('item')}>
						<InputCheckbox
							id="all-day"
							label="하루 종일"
							value={isAllDayState}
							handler={handleIsAllDayChange}
						/>
					</div>
				</div>
				<div className={cx('area-button')}>
					<div className={cx('cell')}>
						<button type="button" className={cx('button')} onClick={onDelete}>
							Delete
						</button>
					</div>
					<div className={cx('cell')}>
						<button type="button" className={cx('button')} onClick={onDone}>
							Done
						</button>
					</div>
				</div>
			</div>
		</CalendarItemPopupPortal>
	)
}

export default CalendarItemPopupInfo
