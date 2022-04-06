import { makeAutoObservable } from "mobx"

class Store {
    tableData = []
    requestsData = []
    loading = false
    mailsLoading = true
    mailsError = false
    error = false
    inputReg = ''
    inputVin = ''
    inputId = ''
    mouseX = null
    mouseY = null
    showContextMenu = false
    isShowNotification = false
    notificationText = ''
    currentRegionSelected = 'all'
    isShowUnexecuted = false
    currentExecutors = []
    currentRequestTypes =[]
    currentRegions = []
    lastMails = []
    showRequestModal = false
    showAddFileModal = false
    reqChosenExecutors = []
    reqChosenType = ''
    reqChosenRegion = ''
    reqChosenComment = ''
    reqChosenMail = null
    reqPlannedDate = null
    currentUsers = null
    currentUser = 'Михайлов В.'
    currentVehicle = null
    currentRequest = null
    vehiclePageLocation = false
    previousRequestsData = []
    isBubbleContextShow = false
    bubbleContextText = ''
    bubbleContextXCoord = null
    bubbleContextYCoord = null
    selectedText = ''
    isCheckStatusModalShow = false
    offsetY = 0
    isShowEditRequestModal = false
    isShowSendMessageModal = false
    isShowCarlistModal = false
    foundVehiclesByRegNom = []
    sortBy = 'date'
    checkStatusLoading = false
    searchInputValue = ''

    //statistics state
    dateFrom = null
    dateTill = null
    currentStat = null
    isLoadingStat = false


    constructor() {
        makeAutoObservable(this)
    }

    // Table funcs
    setTableData = data => {
        this.tableData = data
    }

    clearTableData = () => {
        this.tableData = []
    }

    // Requests funcs
    setRequestsData = data => {
        this.requestsData = data
    }

    // loading funcs
    setLoading = status => {
        this.loading = status
    }

    setMailsLoading = status => {
        this.mailsLoading = status
    }

    // error funcs
    setError = status => {
        this.error = status
    }

    setMailsError = bool => {
        this.mailsError = bool
    }

    // Search inputs funcs
    handleInputReg = value => {
        this.inputReg = value
    }

    handleInputVin = value => {
        this.inputVin = value
    }

    handleInputId = value => {
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

    setPosX = e => {
        this.mouseX = e.pageX
    }

    setPosY = e => {
        this.mouseY = e.pageY
    }

    // Context menu
    setContextMenu = state => {
        this.showContextMenu = state
    }

    // Notification
    showNotification = () => {
        this.isShowNotification = true
    }

    hideNotification = () => {
        this.isShowNotification = false
    }

    setNotificationText = text => {
        this.notificationText = text
    }

    // Region selected
    setCurrentRegionSelected = region => {
        this.currentRegionSelected = region
    }

    toggleIsShowUnexecuted = () => {
        this.isShowUnexecuted = !this.isShowUnexecuted
    }

    setCurrentExecutors = (data) => {
        this.currentExecutors = data
    }

    setRequestsTypes = (data) => {
        this.currentRequestTypes = data
    }

    setLastMails = (data) => {
        this.lastMails = data
    }

    setCurrentRegions = (data) => {
        this.currentRegions = data
    }

    setShowRequestModal = (status) => {
        this.showRequestModal = status
    }

    // Requests fields
    setReqChosenType = data => {
        this.reqChosenType = data
    }

    setReqChosenRegion = data => {
        this.reqChosenRegion = data
    }

    setReqChosenComment = data => {
        this.reqChosenComment = data
    }

    setReqChosenMail = data => {
        this.reqChosenMail = data
    }

    setReqChosenExecutors = item => {
        this.reqChosenExecutors = item
    }

    setReqPlannedDate = date => {
        this.reqPlannedDate = date
    }

    setCurrentUser = data => {
        this.currentUser = data
    }

    setCurrentUsers = data => {
        this.currentUsers = data
    }

    // Выбранная техника
    setCurrentVehicle = data => {
        this.currentVehicle = data
    }

    setCurrentRequest = data => {
        this.currentRequest = data
    }

    // Загруженная страница
    setVehiclePageLocation = bool => {
        this.vehiclePageLocation = bool
    }

    // Предыдущие заявки
    setPreviousRequestsData = data => {
        this.previousRequestsData = data
    }

    // Всплывающее окно при застывании мыши
    setIsBubbleContextShow = boolean => {
        this.isBubbleContextShow = boolean
    }

    setBubbleContextText = text => {
        this.bubbleContextText = text
    }

    setBubbleContextXCoord = coord => {
        this.bubbleContextXCoord = coord
    }

    setBubbleContextYCoord = coord => {
        this.bubbleContextYCoord = coord
    }

    // Selection
    setSelectedText = text => {
        this.selectedText = text
    }

    // Открытие окна проверки статуса
    setIsCheckStatusModalShow = bool => {
        this.isCheckStatusModalShow = bool
    }

    // Открытие окна добавления файла
    setShowAddFileModal = bool => {
        this.showAddFileModal = bool
    }


    setOffsetY = () => {
        this.offsetY = window.pageYOffset
    }

    setShowEditRequestModal = bool => {
        this.isShowEditRequestModal = bool
    }


    setIsShowSendMessageModal = bool => {
        this.isShowSendMessageModal = bool
    }

    setIsShowCarlistModal = bool => {
        this.isShowCarlistModal = bool
    }


    // Список поиска техники из контекстного меню заявок для проверки статуса
    setFoundVehiclesByRegNom = data => {
        this.foundVehiclesByRegNom = data
    }

    setSortBy = sortType => {
        this.sortBy = sortType
    }

    setCheckStatusLoading = bool => {
        this.checkStatusLoading = bool
    }

    setSearchInputValue = value => {
        this.searchInputValue = value
    }

    //statistics
    setDateFrom(date) {
        this.dateFrom = date
    }
    setDateTill(date) {
        this.dateTill = date
    }
    setCurrentStat(stat) {
        this.currentStat = stat
    }
    setIsLoadingStat(bool) {
        this.isLoadingStat = bool
    }
}




export default new Store()