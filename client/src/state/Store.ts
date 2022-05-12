import { makeAutoObservable } from "mobx"
import { MouseEvent } from 'react'
import {
    executors,
    outlookMessagesInterface, regions,
    RequestDataInterface, requestTypes,
    Statistics,
    TableDataInterface, users
} from "../interfaces/interfaces";

class Store {
    tableData: TableDataInterface[] = []
    requestsData: RequestDataInterface[] = []
    mailsLoading: boolean = true
    mailsError: boolean = false
    mailOffset: number = 0
    inputReg: string = ''
    inputVin: string = ''
    inputId: string = ''
    mouseX: number | null = null
    mouseY: number | null = null
    showRequestContextMenu: boolean = false
    showVehiclesContextMenu: boolean = false
    isShowNotification: boolean = false
    notificationText: string = ''
    currentRegionSelected: string = 'all'
    isShowUnexecuted: boolean = false
    currentExecutors: executors[] = []
    currentRequestTypes: requestTypes[] =[]
    currentRegions: regions[] = []
    lastMails: outlookMessagesInterface[] = []
    showRequestModal: boolean = false
    showAddFileModal: boolean = false
    reqChosenExecutors: string[] = []
    reqChosenType: string = ''
    reqChosenRegion: string = ''
    reqChosenComment: string = ''
    reqChosenMail: outlookMessagesInterface | null = null
    currentUsers: users[] | null = null
    currentUser: string = 'Михайлов В.'
    currentVehicle: TableDataInterface | null = null
    currentRequest: RequestDataInterface | null = null
    vehiclePageLocation: boolean = false
    previousRequestsData: RequestDataInterface[] = []
    isBubbleContextShow: boolean = false
    bubbleContextText: string = ''
    bubbleContextXCoord: number | null = null
    bubbleContextYCoord: number | null = null
    selectedText: string = ''
    isCheckStatusModalShow: boolean = false
    offsetY: number = 0
    isShowEditRequestModal: boolean = false
    isShowSendMessageModal: boolean = false
    isShowCarlistModal: boolean = false
    foundVehiclesByRegNom: TableDataInterface[] = []
    sortBy: string = 'date'
    checkStatusLoading: boolean = false
    searchInputValue: string = ''

    //confirmation state
    isConfirmation: boolean = false
    confirmationType: string = ''

    //statistics state
    dateFrom: Date | null = null
    dateTill: Date | null = null
    currentStat: Statistics | null = null
    isLoadingStat: boolean = false


    constructor() {
        makeAutoObservable(this)
    }

    // Table funcs
    setTableData = (data: TableDataInterface[]) => {
        this.tableData = data
    }


    // Requests funcs
    setRequestsData = (data: RequestDataInterface[]) => {
        this.requestsData = data
    }

    setMailsLoading = (bool: boolean) => {
        this.mailsLoading = bool
    }

    setMailsError = (bool: boolean) => {
        this.mailsError = bool
    }

    increaseMailOffset = (num: number) => {
        this.mailOffset = this.mailOffset + num
    }

    resetMailOffset = () => {
        this.mailOffset = 0
    }

    // Search inputs funcs
    handleInputReg = (value: string) => {
        this.inputReg = value
    }

    handleInputVin = (value: string) => {
        this.inputVin = value
    }

    handleInputId = (value: string) => {
        this.inputId = value
    }

    clearRegPassiveValues = () => {
        this.inputVin = ''
        this.inputId = ''
    }

    clearIdPassiveValues = () => {
        this.inputVin = ''
        this.inputReg = ''
    }

    clearVinPassiveValues = () => {
        this.inputReg = ''
        this.inputId = ''
    }

    clearAllInputs = () => {
        this.inputReg = ''
        this.inputId = ''
        this.inputVin = ''
    }

    // Mouse position

    setPosX = (e: MouseEvent<HTMLButtonElement>) => {
        this.mouseX = e.pageX
    }

    setPosY = (e: MouseEvent<HTMLButtonElement>) => {
        this.mouseY = e.pageY
    }

    // Context menu
    setShowRequestContextMenu = (bool: boolean) => {
        this.showRequestContextMenu = bool
    }

    setShowVehiclesContextMenu = (bool: boolean) => {
        this.showVehiclesContextMenu = bool
    }

