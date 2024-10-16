import React, { useEffect, useMemo, useState } from 'react'
import DrawerPop from '../common/DrawerPop';
import * as yup from "yup";
import { useFormik } from "formik";
import { notification } from "antd";
import { useTranslation } from 'react-i18next';
import API, { action, fileAction } from '../Api';
import FormInput from '../common/FormInput';
import FileUpload from '../common/FileUpload';
import { useNotification } from '../../Context/Notifications/Notification';


export default function AddDocuments({
    open,
    refresh,
    fileUpdateId,
    close = () => { }
}) {
    const organisationId = 1;
    const [isUpdate, setIsUpdate] = useState();
    const [show, setShow] = useState(open);
    useMemo(
        () =>
          setTimeout(() => {
            show === false && close(false);
          }, 800),
        [show]
      );
    
    const handleClose = () => {
        setShow(false);
    };
    const { t } = useTranslation();
    const [file, setFile] = useState("");

    const { showNotification } = useNotification();
    const [loading,setLoading] = useState(false)

    const openNotification = (type, title, description) => {
        showNotification({
            placement: "top",
            message: title,
            description: description,
            type: type,
        });
    };

    const formik = useFormik({
        initialValues: {
            documentName: "",
        },
        enableReinitialize: true,
        validateOnChange: false,
        validationSchema: yup.object().shape({
            documentName: yup.string().required("Document name is required"),
        }),
        onSubmit: async (e) => {
            setLoading(true)
            // console.log({
            //     documentName: e.documentName,
            // });
            try {
                if (fileUpdateId && file) {
                    const formData = new FormData();
                    formData.append('action', 'organizationDocumentReUpload');
                    formData.append('organisationDocumentId', fileUpdateId);
                    formData.append('organisationId', organisationId);
                    formData.append('documentName', e.documentName);
                    formData.append('file', e.file);

                    try {
                        const response = await fileAction(formData);
                        if (response.status === 200) {
                            openNotification("success", "Successful", response.message);
                            formik.resetForm();
                            setTimeout(() => {
                                handleClose();
                                refresh();
                                setLoading(false)
                            }, 2500);
                        }
                    } catch (error) {
                        openNotification("error", "Something went wrong", error.message);
                        setLoading(false)
                    }
                } else if (file) {
                    const formData = new FormData();
                    formData.append('action', 'organizationDocumentUpload');
                    formData.append('organisationId', organisationId);
                    formData.append('documentName', e.documentName);
                    formData.append('file', e.file);

                    try {
                        const response = await fileAction(formData);
                        if (response.status === 200) {
                            openNotification("success", "Successful", response.message);
                            formik.resetForm();
                            setTimeout(() => {
                                handleClose();
                                refresh();
                                setLoading(false)
                            }, 2500);
                        }
                    }
                    catch (error) {
                        openNotification("error", "Something went wrong", error.message);
                        setLoading(false)
                    }
                } else {
                    openNotification("error", "Something went wrong", "No file found");
                    setLoading(false)
                }
                
            } catch (error) {
                openNotification("error", "Failed", error);
                setLoading(false)
            }
        },
    });

    const getIdBasedDocument = async (e) => {
        try {
            if (e !== "" && fileUpdateId !== false) {
                const result = await action(API.GET_ALL_ORGANISATION_DOCS, { organisationId: organisationId, organisationDocumentId: fileUpdateId });

                if (result.status === 200) {
                    const docData = result.result[0];
                    formik.setFieldValue("organisationId", docData.organisationId);
                    formik.setFieldValue("organisationDocumentId", docData.organisationDocumentId);
                    formik.setFieldValue("documentName", docData.documentName);
                    formik.setFieldValue("file", docData.documentFile);
                    setIsUpdate(true);
                }
                // // setGetIdBasedUpdatedRecords(result.data);
                // console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getIdBasedDocument(fileUpdateId);
    }, [fileUpdateId]);

    return (
        <div>
            <DrawerPop
                open={show}
                close={(e) => {
                    handleClose();
                }}
                handleSubmit={(e) => {
                    formik.handleSubmit();
                }}
                contentWrapperStyle={{
                    width: "400px",
                }}
                header={[
                    !isUpdate ? t("Add Document") : t("Update Document"),
                    !isUpdate
                        ? t("Add new document")
                        : t("Update selected document"),
                ]}
                footerBtn={[t("Cancel"), t("Save")]}
                footerBtnDisabled={loading}
            >
                <div className='relative w-full h-full'>
                    <FormInput
                        title={t("Document name")}
                        placeholder={t("Name")}
                        change={(e) => {
                            formik.setFieldValue("documentName", e);
                        }}
                        value={formik.values.documentName}
                        error={formik.values.documentName ? "" : formik.errors.documentName}
                        required={true}
                    />

                    <div className='mt-8'>
                        <FileUpload
                            change={(e) => {
                                if (e) {
                                    formik.setFieldValue("file", e);
                                    setFile(e)
                                }
                            }}
                        />
                    </div>
                   
                </div>

            </DrawerPop >
        </div >
    )
}
