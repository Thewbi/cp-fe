import {Injectable} from '@angular/core';
import {isEmpty, isNil} from 'lodash';
import {Converter} from 'src/common/converter';
import {TreeNode} from 'src/common/treenode.model';
import {Group} from 'src/groups/group.model';
import {DeviceReference} from 'src/groups/group.model';

@Injectable()
export class GroupTreeConverter implements Converter<Group, TreeNode> {
  convert(source: Group, target: TreeNode) {
    target.payload = source;
    target.name = source.description;

    // child groups
    if (!isEmpty(source.children)) {
      const childTreeNodes = source.children.map(g => {
        const childTreeNode = new TreeNode();
        this.convert(g, childTreeNode);

        return childTreeNode;
      });

      // if there is no array yet, add one
      if (isNil(target.children)) {
        target.children = new Array<TreeNode>();
      }

      target.children = target.children.concat(childTreeNodes);
    }

    // deviceReferences
    if (!isEmpty(source.deviceReferences)) {
      const deviceReferenceTreeNodes = source.deviceReferences.map(dr => {
        const childTreeNode = new TreeNode();
        this.convertDeviceReference(dr, childTreeNode);

        return childTreeNode;
      });

      // if there is no array yet, add one
      if (isNil(target.children)) {
        target.children = new Array<TreeNode>();
      }

      target.children = target.children.concat(deviceReferenceTreeNodes);
    }
  }

  convertDeviceReference(source: DeviceReference, target: TreeNode) {
    target.payload = source;
    target.name = source.guid;
  }
}
