import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import {
  SiteBranding,
  MediaItem,
  ProjectCaseStudy,
  ConsultationRequest,
  AboutPageInfo,
  StrategicPartner,
  EpcSectionConfig
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

// ----------------------------------------------------
// 1. Site Branding & Hero Image Sync
// ----------------------------------------------------
const BRANDING_DOC_PATH = 'site_config';
const BRANDING_DOC_ID = 'branding';

export function subscribeToBranding(
  onUpdate: (branding: Partial<SiteBranding>) => void,
  onError?: (err: unknown) => void
) {
  const docRef = doc(db, BRANDING_DOC_PATH, BRANDING_DOC_ID);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as Partial<SiteBranding>);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, `${BRANDING_DOC_PATH}/${BRANDING_DOC_ID}`);
      if (onError) onError(err);
    }
  );
}

export async function saveBrandingToFirestore(branding: SiteBranding): Promise<void> {
  const docRef = doc(db, BRANDING_DOC_PATH, BRANDING_DOC_ID);
  try {
    // Strip undefined values
    const sanitized = JSON.parse(JSON.stringify(branding));
    sanitized.updatedAt = new Date().toISOString();
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${BRANDING_DOC_PATH}/${BRANDING_DOC_ID}`);
    throw err;
  }
}

// ----------------------------------------------------
// 2. Media Library Items Sync (Shared across all PCs)
// ----------------------------------------------------
const MEDIA_COLLECTION_PATH = 'media_items';

export function subscribeToMediaItems(
  onUpdate: (items: MediaItem[]) => void,
  onError?: (err: unknown) => void
) {
  const collRef = collection(db, MEDIA_COLLECTION_PATH);
  return onSnapshot(
    collRef,
    (snap) => {
      const items: MediaItem[] = [];
      snap.forEach((d) => {
        items.push(d.data() as MediaItem);
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, MEDIA_COLLECTION_PATH);
      if (onError) onError(err);
    }
  );
}

export async function saveMediaItemToFirestore(item: MediaItem): Promise<void> {
  const docRef = doc(db, MEDIA_COLLECTION_PATH, item.id);
  try {
    const sanitized = JSON.parse(JSON.stringify(item));
    await setDoc(docRef, sanitized);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${MEDIA_COLLECTION_PATH}/${item.id}`);
    throw err;
  }
}

export async function deleteMediaItemFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, MEDIA_COLLECTION_PATH, id);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${MEDIA_COLLECTION_PATH}/${id}`);
    throw err;
  }
}

// ----------------------------------------------------
// 3. Projects Sync
// ----------------------------------------------------
const PROJECTS_COLLECTION_PATH = 'projects';

export function subscribeToProjects(
  onUpdate: (projects: ProjectCaseStudy[]) => void,
  onError?: (err: unknown) => void
) {
  const collRef = collection(db, PROJECTS_COLLECTION_PATH);
  return onSnapshot(
    collRef,
    (snap) => {
      const projs: ProjectCaseStudy[] = [];
      snap.forEach((d) => {
        projs.push(d.data() as ProjectCaseStudy);
      });
      if (projs.length > 0) {
        onUpdate(projs);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, PROJECTS_COLLECTION_PATH);
      if (onError) onError(err);
    }
  );
}

export async function saveProjectToFirestore(project: ProjectCaseStudy): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION_PATH, project.id);
  try {
    const sanitized = JSON.parse(JSON.stringify(project));
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${PROJECTS_COLLECTION_PATH}/${project.id}`);
    throw err;
  }
}

export async function deleteProjectFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION_PATH, id);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PROJECTS_COLLECTION_PATH}/${id}`);
    throw err;
  }
}

// ----------------------------------------------------
// 4. Consultation Requests Sync
// ----------------------------------------------------
const CONSULTATIONS_PATH = 'consultations';

export function subscribeToConsultations(
  onUpdate: (requests: ConsultationRequest[]) => void,
  onError?: (err: unknown) => void
) {
  const collRef = collection(db, CONSULTATIONS_PATH);
  return onSnapshot(
    collRef,
    (snap) => {
      const requests: ConsultationRequest[] = [];
      snap.forEach((d) => {
        requests.push(d.data() as ConsultationRequest);
      });
      if (requests.length > 0) {
        // Sort newest first
        requests.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        onUpdate(requests);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, CONSULTATIONS_PATH);
      if (onError) onError(err);
    }
  );
}

export async function saveConsultationToFirestore(req: ConsultationRequest): Promise<void> {
  const docRef = doc(db, CONSULTATIONS_PATH, req.id);
  try {
    const sanitized = JSON.parse(JSON.stringify(req));
    await setDoc(docRef, sanitized);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${CONSULTATIONS_PATH}/${req.id}`);
    throw err;
  }
}

export async function updateConsultationInFirestore(
  id: string,
  updated: Partial<ConsultationRequest>
): Promise<void> {
  const docRef = doc(db, CONSULTATIONS_PATH, id);
  try {
    const sanitized = JSON.parse(JSON.stringify(updated));
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${CONSULTATIONS_PATH}/${id}`);
    throw err;
  }
}

// ----------------------------------------------------
// 5. About Page & EPC Section Sync
// ----------------------------------------------------
export function subscribeToAboutInfo(
  onUpdate: (info: Partial<AboutPageInfo>) => void
) {
  const docRef = doc(db, 'site_config', 'about_info');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as Partial<AboutPageInfo>);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'site_config/about_info');
    }
  );
}

export async function saveAboutInfoToFirestore(info: AboutPageInfo): Promise<void> {
  const docRef = doc(db, 'site_config', 'about_info');
  try {
    const sanitized = JSON.parse(JSON.stringify(info));
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'site_config/about_info');
  }
}

export function subscribeToEpcConfig(
  onUpdate: (data: { partners?: StrategicPartner[]; config?: EpcSectionConfig }) => void
) {
  const docRef = doc(db, 'site_config', 'epc_section');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data());
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'site_config/epc_section');
    }
  );
}

export async function saveEpcConfigToFirestore(
  partners: StrategicPartner[],
  config: EpcSectionConfig
): Promise<void> {
  const docRef = doc(db, 'site_config', 'epc_section');
  try {
    const sanitized = JSON.parse(JSON.stringify({ partners, config }));
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'site_config/epc_section');
  }
}
