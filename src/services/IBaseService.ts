export interface IBaseService {
    
    create(entity : object) : Promise<object>;

    modify(oldEntityId : string, newEntity : object) : Promise<object>;

    delete(entityId : string) : Promise<object>;

    get(filter : object, projection : object) : Promise<object[]>;

    getOne(entityId : string) : Promise<object>;
    
}