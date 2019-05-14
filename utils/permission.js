const readValue = 4; // 100
const writeValue = 2; // 010
const createValue = 1; // 001

export function buildPermission({ read, write, create }) {
  let permission = 0;
  if (create) permission = permission | createValue;
  if (write) permission = permission | writeValue;
  if (read) permission = permission | readValue;
  return permission;
}

export function canRead(permissions) {
  return !!(permissions & readValue);
}

export function canWrite(permissions) {
  return !!(permissions & writeValue);
}

export function canCreate(permissions) {
  return !!(permissions & createValue);
}