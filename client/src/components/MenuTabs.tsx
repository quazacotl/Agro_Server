import {NavLink} from "react-router-dom";
import CurrentUser from "./CurrentUser";

const MenuTabs = () => {
    return (
        <div className={'flex justify-between px-24 h-14'}>
            <div className={'flex'}>
                <div className="flex h-14">
                    <NavLink
                        className={({ isActive }) => "nav-link flex items-center justify-center h-full w-28 text-xl bg-tab-gradient active:bg-tab-active text-white h-12 rounded-b-2xl focus:shadow-input-focus focus:outline-none" + (isActive ? " h-16" : "")}
                        to='/'
                    >
                        <div>Заявки</div>
                    </NavLink>
                    {/*<button onClick={(e) => {*/}
                    {/*    e.preventDefault()*/}
                    {/*    window.location.href = 'SteamTest:'*/}
                    {/*}} >Steamtest</button>*/}
                    <NavLink
                        className={({ isActive }) => "ml-5 nav-link flex items-center justify-center h-full w-28 text-xl bg-tab-gradient active:bg-tab-active text-white h-12 rounded-b-2xl focus:shadow-input-focus focus:outline-none" + (isActive ? " h-16" : "")}
                        to='/monitor'>
                        <div>Монитор</div>
                    </NavLink>
                </div>
            </div>
            <CurrentUser/>
        </div>

    )
}

export default MenuTabs;