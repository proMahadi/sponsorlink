import React from "react";
import Tabination from "@/utils/Tabination";

function Settings() {

    function Account() {
        return (
            <div>
                
            </div>
        );
    }

    function Billing() {
        return (
            <div>
                
            </div>
        );
    }
    
    return (
        
        <Tabination tabs={[
            { label: "Account", value: "1", Content: Account },
            { label: "Billing", value: "2", Content: Billing },
        ]} initialValue="1" hideDivider={true} />
    );
    }

export default Settings;