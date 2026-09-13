export type ActionAvailability = Record<string, boolean>;

export type VisibilityContext = {
  visible?: boolean;
  disabled?: boolean;
  reason?: string;
};

export type PermissionResolver = (permission: string) => VisibilityContext;
