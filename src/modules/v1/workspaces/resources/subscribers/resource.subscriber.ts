import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
    DataSource,
} from 'typeorm';
import { Resource } from '../entities/resource.entity';
import { ResourceType } from '../enums/resource.enum';
import { FilesService } from '../files.service';

@EventSubscriber()
export class ResourceSubscriber implements EntitySubscriberInterface<Resource> {

    constructor(dataSource: DataSource, private readonly fileService: FilesService
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return Resource;
    }

    async afterRemove(event: RemoveEvent<Resource>) {
        const resource = event.databaseEntity;
        if (resource && resource.type === ResourceType.FILE) 
            this.fileService.removeFile(resource.fileUrl);
    }
}
