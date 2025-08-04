export interface CollectionObject {
    objectID: number;
    primaryImage: string;
    primaryImageSmall: string;
    additionalImages: string[];
    constituents: Constituents[]
    title: string;
    artistDisplayName: string;
    artistDisplayBio: string;
    objectBeginDate: number;
    objectEndDate: number;
    medium: string;
    department: string;
    objectWikidata_URL: string;
}

export interface Constituents {
    constituentID: number;
    role: string;
    name: string;
    constituentULAN_URL: string;
    constituentWikidata_URL: string;
    gender: string;
}