    // Notification
    showNotification = () => {
        this.isShowNotification = true
    }

    hideNotification = () => {
        this.isShowNotification = false
    }

    setNotificationText = (text: string) => {
        this.notificationText = text
    }

    // Region selected
    setCurrentRegionSelected = (region: string) => {
        this.currentRegionSelected = region
    }

    toggleIsShowUnexecuted = () => {
        this.isShowUnexecuted = !this.isShowUnexecuted
    }

    setCurrentExecutors = (data: executors[]) => {
        this.currentExecutors = data
    }

    setRequestsTypes = (data: requestTypes[]) => {
        this.currentRequestTypes = data
    }

    setLastMails = (data: outlookMessagesInterface[]) => {
        this.lastMails = data
    }

    setCurrentRegions = (data: regions[]) => {
        this.currentRegions = data
    }

    setShowRequestModal = (bool: boolean) => {
        this.showRequestModal = bool
    }

    // Requests fields
    setReqChosenType = (data: string) => {
        this.reqChosenType = data
    }

    setReqChosenRegion = (data: string) => {
        this.reqChosenRegion = data
    }

    setReqChosenComment = (data: string) => {
        this.reqChosenComment = data
    }

    setReqChosenMail = (data: outlookMessagesInterface) => {
        this.reqChosenMail = data
    }

    setReqChosenExecutors = (array: string[]) => {
        this.reqChosenExecutors = array
    }


    setCurrentUser = (data: string) => {
        this.currentUser = data
    }

    setCurrentUsers = (data: users[]) => {
        this.currentUsers = data
    }

    // Выбранная техника
    setCurrentVehicle = (data: TableDataInterface) => {
        this.currentVehicle = data
    }

    setCurrentRequest = (data: RequestDataInterface) => {
        this.currentRequest = data
    }

    // Загруженная страница
    setVehiclePageLocation = (bool: boolean) => {
        this.vehiclePageLocation = bool
    }

    // Предыдущие заявки
    setPreviousRequestsData = (data: RequestDataInterface[]) => {
        this.previousRequestsData = data
    }

    // Всплывающее окно при застывании мыши
    setIsBubbleContextShow = (bool: boolean) => {
        this.isBubbleContextShow = bool
    }

    setBubbleContextText = (text: string) => {
        this.bubbleContextText = text
    }

    setBubbleContextXCoord = (coord: number) => {
        this.bubbleContextXCoord = coord
    }

    setBubbleContextYCoord = (coord: number) => {
        this.bubbleContextYCoord = coord
    }

    // Selection
    setSelectedText = (text: string) => {
        this.selectedText = text
    }

    // Открытие окна проверки статуса
    setIsCheckStatusModalShow = (bool: boolean) => {
        this.isCheckStatusModalShow = bool
    }

    // Открытие окна добавления файла
    setShowAddFileModal = (bool: boolean) => {
        this.showAddFileModal = bool
    }


    setOffsetY = () => {
        this.offsetY = window.scrollY
    }

    setIsShowEditRequestModal = (bool: boolean) => {
        this.isShowEditRequestModal = bool
    }


    setIsShowSendMessageModal = (bool: boolean) => {
        this.isShowSendMessageModal = bool
    }

    setIsShowCarlistModal = (bool: boolean) => {
        this.isShowCarlistModal = bool
    }


    // Список поиска техники из контекстного меню заявок для проверки статуса
    setFoundVehiclesByRegNom = (data: TableDataInterface[]) => {
        this.foundVehiclesByRegNom = data
    }

    setSortBy = (sortType: string) => {
        this.sortBy = sortType
    }

    setCheckStatusLoading = (bool: boolean) => {
        this.checkStatusLoading = bool
    }

    setSearchInputValue = (value: string) => {
        this.searchInputValue = value
    }

    //statistics
    setDateFrom(date: Date) {
        this.dateFrom = date
    }
    setDateTill(date: Date) {
        this.dateTill = date
    }
    setCurrentStat(stat: Statistics) {
        this.currentStat = stat
    }
    setIsLoadingStat(bool: boolean) {
        this.isLoadingStat = bool
    }


    setIsConfirmation(bool: boolean) {
        this.isConfirmation = bool
    }

    setConfirmationType(type: string) {
        this.confirmationType = type
    }
}


export default new Store()