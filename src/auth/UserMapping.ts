export interface IndexType {
    [key : string] : string
};

export interface UserCollectionType extends IndexType {
    admin : string,
    instructor : string,
    client : string
};

export const userCollections : UserCollectionType = {
    admin : 'administrators',
    client : 'clients',
    instructor : 'instructors'
};