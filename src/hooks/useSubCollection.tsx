import { collection, onSnapshot, query, DocumentData, Query, orderBy, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { db } from '../firebase';

interface MessageData {
    timeStamp: Timestamp;
    message: string;
    imageUrl?: string;
    user: {
        uid: string;
        photo: string;
        email: string;
        displayName: string;
    };
}


const useSubCollection = (
    collectionName: string,
    subcollectionName: string
) => {
    const [subDocuments, setSubDocuments] = useState<MessageData[]>([]);
    const channelId = useAppSelector((state)=> state.channel.channelId);

    useEffect(()=> {
        let collectionRef = collection(db, "channels",String(channelId),"messages");

        const collectionRefOrderBy = query(collectionRef, orderBy("timeStamp", "desc"));
        onSnapshot(collectionRefOrderBy, (snapshot)=> {
            let results: MessageData[] = [];
            snapshot.docs.forEach((doc)=> {
                results.push({
                    timeStamp: doc.data().timeStamp,
                    message: doc.data().message,
                    user: doc.data().user,
                    imageUrl: doc.data().imageUrl,
                });
            });
            setSubDocuments(results);
            console.log("結果",results);
        });
    },[channelId]);
    return {subDocuments};
};

export default useSubCollection;