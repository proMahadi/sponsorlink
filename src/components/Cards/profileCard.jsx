import React, { useState, useEffect } from "react";
import { Edit3 } from "@geist-ui/icons";

const ProfileCard = ({ title, subtitle, children, userData, setUserData, handleSetCachedUserData }) => {
    const [editMode, setEditMode] = useState(false);
    const [formValues, setFormValues] = useState(userData);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleCancelClick = () => {
        setFormValues(userData);
        setEditMode(false);
    };

    const handleSaveClick = () => {
        console.log("formValues on before save", formValues);
        setUserData(formValues);
        console.log("userData after save", userData);
        setEditMode(false);
        setTimeout(() => handleSetCachedUserData(), 10);
    };

    useEffect(() => {
        console.log('Updated userData:', userData);
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSelectChange = (value) => {
        setFormValues({
            ...formValues,
            country: value
        });
    };

    const handleToggleChange = (e) => {
        setFormValues({
            ...formValues,
            available: e.target.checked
        });
    };

    const handleBioChange = (e) => {
        const { value } = e.target;
        if (value.length <= 300) {
            setFormValues({
                ...formValues,
                bio: value
            });
        }
    };

    const handleTagChange = (value) => {
        setFormValues({
            ...formValues,
            tags: value
        });
    };

    return (
        <div className="profile-section">
            <div className="profile-section-title">
                <div>{title}</div>
                <div>{subtitle}</div>
            </div>
            <div className="profile-section-card">
                <div className="card-content">
                    {React.cloneElement(children, {
                        editMode,
                        formValues,
                        handleInputChange,
                        handleSelectChange,
                        handleToggleChange,
                        handleBioChange,
                        handleTagChange
                    })}
                </div>
                <div className="card-divider" />
                <div className="card-buttons">
                    {editMode ? (
                        <>
                            <div className="button btn-secondary" onClick={handleCancelClick}>Cancel</div>
                            <div className="button btn-primary" onClick={handleSaveClick}>Save Changes</div>
                        </>
                    ) : (
                        <div className="button btn-secondary" onClick={handleEditClick}>
                            <Edit3 size={16} />
                            <div>Edit</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;