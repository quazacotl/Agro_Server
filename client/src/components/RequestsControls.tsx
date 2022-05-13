import Store from "../state/Store";
import {regionsEnum, sortTypesEnum} from "../interfaces/interfaces";
import {observer} from "mobx-react-lite"
import useMongoService from "../services/useMongoService";
import useUpdateAfterEdit from "../hooks/useUpdateAfterRequstEdit";
import {sortRequest} from "../funcs/funcs";

const RequestsControls = observer(() => {

    const {searchRequests} = useMongoService()
    const {updateAfterRequestEdit} = useUpdateAfterEdit()

    const changeRegion = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (Store.searchInputValue) Store.setSearchInputValue('')
        Store.setCurrentRegionSelected(event.target.value)
    }

    const onSearchRequest = async (event: React.FormEvent<HTMLInputElement>) => {
        Store.setSearchInputValue(event.currentTarget.value)
        if (Store.searchInputValue.length > 2) {
            const res = await searchRequests({regNum: event.currentTarget.value})
            Store.setRequestsData(res)
        } else if (Store.searchInputValue.length < 3) {
            await updateAfterRequestEdit()
        }
    }

    const onSortBy = (e:React.ChangeEvent<HTMLSelectElement>) => {
        Store.setSortBy(e.currentTarget.value)
        sortRequest(Store.sortBy)
    }

    const onShowClosed = () => {
        if (Store.searchInputValue) Store.setSearchInputValue('')
        Store.toggleIsShowUnexecuted()
    }

    return (
        <form className={'my-8  flex justify-center gap-12 xl:gap-24'}>
            <div className={'flex flex-col'}>
                <label className={'text-xl text-white block ml-2'} htmlFor="region-select">Выбор региона</label>
                <select
                    onChange={changeRegion}
                    className={'mt-3 px-4 py-2 mx-auto text-xl border-none rounded-xl w-[330px] focus:shadow-input-focus focus:ring-0'}
                    name="region-select"
                    id="region-select"
                    defaultValue={Store.currentRegionSelected}
                >
                    <option value={regionsEnum.all}>Все заявки</option>
                    <option value={regionsEnum.vor}>Воронеж</option>
                    <option value={regionsEnum.ore}>Орёл</option>
                    <option value={regionsEnum.kur}>Курск</option>
                    <option value={regionsEnum.lip}>Липецк</option>
                    <option value={regionsEnum.bel}>Белгород</option>
                    <option value={regionsEnum.tul}>Тула</option>
                    <option value={regionsEnum.vorreg}>Воронеж, Липецк, Белгород</option>
                    <option value={regionsEnum.orereg}>Орёл, Тула</option>
                </select>
            </div>
            <div className={'flex flex-col'}>
                <label className={'text-xl text-white block ml-2'} htmlFor="request-search">Поиск по заявкам</label>
                <input
                    type="text"
                    className={'mt-3 px-4 py-2 mx-auto border-none text-xl rounded-xl w-[220px] focus:shadow-input-focus focus:ring-0'}
                    id={'request-search'}
                    name={'request-search'}
                    placeholder={'3 символа минимум'}
                    value={Store.searchInputValue}
                    onChange={(e) => onSearchRequest(e)}
                />
            </div>
            <div className={'flex flex-col'}>
                <label className={'text-xl text-white block ml-2'} htmlFor="sort-by">Сортировка</label>
                <select
                    onChange={e => onSortBy(e)}
                    className={'mt-3 px-4 py-2 mx-auto text-xl border-none rounded-xl w-[180px] focus:shadow-input-focus focus:ring-0'}
                    name="sort-by"
                    id="sort-by"
                    defaultValue={Store.sortBy}
                >
                    <option value={sortTypesEnum.date}>По дате</option>
                    <option value={sortTypesEnum.base}>По хозяйству</option>
                    <option value={sortTypesEnum.type}>По типу</option>
                </select>
            </div>
            <div className={'flex self-end mb-2 gap-8'}>
                <label className={'text-xl text-white block w-[180px]'} htmlFor="{'checkClosed'}">Показать закрытые</label>
                <input
                    checked={Store.isShowUnexecuted}
                    onChange={onShowClosed}
                    className={'w-6 h-6 border-none focus:shadow-input-focus focus:ring-0 focus:ring-offset-0 text-amber-500'}
                    type="checkbox" id={'checkClosed'}/>
            </div>
            <button
                type={"button"}
                onClick={() => Store.setShowRequestModal(true)}
                className={'min-w-[230px] h-14 border-2 border-amber-500 self-end rounded-lg bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:shadow-input-focus text-2xl text-white'}
            >Создать заявку
            </button>
            <div className={'self-end mb-2  text-white text-xl'}>
                <h2>Заявок: {Store.requestsData ? Store.requestsData.length : '0'}</h2>
            </div>
        </form>
    );
});

export default RequestsControls;