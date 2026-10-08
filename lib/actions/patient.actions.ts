'use server'


import { AppwriteException, ID, Models, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"
import { InputFile } from "node-appwrite/file";
import { GenderOptions } from "@/constants"

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name)
        console.log({newUser})
        return parseStringify(newUser);

    } catch(error: any) {

        if(error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal('email', [user.email]),
            ]);
             return existingUser.users[0];
        }
    }
};

export const getUser = async (userId: string): Promise<User | null> => {
    try {
        const user = await users.get(userId)
        return parseStringify(user);
    } catch(error) {
        if (error instanceof AppwriteException && error.code === 404) {
            return null
        }

        throw error
    }
}

export const registerPatient = async ({identificationDocument, ...patient}: 
RegisterUserParams) => {
    try {
    if (!GenderOptions.includes(patient.gender)) {
        throw new Error("Le genre fourni n'est pas reconnu.")
    }

        let file;
        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/$
                {file?.$id}/view?project=${PROJECT_ID}`,
                ...patient,
                gender: patient.gender,
            }
        )
        return parseStringify(newPatient)
    } catch(error) {
        console.error("Error registering patient:", error);

        if (error instanceof AppwriteException && error.type === "general_unauthorized_scope") {
            throw new Error(
                "La clé API Appwrite doit disposer du scope documents.write et, si un justificatif est téléversé, files.write."
            )
        }

        throw error
    }
}

export const getPatient = async(userId: string) => {
    if (!userId?.trim()) {
        throw new Error("Impossible de rechercher le patient : userId manquant.");
    }

    try {
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId', userId)]
        );
        const patient = patients.documents[0];
        return patient ? parseStringify(patient) : null;

    } catch(error) {
        if (error instanceof AppwriteException && error.code === 404) {
            return null
        }

        throw error
    }
}
