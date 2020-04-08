import {Group} from '../group.model';

/**
 * This is the slice that is added to the global rxjs store for groups
 */
export interface GroupState {
  rootGroup?: Group;
}
