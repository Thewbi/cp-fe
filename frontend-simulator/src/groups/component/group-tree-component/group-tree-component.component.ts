import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {Store} from '@ngrx/store';
import {isEmpty, isNil} from 'lodash';
import {Observable} from 'rxjs';
import {AppState} from 'src/app/store/app.state';
import {TreeNode} from 'src/common/treenode.model';
import {Device} from 'src/devices/device.model';
import {GroupTreeConverter} from 'src/groups/converter/group-tree.converter';
import {Group} from 'src/groups/group.model';
import {getRootGroupSelector} from 'src/groups/store/group.selector';

@Component({
  selector: 'cockpit-group-tree-component',
  providers: [GroupTreeConverter],
  templateUrl: './group-tree-component.component.html',
  styleUrls: ['./group-tree-component.component.css']
})
export class GroupTreeComponentComponent implements OnInit {
  treeControl = new NestedTreeControl<TreeNode>(treeNode => {
    return treeNode.children;
  });
  dataSource: MatTreeNestedDataSource<TreeNode>;

  rootGroup: Observable<Group>;

  @Output() groupSelected = new EventEmitter<Group>();

  constructor(
      private store: Store<AppState>,
      private groupTreeConverter: GroupTreeConverter) {}

  ngOnInit(): void {
    this.rootGroup = this.store.select(getRootGroupSelector);
    this.rootGroup.subscribe(g => {
      if (isNil(g)) {
        return;
      }

      const rootTreeNode = new TreeNode();

      this.groupTreeConverter.convert(g, rootTreeNode);

      this.dataSource = new MatTreeNestedDataSource<TreeNode>();
      this.dataSource.data = Array.of(rootTreeNode);

      // this.treeControl = new NestedTreeControl<Group>(node => node.children);
    });
  }

  // hasChild = (_: number, node: Group) =>
  //     !!node.children && node.children.length > 0

  hasChild =
      (_: number, node: Group) => {
        if (!isEmpty(node.children)) {
          return true;
        }

        // if (!isEmpty(node.deviceReferences)) {
        //   return true;
        // }

        return false;
      }

  // isDevice =
  //     (_: number, node: any) => {
  //       return node instanceof Device;
  //     }

  // isGroup =
  //     (_: number, node: any) => {
  //       return node instanceof Group;
  //     }

  nodeClick(group: Group) {
    this.groupSelected.emit(group);
  }
}
