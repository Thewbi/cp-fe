import { GroupState } from 'src/groups/store/group.state';

/**
 * This interface will be extended by the modules of the application.
 */
export interface AppState {
    groups: GroupState;
}
