import {Member} from '../../shared/model/member.entity';

export class Group {
  id: number;
  name: string;
  imgUrl: string;
  description: string;
  code: string;
  memberCount: number;
  members: Member[];
  constructor() {
    this.id = 0;
    this.name = '';
    this.imgUrl = '';
    this.description = '';
    this.code = '';
    this.memberCount = 0;
    this.members = [];
  }
}
