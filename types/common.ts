export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export type AsyncStatus = "idle" | "loading" | "success" | "error";

