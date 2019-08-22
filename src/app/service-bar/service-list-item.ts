export default class ServiceListItem {
  enable?: boolean;
  lock?: boolean;
  refLock: number;
  refCount: number;
  name: string;
}