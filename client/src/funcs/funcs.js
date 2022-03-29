import {DateTime} from "luxon";
import {toJS} from "mobx";
import Store from "../state/Store";


// Приведение даты в человеческий вид
export const dateFromIsoToLocal = date => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT)
}


// Окрашивание рядов в таблице, в зависимости от времени последнего пакета
export const getClassesForRow = (row, currentVehicle=null) => {
    let classes = "text-center last:rounded-b-xl"
    if (currentVehicle && currentVehicle.REG_NOM === row.values.REG_NOM && Store.showContextMenu) {
        return `${classes} bg-stone-500 text-white`
    } else {
        if (!row.values.LAST_DATE) return `${classes} bg-gray-100 text-stone-900`
        const getDateDiff = (DateTime.now().diff(DateTime.fromISO(row.values.LAST_DATE), 'hours')).values.hours
        if (getDateDiff < 0.16) return `${classes} bg-green-300 text-stone-900`
        if (getDateDiff >= 0.16 && getDateDiff < 2) return `${classes} bg-yellow-300 text-stone-900`
        if (getDateDiff >= 2 && getDateDiff < 5) return `${classes} bg-purple-300 text-stone-900`
        if (getDateDiff >= 5) return `${classes} bg-red-300 text-stone-900`
    }

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

export const sortRequest = (sortType) => {
    let newRequestData = toJS(Store.requestsData)
    if (sortType === 'date') {
        newRequestData = newRequestData.sort((a, b) =>  new Date(b.CreateDate) - new Date(a.CreateDate));
    } else {
        newRequestData = newRequestData.sort((a, b) => (a[sortType]===null)-(b[sortType]===null) || +(a[sortType]>b[sortType])||-(a[sortType]<b[sortType]));
    }
    Store.setRequestsData(newRequestData)
}