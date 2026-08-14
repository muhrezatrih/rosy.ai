export interface EscalationInfo {
  required: boolean;
  ownerNumber: string;
  whatsappUrl: string;
  actionLabel?: string;
  reason?: string;
}

export interface AttachmentData {
  file: File;
  previewUrl: string;
  name: string;
  size: string;
  type: string;
  isImage: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    size: string;
    type: string;
    previewUrl?: string;
    isImage: boolean;
  };
  escalation?: EscalationInfo;
  isError?: boolean;
}

export interface RoomCategory {
  id: string;
  name: string;
  type: string;
  priceMonthly: number;
  priceFormatted: string;
  totalUnits: number;
  availableUnits: number;
  condition: string;
  size: string;
  description: string;
  facilities: string[];
}

export interface IndividualRoom {
  number: string;
  categoryId: string;
  name: string;
  status: 'Kosong' | 'Terisi';
  tenantName: string | null;
}

export interface TenantItem {
  id: string;
  name: string;
  roomNumber: string;
  categoryId: string;
  checkInDate: string;
  nextDueDate: string;
  phone?: string;
}

export interface InventoryData {
  summary: {
    name: string;
    address: string;
    totalRooms: number;
  };
  categories: RoomCategory[];
  rooms: IndividualRoom[];
  tenants: TenantItem[];
}

export interface RoomItem {
  id: string;
  title: string;
  price: string;
  period: string;
  size: string;
  status: string;
  description: string;
  facilities: string[];
  tag: string;
  accentColor: string;
}
