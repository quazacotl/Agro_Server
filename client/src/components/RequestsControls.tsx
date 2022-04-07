import Store from "../state/Store";
import {regions} from "../interfaces/interfaces";
import {observer, useLocalObservable} from "mobx-react-lite"
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
            updateAfterRequestEdit()
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
                    className={'mt-3 px-4 py-2 mx-auto text-xl rounded-xl w-[330px] focus:shadow-input-focus focus:outline-none'}
                    name="region-select"
                    id="region-select"
                    defaultValue={Store.currentRegionSelected}
                >
                    <option value={regions.all}>Все заявки</option>
                    <option value={regions.vor}>Воронеж</option>
                    <option value={regions.ore}>Орёл</option>
                    <option value={regions.kur}>Курск</option>
                    <option value={regions.lip}>Липецк</option>
                    <option value={regions.bel}>Белгород</option>
                    <option value={regions.tul}>Тула</option>
                    <option value={regions.vorreg}>Воронеж, Липецк, Белгород</option>
                    <option value={regions.orereg}>Орёл, Тула</option>
                </select>
            </div>
            <div className={'flex flex-col'}>
                <label className={'text-xl text-white block ml-2'} htmlFor="request-search">Поиск по заявкам</label>
                <input
                    type="text"
                    className={'mt-3 px-4 py-2 mx-auto text-xl rounded-xl w-[220px] focus:shadow-input-focus focus:outline-none'}
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
                    className={'mt-3 px-4 py-2 mx-auto text-xl rounded-xl w-[180px] focus:shadow-input-focus focus:outline-none'}
                    name="sort-by"
                    id="sort-by"
                    defaultValue={Store.sortBy}
                >
                    <option value={'date'}>По дате</option>
                    <option value={'ObjName'}>По хозяйству</option>
                    <option value={'RequestType'}>По типу</option>
                </select>
            </div>
            <div className={'flex self-end mb-2 gap-8'}>
                <label className={'text-xl text-white block w-[180px]'} htmlFor="{'checkClosed'}">Показать закрытые</label>
                <input checked={Store.isShowUnexecuted} onChange={onShowClosed} className={'w-6 h-6 focus:shadow-input-focus focus:outline-none text-amber-500'} type="checkbox" id={'checkClosed'}/>
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