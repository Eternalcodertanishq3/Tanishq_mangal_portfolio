'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  collection,
  onSnapshot,
  query,
  orderBy,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

type UseFirestoreDocOptions = {
  path: string;
  listen?: boolean;
};

export function useFirestoreDoc<T extends DocumentData>({ path, listen = false }: UseFirestoreDocOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, path);

    if (listen) {
      const unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          setData(snap.exists() ? (snap.data() as T) : null);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      import('firebase/firestore').then(({ getDoc }) => {
        getDoc(docRef).then((snap) => {
          setData(snap.exists() ? (snap.data() as T) : null);
          setLoading(false);
        }).catch((err) => {
          setError(err.message);
          setLoading(false);
        });
      });
    }
  }, [path, listen]);

  return { data, loading, error };
}

type UseFirestoreCollectionOptions = {
  path: string;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  listen?: boolean;
};

export function useFirestoreCollection<T extends DocumentData>({
  path,
  orderByField,
  orderDirection = 'asc',
  listen = false,
}: UseFirestoreCollectionOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const colRef = collection(db, path);
    const q = orderByField
      ? query(colRef, orderBy(orderByField, orderDirection))
      : colRef;

    if (listen) {
      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          setData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as T)));
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      import('firebase/firestore').then(({ getDocs }) => {
        getDocs(q).then((snap) => {
          setData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as T)));
          setLoading(false);
        }).catch((err) => {
          setError(err.message);
          setLoading(false);
        });
      });
    }
  }, [path, orderByField, orderDirection, listen]);

  const refresh = useCallback(() => {
    setLoading(true);
    const colRef = collection(db, path);
    const q = orderByField
      ? query(colRef, orderBy(orderByField, orderDirection))
      : colRef;
    
    import('firebase/firestore').then(({ getDocs }) => {
      getDocs(q).then((snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as T)));
        setLoading(false);
      });
    });
  }, [path, orderByField, orderDirection]);

  return { data, loading, error, refresh };
}
