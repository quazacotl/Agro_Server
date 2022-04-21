import {NavLink} from "react-router-dom";
import CurrentUser from "./CurrentUser";

const MenuTabs = () => {
    return (
        <div className={'flex justify-between px-24 h-14'}>
            <div className={'flex'}>
                <div className="flex h-14">
                    <NavLink
                        className={({ isActive }) => "nav-link flex items-center justify-center h-full w-28 text-xl bg-tab-gradient bg-200p active:bg-tab-active duration-500 hover:bg-right-center hover:text-amber-300 text-white h-12 rounded-b-2xl focus:shadow-input-focus focus:border-none focus:ring-0 focus:ring-offset-0" + (isActive ? " h-16" : "")}
                        to='/'
                    >
                        <div className={'text-shadow-md'}>Заявки</div>
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => "ml-5 nav-link flex items-center justify-center h-full w-28 text-xl bg-tab-gradient bg-200p active:bg-tab-active duration-500 hover:bg-right-center hover:text-amber-300 text-white h-12 rounded-b-2xl focus:shadow-input-focus focus:border-none focus:ring-0 focus:ring-offset-0" + (isActive ? " h-16" : "")}
                        to='/monitor'>
                        <div className={'text-shadow-md'}>Монитор</div>
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => "ml-5 nav-link flex items-center justify-center h-full w-28 text-xl bg-tab-gradient bg-200p active:bg-tab-active duration-500 hover:bg-right-center hover:text-amber-300 text-white h-12 rounded-b-2xl focus:shadow-input-focus focus:border-none focus:ring-0 focus:ring-offset-0" + (isActive ? " h-16" : "")}
                        to='/statistic'>
                        <div className={'text-shadow-md'}>Статистика</div>
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => "ml-5 nav-link flex items-center justify-center h-full w-28 text-xl bg-tab-gradient bg-200p active:bg-tab-active duration-500 hover:bg-right-center hover:text-amber-300 text-white h-12 rounded-b-2xl focus:shadow-input-focus focus:border-none focus:ring-0 focus:ring-offset-0" + (isActive ? " h-16" : "")}
                        to='/map'>
                        <div className={'text-shadow-md'}>Карта</div>
                    </NavLink>
                </div>
            </div>
            <CurrentUser/>
        </div>

    )
}

export default MenuTabs;