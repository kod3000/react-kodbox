"use client";
import React, { createContext, useContext, useState } from 'react';


const KodBoxContext = createContext(null as any);

export const useKodBox = () => useContext(KodBoxContext);

export const KodBoxProvider = ({ children }) => {
    const [storageBoxProperty, setStorageBoxProperty] = useState({});
    const [lambdaProperty, setLambdaProperty] = useState({});

    const getProperty = (key: string) => storageBoxProperty[key];

    const setProperty = (key: string, value: any) => {
        setStorageBoxProperty(prev => ({ ...prev, [key]: value }));
    };

    const setLambda = (functionName: string, bindedFunctionReference: any) => {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`Binding Function {${functionName}} to the lambdaProperty object`);
        }
        setLambdaProperty(prev => ({ ...prev, [functionName]: bindedFunctionReference }));
    };

    const lambda = (bindedFunctionName: string) => {
        if (lambdaProperty.hasOwnProperty(bindedFunctionName)) {
            return lambdaProperty[bindedFunctionName];
        } else {
            console.error(`Function ${bindedFunctionName} does not exist inside the lambdaProperty object, maybe it was never bound?`);
            return null;
        }
    };

    const has = (key: string) => storageBoxProperty.hasOwnProperty(key) || lambdaProperty.hasOwnProperty(key);

    const binded = (key: string) => storageBoxProperty.hasOwnProperty(key) && lambdaProperty.hasOwnProperty(key);

    const remove = (key: string, destroy: boolean = false) => {
        if (destroy) {
            delete storageBoxProperty[key];
            setStorageBoxProperty({ ...storageBoxProperty });
        } else {
            const descriptor = Object.getOwnPropertyDescriptor(storageBoxProperty, key);
            if (descriptor && descriptor.writable) {
                delete storageBoxProperty[key];
                setStorageBoxProperty({ ...storageBoxProperty });
            } else {
                console.error(`${key} Property is readonly. Cannot be removed.`);
            }
        }
    };

    const destroy = () => {
        setStorageBoxProperty({});
        setLambdaProperty({});
        sessionStorage.removeItem('StorageBox');
    };

    const get = (key: string) => {
        if (storageBoxProperty.hasOwnProperty(key)) {
            return storageBoxProperty[key];
        } else {
            const storageBoxData = sessionStorage.getItem('StorageBox');
            if (storageBoxData) {
                const storageBoxProperties = JSON.parse(storageBoxData);
                if (storageBoxProperties.hasOwnProperty(key)) {
                    setStorageBoxProperty(storageBoxProperties);
                    return storageBoxProperties[key];
                }
            }
            return null;
        }
    };

    const set = (key: string, value: any, readonly: boolean = false, updatePersitence: boolean = false) => {
        if (!readonly) {
            storageBoxProperty[key] = value;
            setStorageBoxProperty({ ...storageBoxProperty });
        } else {
            Object.defineProperty(storageBoxProperty, key, {
                value: value,
                writable: false,
                enumerable: true,
                configurable: true
            });
            setStorageBoxProperty({ ...storageBoxProperty });
        }
        if (updatePersitence) {
            sessionStorage.setItem('StorageBox', JSON.stringify(storageBoxProperty));
        }
    };

    const setAsync = async (key: string, value: any, readonly: boolean = false, updatePersitence: boolean = false, refreshPersistence: boolean = false) => {
        if (readonly) {
            Object.defineProperty(storageBoxProperty, key, {
                value: value,
                writable: false,
                enumerable: true,
                configurable: true
            });
        } else {
            storageBoxProperty[key] = value;
        }
        setStorageBoxProperty({ ...storageBoxProperty });

        if (updatePersitence) {
            if (refreshPersistence) {
                sessionStorage.removeItem('StorageBox');
            }
            sessionStorage.setItem('StorageBox', JSON.stringify(storageBoxProperty));
        }
    };

    return (
        <KodBoxContext.Provider value={{
            getProperty,
            setProperty,
            setLambda,
            lambda,
            has,
            binded,
            remove,
            destroy,
            get,
            set,
            setAsync
        }}>
            {children}
        </KodBoxContext.Provider>
    );
};