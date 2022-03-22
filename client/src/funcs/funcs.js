import {DateTime} from "luxon";


// Приведение даты в человеческий вид
export const dateFromIsoToLocal = date => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT)
}


// Окрашивание рядов в таблице, в зависимости от времени последнего пакета
export const getClassesForRow = (time) => {
    const classes = "text-center text-stone-900 hover:shadow-inner-xl last:rounded-b-xl"
    if (!time) return `${classes} bg-gray-100`
    const getDateDiff = (DateTime.now().diff(DateTime.fromISO(time), 'hours')).values.hours
    if (getDateDiff < 0.16) return `${classes} bg-green-300`
    if (getDateDiff >= 0.16 && getDateDiff < 2) return `${classes} bg-yellow-300`
    if (getDateDiff >= 2 && getDateDiff < 5) return `${classes} bg-purple-300`
    if (getDateDiff >= 5) return `${classes} bg-red-300`
}

// Определение позиции контекстного меню
export const calculatePosition = (posX, posY, menuWidth, menuHeight) => {
    let position = {
        left: `${String(posX + 10)}px`,
        top: `${String(posY + 10)}px`
    }
    if (posX > window.innerWidth - menuWidth && posY > window.innerHeight - menuHeight) {
        position = {
            left: `${String(posX - menuWidth -10)}px`,
            top: `${String(posY - (menuHeight - (window.innerHeight - posY)))}px`
        }
    }
    else if (posY > window.innerHeight - menuHeight) {
        position = {
            left: `${String(posX + 10)}px`,
            top: `${String(posY - (menuHeight - (window.innerHeight - posY)))}px`
        }
    }
    else if (posX > window.innerWidth - menuWidth) {
        position = {
            left: `${String(posX - menuWidth - 10)}px`,
            top: `${String(posY + 10)}px`
        }
    }
    return position
}