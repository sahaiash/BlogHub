'use client'
import { UserButton,OrganizationSwitcher} from "@clerk/nextjs";

import * as React from "react";
const Nav:React.FC=()=>{
    return (
        <nav className="p-4 flex justify-between items-center">
            <div>
                <h1>Blog Application</h1>
            </div>
            <div> 
                <OrganizationSwitcher afterSelectOrganizationUrl="/org/:slug" />
                <UserButton/>
            </div>
        </nav>
    )
}

export default Nav;