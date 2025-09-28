import {ShortMember} from '@app/shared/model/short-member.entity';

export class Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  member: ShortMember;
  groupId: number;

  constructor(
    id: number,
    title: string,
    description: string,
    dueDate: string,
    createdAt: string,
    updatedAt: string,
    status: string,
    member: ShortMember,
    groupId: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.member = member;
    this.groupId = groupId;
  }
}
