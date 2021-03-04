import React from "react";

const AddFilePromt = (props) => {
    return (
        <div className={props.showAddFile ? "chat__addFileModal" : "notShow"}>
            <form style={{ border: props.fileError ? "1px solid red" : null }}>
                <p style={{ display: props.fileError ? "block" : "none" }}>
                    This not a valid file type
                </p>
                <input type="file" onChange={props.fileHandler} />
                <input
                    type="submit"
                    disabled={
                        props.fileError || props.fileSend === null
                            ? true
                            : false
                    }
                    onClick={props.fileUploadHandler}
                />
            </form>
        </div>
    );
};

export default AddFilePromt;
