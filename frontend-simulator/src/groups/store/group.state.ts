import {Group} from '../group.model';

/**
 * This is the slice that is added to the global rxjs store for groups.
 * The insertion of this slice into the global state is achieved using
 * StoreModule.forFeature() in the group.module.
 *
 * Groups are not organized in a flat list, they are contained in a tree
 * hierarchy. A group can be the parent of several child groups.
 *
 * This arrangement can be repeated over several levels recursively.
 * A group can be a tenant, a building, a floor within a building an area, a
 * room, ...
 */
export interface GroupState {
  // the root of the tree hierarchy of all groups
  rootGroup?: Group;

  // the currently selected group in the hierarchy of all groups
  currentGroup?: Group;
}

/**
 * Each module extends the global store state by it's individual slice.
 * This is done in a modular fashion so that inidividual feature modules can be
 * removed without hurting other feature modules.
 */
declare module 'src/app/store/app.state' {
  export interface AppState {
    // add the group slice to the global store
    groups: GroupState;
  }
}
